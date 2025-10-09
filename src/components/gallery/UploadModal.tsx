"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import Image from "next/image";
import { MediaItem } from "./GalleryItem";

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (items: MediaItem[]) => void;
}

interface FileUploadState {
  id: string; // 고유 ID (타임스탬프 기반)
  file: File; // 파일명이 고유 ID로 변경됨 (ex. 1728467234567-abc123.jpg)
  originalName: string; // 원본 파일명 (UI 표시용)
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  uploadId?: string;
  s3Key?: string;
}

interface UploadInfo {
  uploadId: string;
  filename: string;
  presignedUrl: string;
  presignedThumbnailUrl: string; // WebP 썸네일 업로드 URL
  s3Key: string;
  thumbnailS3Key: string; // 항상 .webp 확장자
  contentType?: string; // 백엔드에서 presigned URL 생성 시 사용한 ContentType (optional)
  expiresIn?: number; // 900 (15분)
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 50;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'],
  video: ['.mp4', '.mov', '.avi']
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.jongwony.com";

// UUID 생성 함수
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [files, setFiles] = useState<Map<string, FileUploadState>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readersRef = useRef<FileReader[]>([]);

  const isHeifFile = (file: File): boolean => {
    return file.type === 'image/heic' || file.type === 'image/heif' ||
           file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
  };

  const convertHeifToJpeg = async (file: File): Promise<File> => {
    try {
      // Create image bitmap from HEIF file
      const imageBitmap = await createImageBitmap(file);

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      ctx.drawImage(imageBitmap, 0, 0);

      // Convert to JPEG blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create JPEG blob'));
            }
          },
          'image/jpeg',
          0.9
        );
      });

      // Create new File from blob with .jpg extension
      const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
      return new File([blob], newFileName, { type: 'image/jpeg' });
    } catch (error) {
      console.error('HEIF conversion failed:', error);
      throw new Error('HEIF 파일 변환에 실패했습니다. 브라우저가 HEIF를 지원하지 않을 수 있습니다.');
    }
  };

  /**
   * 이미지를 WebP 썸네일로 변환
   * @param file 원본 이미지 파일 (또는 JPEG로 변환된 파일)
   * @param maxSize 최대 너비/높이 (기본 300px)
   * @param quality WebP 품질 (기본 0.8)
   */
  const convertToWebPThumbnail = async (
    file: File,
    maxSize = 300,
    quality = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // HTMLImageElement를 명시적으로 생성 (Next.js Image 컴포넌트와 구분)
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        // 종횡비 유지 리사이징
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // WebP 변환
        canvas.toBlob(
          (blob) => {
            // 메모리 해제
            URL.revokeObjectURL(img.src);
            canvas.width = canvas.height = 0;

            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP 썸네일 생성 실패'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('이미지 로드 실패'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * 비디오에서 WebP 썸네일 추출
   * @param file 비디오 파일
   * @param maxSize 최대 너비/높이 (기본 300px)
   * @param quality WebP 품질 (기본 0.8)
   */
  const extractVideoThumbnailWebP = async (
    file: File,
    maxSize = 300,
    quality = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      video.onloadeddata = () => {
        video.currentTime = 0; // 첫 프레임
      };

      video.onseeked = () => {
        // 종횡비 유지 리사이징
        let { videoWidth: width, videoHeight: height } = video;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);

        // WebP 변환
        canvas.toBlob(
          (blob) => {
            // 메모리 해제
            URL.revokeObjectURL(video.src);
            canvas.width = canvas.height = 0;

            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('비디오 썸네일 생성 실패'));
            }
          },
          'image/webp',
          quality
        );
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('비디오 로드 실패'));
      };

      video.src = URL.createObjectURL(file);
      video.load();
    });
  };

  const validateFile = (file: File): string | null => {
    // 1. 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return "파일 크기는 50MB 이하여야 합니다";
    }

    if (file.size === 0) {
      return "빈 파일은 업로드할 수 없습니다";
    }

    // 2. MIME type 검증
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return "이미지 또는 동영상 파일만 업로드 가능합니다";
    }

    // 3. 파일 확장자 검증
    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext) {
      return "파일 확장자가 없습니다";
    }

    const allowedExts = isImage
      ? ALLOWED_EXTENSIONS.image
      : ALLOWED_EXTENSIONS.video;

    if (!allowedExts.includes(ext)) {
      return `허용되지 않는 파일 확장자입니다: ${ext}`;
    }

    // 4. 파일명 길이 검증
    if (file.name.length > 255) {
      return "파일명이 너무 깁니다 (최대 255자)";
    }

    // 5. 위험한 문자 검사
    if (/[<>:"|?*\x00-\x1f]/.test(file.name)) {
      return "파일명에 허용되지 않는 문자가 포함되어 있습니다";
    }

    return null;
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    console.log(`[addFiles] 선택된 파일 수: ${fileArray.length}`, fileArray.map(f => f.name));

    const currentCount = files.size;

    if (currentCount + fileArray.length > MAX_FILES) {
      setGlobalError(`최대 ${MAX_FILES}개의 파일만 업로드할 수 있습니다`);
      return;
    }

    setGlobalError("");

    // Process files (with HEIF conversion if needed)
    for (const file of fileArray) {
      console.log(`[addFiles] 처리 시작: ${file.name}`);
      const error = validateFile(file);
      if (error) {
        console.log(`[addFiles] 검증 실패: ${file.name} - ${error}`);
        setGlobalError(error);
        continue;
      }

      try {
        // Step 1: 고유 ID 생성
        const fileId = generateId();
        const originalName = file.name;

        // Step 2: HEIF 변환 (필요시)
        let processedFile = file;
        if (isHeifFile(file)) {
          console.log(`[addFiles] HEIF 변환 시작: ${originalName}`);
          processedFile = await convertHeifToJpeg(file);
          console.log(`[addFiles] HEIF 변환 완료: ${originalName} → JPEG`);
        }

        // Step 3: 파일 확장자 추출
        const extension = processedFile.name.match(/\.([^.]+)$/)?.[1] || 'bin';

        // Step 4: 새 파일명 생성 (고유 ID + 확장자)
        const newFileName = `${fileId}.${extension}`;
        const renamedFile = new File([processedFile], newFileName, {
          type: processedFile.type
        });
        console.log(`[addFiles] 파일명 변경: ${originalName} → ${newFileName}`);

        // Step 5: 미리보기 생성
        const reader = new FileReader();
        readersRef.current.push(reader);

        reader.onload = (e) => {
          // Remove from ref after completion
          readersRef.current = readersRef.current.filter(r => r !== reader);

          setFiles((prevFiles) => {
            const newMap = new Map(prevFiles);
            console.log(`[addFiles] Map에 추가: ${newFileName} (원본: ${originalName})`);
            newMap.set(newFileName, {
              id: fileId,
              file: renamedFile,
              originalName,
              preview: e.target?.result as string,
              progress: 0,
              status: "pending",
            });
            return newMap;
          });
        };

        reader.onerror = () => {
          readersRef.current = readersRef.current.filter(r => r !== reader);
          console.error(`[addFiles] FileReader 에러: ${originalName}`);
          setGlobalError(`${originalName} 미리보기 생성 실패`);
        };

        reader.readAsDataURL(renamedFile);
      } catch (error) {
        console.error(`[addFiles] 파일 처리 실패: ${file.name}`, error);
        setGlobalError((error as Error).message || `${file.name} 처리 실패`);
      }
    }

    console.log(`[addFiles] 처리 완료. 현재 Map 크기: ${files.size}`);
  }, [files]);

  const removeFile = (filename: string) => {
    setFiles((prev) => {
      const newMap = new Map(prev);
      const fileState = newMap.get(filename);
      if (fileState) {
        console.log(`[removeFile] 삭제: ${fileState.originalName}`);
      }
      newMap.delete(filename);
      return newMap;
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  // Cleanup on unmount
  useEffect(() => {
    const currentFiles = files;

    return () => {
      // Abort all ongoing reads
      readersRef.current.forEach(reader => reader.abort());

      // Revoke object URLs to free memory
      currentFiles.forEach((fileState) => {
        if (fileState.preview.startsWith('blob:')) {
          URL.revokeObjectURL(fileState.preview);
        }
      });
    };
  }, [files]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
  };

  const updateFileProgress = (filename: string, progress: number, status: FileUploadState["status"], error?: string) => {
    setFiles((prev) => {
      const newMap = new Map(prev);
      const fileState = newMap.get(filename);
      if (fileState) {
        console.log(`[updateFileProgress] ${fileState.originalName}: ${progress}% - ${status}`);
        newMap.set(filename, { ...fileState, progress, status, error });
      } else {
        console.error(`[updateFileProgress] 파일을 찾을 수 없음: ${filename}`);
      }
      return newMap;
    });
  };

  /**
   * 단일 파일을 S3에 업로드 (재시도 포함)
   * @param url Presigned URL
   * @param data 업로드할 데이터 (File 또는 Blob)
   * @param contentType Content-Type
   * @param maxRetries 최대 재시도 횟수
   */
  const uploadToS3WithRetry = async (
    url: string,
    data: Blob | File,
    contentType: string,
    maxRetries = 3
  ): Promise<void> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: data,
        });

        if (response.ok) {
          return;
        }

        throw new Error(`Upload failed with status ${response.status}`);
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  };

  /**
   * 원본 + 썸네일을 S3에 업로드
   */
  const uploadToS3 = async (
    filename: string,
    uploadInfo: UploadInfo,
    fileState: FileUploadState
  ): Promise<{ uploadId: string; s3Key: string; thumbnailS3Key: string }> => {
    try {
      updateFileProgress(filename, 0, "uploading");

      const isImage = fileState.file.type.startsWith("image/");
      const isVideo = fileState.file.type.startsWith("video/");

      // Step 1: 원본 업로드
      const contentType = uploadInfo.contentType || fileState.file.type || 'application/octet-stream';
      console.log(`[S3 PUT Original] ${fileState.originalName} (${filename}): contentType="${contentType}"`);

      await uploadToS3WithRetry(
        uploadInfo.presignedUrl,
        fileState.file,
        contentType
      );

      updateFileProgress(filename, 50, "uploading");

      // Step 2: 썸네일 생성
      let thumbnailBlob: Blob;
      if (isImage) {
        console.log(`[Thumbnail] ${fileState.originalName}: WebP 썸네일 생성 중...`);
        thumbnailBlob = await convertToWebPThumbnail(fileState.file);
      } else if (isVideo) {
        console.log(`[Thumbnail] ${fileState.originalName}: 비디오 썸네일 생성 중...`);
        thumbnailBlob = await extractVideoThumbnailWebP(fileState.file);
      } else {
        throw new Error("지원하지 않는 파일 형식");
      }

      // Step 3: 썸네일 업로드
      console.log(`[S3 PUT Thumbnail] ${fileState.originalName}: size=${thumbnailBlob.size} bytes`);
      await uploadToS3WithRetry(
        uploadInfo.presignedThumbnailUrl,
        thumbnailBlob,
        'image/webp'
      );

      updateFileProgress(filename, 100, "success");

      return {
        uploadId: uploadInfo.uploadId,
        s3Key: uploadInfo.s3Key,
        thumbnailS3Key: uploadInfo.thumbnailS3Key,
      };
    } catch (error) {
      console.error(`[uploadToS3] 업로드 실패: ${fileState.originalName}`, error);
      const errorMessage = (error as Error).message || "업로드 실패";
      updateFileProgress(filename, 0, "error", errorMessage);
      throw error;
    }
  };

  interface CompleteResponseItem {
    id: string;
    type: 'image' | 'video';
    original_url: string;
    thumbnail_url: string; // WebP 썸네일 (이미지와 비디오 모두)
    likes?: number;
    uploaded_at: string;
  }

  interface CompleteResponse {
    items: CompleteResponseItem[];
    success: number;
    failed: number;
  }

  const handleUpload = async () => {
    if (files.size === 0) return;

    setIsUploading(true);
    setGlobalError("");

    try {
      // Step 1: Initialize upload
      const filesArray = Array.from(files.values());
      console.log(`[handleUpload] 업로드 시작: ${filesArray.length}개 파일`);

      const initResponse = await fetch(`${API_BASE_URL}/iac/gallery/v1/upload/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: filesArray.map((f) => {
            const contentType = f.file.type || 'application/octet-stream';
            console.log(`[Upload Init] ${f.file.name} (원본: ${f.originalName}): contentType="${contentType}"`);
            return {
              filename: f.file.name,
              contentType,
              size: f.file.size,
            };
          }),
        }),
      });

      if (!initResponse.ok) {
        throw new Error("업로드 초기화 실패");
      }

      const { uploads }: { uploads: UploadInfo[] } = await initResponse.json();

      // Step 2: Upload to S3 (parallel)
      const uploadPromises = uploads.map((upload: UploadInfo) => {
        // 파일명이 곧 Map 키이므로 직접 조회
        const fileState = files.get(upload.filename);
        if (!fileState) {
          return Promise.reject(new Error(`File state not found for ${upload.filename}`));
        }

        return uploadToS3(upload.filename, upload, fileState);
      });

      const uploadResults = await Promise.allSettled(uploadPromises);

      // Step 3: Complete upload
      const successfulUploads = uploadResults
        .filter((r): r is PromiseFulfilledResult<{ uploadId: string; s3Key: string; thumbnailS3Key: string }> => r.status === "fulfilled")
        .map((r) => r.value);

      const failedUploads = uploadResults
        .map((r, idx) => r.status === 'rejected' ? uploads[idx].filename : null)
        .filter(Boolean);

      if (successfulUploads.length === 0) {
        throw new Error("모든 파일 업로드 실패");
      }

      if (failedUploads.length > 0) {
        setGlobalError(
          `${failedUploads.length}개 파일 업로드 실패: ${failedUploads.join(', ')}`
        );
      }

      const completeResponse = await fetch(`${API_BASE_URL}/iac/gallery/v1/upload/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: successfulUploads }),
      });

      if (!completeResponse.ok) {
        throw new Error("업로드 완료 처리 실패");
      }

      const result: CompleteResponse = await completeResponse.json();

      // Convert API response to MediaItem format
      const newItems: MediaItem[] = result.items.map((item: CompleteResponseItem) => ({
        id: item.id,
        type: item.type,
        originalUrl: item.original_url,
        thumbnailUrl: item.thumbnail_url, // WebP 썸네일
        likes: item.likes || 0,
        uploadedAt: item.uploaded_at,
      }));

      // Short delay to show success message
      setTimeout(() => {
        onSuccess(newItems);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setGlobalError("업로드에 실패했습니다. 다시 시도해주세요.");
      setIsUploading(false);
    }
  };

  const filesArray = Array.from(files.values());
  const totalProgress = filesArray.length > 0
    ? Math.round(filesArray.reduce((sum, f) => sum + f.progress, 0) / filesArray.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      {/* Background */}
      <div className="absolute inset-0" onClick={isUploading ? undefined : onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">사진 및 동영상 업로드</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error */}
        {globalError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {globalError}
          </div>
        )}

        {/* Upload area or file list */}
        {files.size === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium">
              파일을 드래그하거나 클릭하여 선택
            </p>
            <p className="text-sm text-gray-500">
              이미지: JPG, PNG, WebP, GIF, HEIC (최대 50MB)
            </p>
            <p className="text-sm text-gray-500">
              동영상: MP4, MOV, AVI (최대 50MB)
            </p>
            <p className="mt-2 text-sm text-gray-500">
              최대 {MAX_FILES}개 파일
            </p>
            <p className="mt-1 text-xs text-gray-400">
              * HEIC/HEIF 파일은 자동으로 JPEG로 변환됩니다
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </div>
        ) : (
          <>
            {/* File list */}
            <div className="mb-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {filesArray.map((fileState) => {
                const isImage = fileState.file.type.startsWith("image/");
                const isVideo = fileState.file.type.startsWith("video/");

                return (
                  <div
                    key={fileState.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    {/* Preview */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                      {isImage ? (
                        <Image
                          src={fileState.preview}
                          alt={fileState.file.name}
                          fill
                          className="object-cover"
                        />
                      ) : isVideo ? (
                        <video
                          src={fileState.preview}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isImage ? (
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Video className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="truncate text-sm font-medium">
                          {fileState.originalName}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({(fileState.file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>

                      {/* Progress */}
                      {fileState.status === "uploading" && (
                        <div className="mb-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>업로드 중...</span>
                            <span>{fileState.progress}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${fileState.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      {fileState.status === "success" && (
                        <span className="text-xs text-green-600">✓ 업로드 완료</span>
                      )}
                      {fileState.status === "error" && (
                        <span className="text-xs text-red-600">
                          ✗ {fileState.error || "업로드 실패"}
                        </span>
                      )}
                      {fileState.status === "pending" && (
                        <span className="text-xs text-gray-500">대기 중</span>
                      )}
                    </div>

                    {/* Remove button */}
                    {!isUploading && (
                      <button
                        onClick={() => removeFile(fileState.file.name)}
                        className="flex-shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add more files */}
            {!isUploading && files.size < MAX_FILES && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                + 파일 추가 ({files.size}/{MAX_FILES})
              </button>
            )}

            {/* Overall progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>전체 진행률</span>
                  <span>{totalProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || files.size === 0}
                className="flex-1 rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {isUploading ? `업로드 중... (${totalProgress}%)` : `${files.size}개 업로드`}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </>
        )}
      </div>
    </div>
  );
}

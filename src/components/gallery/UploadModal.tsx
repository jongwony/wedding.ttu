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
  file: File;
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
  s3Key: string;
  contentType?: string; // 백엔드에서 presigned URL 생성 시 사용한 ContentType (optional)
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

    const currentCount = files.size;

    if (currentCount + fileArray.length > MAX_FILES) {
      setGlobalError(`최대 ${MAX_FILES}개의 파일만 업로드할 수 있습니다`);
      return;
    }

    setGlobalError("");

    // Process files (with HEIF conversion if needed)
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setGlobalError(error);
        continue;
      }

      try {
        // Convert HEIF to JPEG if needed
        let processedFile = file;
        if (isHeifFile(file)) {
          console.log(`Converting HEIF file: ${file.name}`);
          processedFile = await convertHeifToJpeg(file);
          console.log(`Converted to JPEG: ${processedFile.name}`);
        }

        // Create preview
        const reader = new FileReader();
        readersRef.current.push(reader);

        reader.onload = (e) => {
          // Remove from ref after completion
          readersRef.current = readersRef.current.filter(r => r !== reader);

          setFiles((prevFiles) => {
            const newMap = new Map(prevFiles);
            newMap.set(processedFile.name, {
              file: processedFile,
              preview: e.target?.result as string,
              progress: 0,
              status: "pending",
            });
            return newMap;
          });
        };

        reader.onerror = () => {
          readersRef.current = readersRef.current.filter(r => r !== reader);
          setGlobalError(`${processedFile.name} 미리보기 생성 실패`);
        };

        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        setGlobalError((error as Error).message || `${file.name} 처리 실패`);
      }
    }
  }, [files]);

  const removeFile = (filename: string) => {
    setFiles((prev) => {
      const newMap = new Map(prev);
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
        newMap.set(filename, { ...fileState, progress, status, error });
      }
      return newMap;
    });
  };

  const uploadToS3 = async (
    uploadInfo: UploadInfo,
    fileState: FileUploadState
  ): Promise<{ uploadId: string; s3Key: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          updateFileProgress(uploadInfo.filename, progress, "uploading");
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          updateFileProgress(uploadInfo.filename, 100, "success");
          resolve({
            uploadId: uploadInfo.uploadId,
            s3Key: uploadInfo.s3Key,
          });
        } else {
          const error = "업로드 실패";
          updateFileProgress(uploadInfo.filename, 0, "error", error);
          reject(new Error(error));
        }
      });

      xhr.addEventListener("error", () => {
        const error = "네트워크 오류";
        updateFileProgress(uploadInfo.filename, 0, "error", error);
        reject(new Error(error));
      });

      // 백엔드가 contentType을 반환하면 그것을 사용, 아니면 file.type 사용
      const contentType = uploadInfo.contentType || fileState.file.type || 'application/octet-stream';
      console.log(`[S3 PUT] ${uploadInfo.filename}: contentType="${contentType}" (backend: ${uploadInfo.contentType}, file: ${fileState.file.type})`);

      xhr.open("PUT", uploadInfo.presignedUrl);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(fileState.file);
    });
  };

  interface CompleteResponseItem {
    id: string;
    type: 'image' | 'video';
    original_url: string;
    optimized_url?: string;
    thumbnail_url?: string;
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
      const initResponse = await fetch(`${API_BASE_URL}/iac/gallery/v1/upload/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: filesArray.map((f) => {
            const contentType = f.file.type || 'application/octet-stream';
            console.log(`[Upload Init] ${f.file.name}: contentType="${contentType}"`);
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
        const fileState = files.get(upload.filename);
        if (!fileState) {
          return Promise.reject(new Error(`File ${upload.filename} not found`));
        }
        return uploadToS3(upload, fileState);
      });

      const uploadResults = await Promise.allSettled(uploadPromises);

      // Step 3: Complete upload
      const successfulUploads = uploadResults
        .filter((r): r is PromiseFulfilledResult<{ uploadId: string; s3Key: string }> => r.status === "fulfilled")
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
        optimizedUrl: item.optimized_url || '',
        thumbnailUrl: item.thumbnail_url,
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
                    key={fileState.file.name}
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
                          {fileState.file.name}
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

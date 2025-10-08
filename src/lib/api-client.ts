/**
 * API 클라이언트 유틸리티
 * 통합된 fetch 래퍼로 타임아웃, 에러 처리, 타입 안전성 제공
 */

import { ENV } from './env';
import { APIError } from './api-error';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  original_url: string;
  optimized_url: string;
  thumbnail_url: string;
  likes: number;
  uploaded_at: string;
}

interface UploadItem {
  uploadId: string;
  filename: string;
  presignedUrl: string;
  s3Key: string;
  expiresIn: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${ENV.API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError(408, '요청 시간이 초과되었습니다');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Gallery API helpers
export const galleryAPI = {
  getItems: (page: number, limit: number) =>
    apiClient<{ items: GalleryItem[] }>(`/iac/gallery/v1/items?page=${page}&limit=${limit}`),

  likeItem: (id: string) =>
    apiClient<{ success: boolean }>(`/iac/gallery/v1/items/${id}/like`, {
      method: 'POST',
    }),

  initUpload: (files: Array<{ filename: string; contentType: string; size: number }>) =>
    apiClient<{ uploads: UploadItem[] }>('/iac/gallery/v1/upload/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    }),

  completeUpload: (items: Array<{ uploadId: string; s3Key: string }>) =>
    apiClient<{ items: GalleryItem[]; success: number; failed: number }>('/iac/gallery/v1/upload/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }),
};

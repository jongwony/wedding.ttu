/**
 * 환경 변수 관리 유틸리티
 * 모든 환경 변수를 중앙화하고 타입 체크를 수행합니다.
 */

function getEnvVar(key: string, fallback: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set, using fallback: ${fallback}`);
  }
  return value || fallback;
}

export const ENV = {
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://api.jongwony.com'),
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ITEMS_PER_PAGE: 30,
  MAX_FILES: 50,
} as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo"
] as const;

export const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  video: ['.mp4', '.mov', '.avi']
} as const;

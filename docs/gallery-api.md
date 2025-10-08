# Gallery API Documentation

## Overview

Gallery 프로젝트는 이미지 및 비디오 미디어 업로드, 변환, 조회 기능을 제공하는 서버리스 API입니다.

**Base URL**: `https://api.jongwony.com/iac/gallery/v1`

**주요 특징**:
- iPhone HEIC 이미지 자동 JPEG 변환
- 비동기 변환 파이프라인 (업로드 즉시 응답)
- S3 기반 영구 저장
- Aurora DSQL 메타데이터 관리

---

## Authentication

현재 인증 없음 (추후 추가 예정)

---

## Endpoints

### 1. 미디어 업로드

원본 파일을 S3에 업로드하고 비동기 변환 작업을 시작합니다.

**Endpoint**: `POST /media`

**Content-Type**: `multipart/form-data`

**Request**:
```http
POST /iac/gallery/v1/media
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="IMG_1234.heic"
Content-Type: image/heic

[binary data]
------WebKitFormBoundary--
```

**Supported File Types**:

| Category | MIME Type | Extension | Notes |
|----------|-----------|-----------|-------|
| **Image** | `image/jpeg` | `.jpg`, `.jpeg` | 변환 없이 저장 |
| | `image/png` | `.png` | 변환 없이 저장 |
| | `image/webp` | `.webp` | 변환 없이 저장 |
| | `image/gif` | `.gif` | 변환 없이 저장 |
| | `image/heic` | `.heic` | **JPEG 변환** |
| | `image/heif` | `.heif` | **JPEG 변환** |
| **Video** | `video/mp4` | `.mp4` | 변환 없이 저장 |
| | `video/quicktime` | `.mov` | 향후 MP4 변환 예정 |

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "image",
  "original_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.heic",
  "original_s3_key": "wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.heic",
  "processing_status": "pending",
  "uploaded_at": "2025-10-08T12:34:56Z"
}
```

**Response Fields**:
- `id`: 미디어 고유 ID (UUID)
- `type`: 미디어 타입 (`image` 또는 `video`)
- `original_url`: 원본 파일 S3 URL (Presigned URL, 1시간 유효)
- `original_s3_key`: S3 객체 키
- `processing_status`: 변환 상태
  - `pending`: 변환 대기 중
  - `processing`: 변환 진행 중
  - `completed`: 변환 완료
  - `failed`: 변환 실패
- `uploaded_at`: 업로드 시각 (ISO 8601)

**Error Responses**:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | `Bad Request` | multipart/form-data 파싱 실패 |
| 400 | `Unsupported content type` | 지원하지 않는 파일 형식 |
| 413 | `Payload Too Large` | 파일 크기 50MB 초과 |
| 500 | `Internal Server Error` | S3 업로드 또는 DSQL 저장 실패 |

**Example (cURL)**:
```bash
curl -X POST https://api.jongwony.com/iac/gallery/v1/media \
  -F "file=@/path/to/photo.heic"
```

---

### 2. 미디어 변환 상태 조회

업로드한 미디어의 변환 상태를 확인합니다. 변환 완료 시 JPEG/MP4 URL을 반환합니다.

**Endpoint**: `GET /media/:id/status`

**Request**:
```http
GET /iac/gallery/v1/media/550e8400-e29b-41d4-a716-446655440000/status
```

**Response (200 OK) - 변환 대기 중**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "processing_status": "pending"
}
```

**Response (200 OK) - 변환 진행 중**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "processing_status": "processing"
}
```

**Response (200 OK) - 변환 완료**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "processing_status": "completed",
  "optimized_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/processed/550e8400-e29b-41d4-a716-446655440000.jpg",
  "thumbnail_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/thumbnails/550e8400-e29b-41d4-a716-446655440000_thumb.jpg",
  "processed_at": "2025-10-08T12:35:30Z"
}
```

**Response (200 OK) - 변환 실패**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "processing_status": "failed",
  "processing_error": "Failed to decode HEIC file: unsupported color profile"
}
```

**Error Responses**:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 404 | `Not Found` | 존재하지 않는 미디어 ID |

**폴링 권장사항**:
- 변환 완료까지 평균 5-10초 소요 (HEIC → JPEG)
- Polling interval: 2초 간격 권장
- 최대 대기 시간: 60초 (타임아웃 처리)

**Example (JavaScript)**:
```javascript
async function waitForProcessing(mediaId) {
  const maxAttempts = 30;  // 60초 (2초 × 30회)

  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://api.jongwony.com/iac/gallery/v1/media/${mediaId}/status`
    );
    const data = await response.json();

    if (data.processing_status === 'completed') {
      return data;  // optimized_url, thumbnail_url 사용 가능
    }

    if (data.processing_status === 'failed') {
      throw new Error(data.processing_error);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Processing timeout');
}
```

---

### 3. 미디어 조회

미디어 상세 정보를 조회합니다.

**Endpoint**: `GET /media/:id`

**Request**:
```http
GET /iac/gallery/v1/media/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "image",
  "original_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.heic",
  "optimized_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/processed/550e8400-e29b-41d4-a716-446655440000.jpg",
  "thumbnail_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/thumbnails/550e8400-e29b-41d4-a716-446655440000_thumb.jpg",
  "processing_status": "completed",
  "likes": 5,
  "uploaded_at": "2025-10-08T12:34:56Z",
  "processed_at": "2025-10-08T12:35:30Z"
}
```

**Error Responses**:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 404 | `Not Found` | 존재하지 않는 미디어 ID |

---

### 4. 미디어 목록 조회

업로드된 미디어 목록을 페이지네이션으로 조회합니다.

**Endpoint**: `GET /media`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `0` | 페이지 번호 (0부터 시작) |
| `limit` | integer | `30` | 페이지당 항목 수 (최대 100) |

**Request**:
```http
GET /iac/gallery/v1/media?page=0&limit=30
```

**Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "image",
      "optimized_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/processed/550e8400-e29b-41d4-a716-446655440000.jpg",
      "thumbnail_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/thumbnails/550e8400-e29b-41d4-a716-446655440000_thumb.jpg",
      "processing_status": "completed",
      "likes": 5,
      "uploaded_at": "2025-10-08T12:34:56Z"
    }
  ],
  "page": 0,
  "limit": 30,
  "total": 120
}
```

---

### 5. 좋아요 증가

미디어의 좋아요 수를 1 증가시킵니다.

**Endpoint**: `POST /media/:id/like`

**Request**:
```http
POST /iac/gallery/v1/media/550e8400-e29b-41d4-a716-446655440000/like
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "likes": 6
}
```

**Error Responses**:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 404 | `Not Found` | 존재하지 않는 미디어 ID |

---

## Processing Pipeline

### HEIC → JPEG 변환 플로우

```
1. Client → POST /media (HEIC 업로드)
   ↓
2. Lambda: 원본 S3 저장 (wedding-gallery/originals/{uuid}.heic)
   ↓
3. Response: { "processing_status": "pending" }
   ↓
4. S3 Event → Converter Lambda 트리거
   ↓
5. Converter Lambda:
   - S3에서 HEIC 다운로드
   - ImageMagick으로 JPEG 변환 (90% 품질, 최대 1920x1080)
   - 썸네일 생성 (320px 너비)
   - S3에 업로드 (processed/, thumbnails/)
   - DSQL 메타데이터 업데이트
   ↓
6. Client: GET /media/:id/status (폴링)
   ↓
7. Response: { "processing_status": "completed", "optimized_url": "...", "thumbnail_url": "..." }
```

**평균 변환 시간**:
- HEIC → JPEG (5MB): 3-5초
- 썸네일 생성: 1-2초
- 총 소요 시간: 5-10초

---

## Best Practices

### 1. 업로드 플로우

```javascript
// Step 1: 파일 업로드
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch(
  'https://api.jongwony.com/iac/gallery/v1/media',
  {
    method: 'POST',
    body: formData
  }
);

const { id, processing_status } = await uploadResponse.json();

// Step 2: 변환 완료 대기
if (processing_status === 'pending') {
  const result = await waitForProcessing(id);
  displayImage(result.optimized_url);  // JPEG 표시
  displayThumbnail(result.thumbnail_url);  // 썸네일 표시
}
```

### 2. 에러 처리

```javascript
try {
  const result = await waitForProcessing(mediaId);
  displayImage(result.optimized_url);
} catch (error) {
  if (error.message.includes('Processing timeout')) {
    // 타임아웃: 백그라운드 완료 대기 또는 재업로드 안내
    showNotification('변환이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
  } else {
    // 변환 실패: 사용자에게 오류 안내
    showError('파일 변환에 실패했습니다. 다른 파일을 선택해주세요.');
  }
}
```

### 3. 썸네일 우선 표시

```javascript
// 목록 조회 시 썸네일 먼저 표시
const { items } = await fetch(
  'https://api.jongwony.com/iac/gallery/v1/media?page=0&limit=30'
).then(r => r.json());

items.forEach(item => {
  if (item.processing_status === 'completed') {
    displayThumbnail(item.thumbnail_url);  // 썸네일 표시
  } else {
    displayPlaceholder();  // 변환 중 플레이스홀더
  }
});

// 클릭 시 원본 크기 이미지 표시
onThumbnailClick(item => {
  displayFullImage(item.optimized_url);  // JPEG 원본
});
```

### 4. 지원 형식 검증 (클라이언트 측)

```javascript
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif'
];

const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime'
];

function validateFile(file) {
  const isSupported =
    SUPPORTED_IMAGE_TYPES.includes(file.type) ||
    SUPPORTED_VIDEO_TYPES.includes(file.type);

  if (!isSupported) {
    throw new Error(`지원하지 않는 파일 형식: ${file.type}`);
  }

  const MAX_SIZE = 50 * 1024 * 1024;  // 50MB
  if (file.size > MAX_SIZE) {
    throw new Error('파일 크기는 50MB 이하만 업로드 가능합니다.');
  }
}
```

---

## Limitations

| Item | Limit | Notes |
|------|-------|-------|
| **파일 크기** | 50MB | API Gateway 제한 |
| **동시 업로드** | 100 TPS | Lambda 동시성 제한 |
| **변환 시간** | 최대 15분 | Lambda 타임아웃 |
| **S3 저장 기간** | 무제한 | Lifecycle 정책 미설정 |
| **Presigned URL 유효기간** | 1시간 | 보안 정책 |

---

## Changelog

### v1.0.0 (2025-10-08)
- ✅ 미디어 업로드 (multipart/form-data)
- ✅ HEIC → JPEG 자동 변환
- ✅ 썸네일 자동 생성
- ✅ 비동기 변환 파이프라인
- ✅ 상태 조회 API
- ✅ 좋아요 기능
- 🚧 MOV → MP4 변환 (향후 추가)
- 🚧 인증/인가 (향후 추가)

---

## Support

문의: GitHub Issues ([jongwony/iac](https://github.com/jongwony/iac))

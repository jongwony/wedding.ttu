# Gallery 백엔드 API 요구사항

## 개요
Wedding Gallery 페이지를 위한 백엔드 API 명세서입니다.
- 베이스 URL: `https://api.jongwony.com`
- 모든 응답은 JSON 형식
- CORS 설정 필요 (wedding.ttu 도메인 허용)

---

## 1. 갤러리 아이템 조회

### Endpoint
```
GET /gallery/items
```

### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| page | number | Yes | 페이지 번호 (0부터 시작) |
| limit | number | Yes | 페이지당 아이템 수 (권장: 30) |
| sort | string | No | 정렬 기준 (기본값: `uploadedAt:desc`) |

### Response
```json
{
  "items": [
    {
      "id": "string (UUID)",
      "type": "image | video",
      "src": "string (최적화된 파일 URL - webp/mp4)",
      "thumbnail": "string (동영상 썸네일 URL, 옵션)",
      "likes": "number",
      "uploadedAt": "string (ISO 8601 datetime)"
    }
  ],
  "total": "number (전체 아이템 수)",
  "hasMore": "boolean (다음 페이지 존재 여부)"
}
```

### 예시
```bash
curl "https://api.jongwony.com/iac/gallery/items?page=0&limit=30"
```

---

## 2. 파일 업로드

### Endpoint
```
POST /gallery/upload
```

### Request
- Content-Type: `multipart/form-data`
- Body:
  ```
  file: File (이미지 또는 동영상)
  ```

### 파일 제약사항
| 항목 | 제약 |
|------|------|
| 최대 크기 | 50MB |
| 이미지 타입 | JPG, PNG, WebP, GIF |
| 동영상 타입 | MP4, MOV, AVI |

### 처리 요구사항
1. **이미지**:
   - 원본을 AWS S3에 저장
   - WebP로 변환 및 최적화 (품질: 80-90)
   - 리사이즈 (최대 너비/높이: 2048px)
   - 썸네일 생성 (800x800)

2. **동영상**:
   - 원본을 AWS S3에 저장
   - MP4로 변환 (H.264 코덱)
   - 해상도 최적화 (최대 1080p)
   - 첫 프레임 썸네일 생성 (800x800 WebP)

### Response
```json
{
  "id": "string (UUID)",
  "url": "string (원본 URL)",
  "optimizedUrl": "string (최적화된 파일 URL)",
  "thumbnailUrl": "string (썸네일 URL, 동영상의 경우 필수)",
  "type": "image | video",
  "uploadedAt": "string (ISO 8601 datetime)"
}
```

### 에러 응답
```json
{
  "error": "string",
  "message": "string"
}
```

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잘못된 요청 (파일 타입 불일치, 크기 초과 등) |
| 413 | 파일 크기 초과 |
| 500 | 서버 오류 |

### 예시
```bash
curl -X POST https://api.jongwony.com/iac/gallery/upload \
  -F "file=@photo.jpg"
```

---

## 3. 좋아요 (Like)

### Endpoint
```
POST /gallery/items/{itemId}/like
```

### Path Parameters
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| itemId | string | 아이템 ID (UUID) |

### Request
- Body: 없음 (익명 좋아요)

### Response
```json
{
  "id": "string (아이템 ID)",
  "likes": "number (업데이트된 좋아요 수)",
  "success": true
}
```

### 구현 참고사항
- 익명 사용자의 중복 좋아요 방지는 클라이언트 측에서 관리 (간소화)
- 필요 시 IP 기반 또는 쿠키 기반 중복 방지 가능

### 예시
```bash
curl -X POST https://api.jongwony.com/iac/gallery/items/abc-123-def/like
```

---

## 데이터베이스 스키마 (참고)

### `gallery_items` 테이블
```sql
CREATE TABLE gallery_items (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('image', 'video') NOT NULL,
  original_url VARCHAR(512) NOT NULL,
  optimized_url VARCHAR(512) NOT NULL,
  thumbnail_url VARCHAR(512),
  likes INT DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uploaded_at (uploaded_at DESC)
);
```

### `gallery_likes` 테이블 (옵션 - IP 기반 중복 방지)
```sql
CREATE TABLE gallery_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  item_id VARCHAR(36) NOT NULL,
  ip_address VARCHAR(45),
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (item_id, ip_address),
  FOREIGN KEY (item_id) REFERENCES gallery_items(id) ON DELETE CASCADE
);
```

---

## AWS S3 버킷 구조

```
s3://jongwony-private/wedding-gallery/
├── originals/
│   ├── {uuid}.jpg
│   ├── {uuid}.mp4
│   └── ...
├── optimized/
│   ├── {uuid}.webp
│   ├── {uuid}.mp4
│   └── ...
└── thumbnails/
    ├── {uuid}_thumb.webp
    └── ...
```

### S3 퍼블릭 액세스 설정
- `optimized/` 및 `thumbnails/` 디렉토리는 퍼블릭 읽기 권한 필요

---

## 보안 고려사항

1. **파일 검증**
   - MIME 타입 검증 (서버 사이드)
   - 파일 헤더 확인 (매직 넘버)
   - 악성 코드 스캔 (옵션)

2. **입력 Sanitization**
   - 파일명 sanitize (특수문자 제거)
   - 쿼리 파라미터 검증

3. **CORS 설정**
   ```
   Access-Control-Allow-Origin: https://wedding.ttu.world
   Access-Control-Allow-Methods: GET, POST
   Access-Control-Allow-Headers: Content-Type
   ```

---

## 성능 최적화

1. **이미지 최적화**
   - WebP 포맷 사용 (원본 대비 30-50% 용량 감소)
   - Progressive JPEG fallback

2. **동영상 최적화**
   - H.264 코덱, AAC 오디오
   - Adaptive bitrate (옵션)
   - 첫 프레임 빠른 로딩 (Fast Start)

3. **데이터베이스 인덱싱**
   - `uploaded_at DESC` 인덱스
   - `id` Primary Key 인덱스

---

## 테스트 체크리스트

- [ ] 이미지 업로드 및 WebP 변환
- [ ] 동영상 업로드 및 MP4 변환
- [ ] 썸네일 생성 (동영상)
- [ ] 페이지네이션 (30개씩 로드)
- [ ] 좋아요 증가
- [ ] 파일 크기 제한 (50MB)
- [ ] 잘못된 파일 타입 거부
- [ ] CORS 헤더 응답
- [ ] S3 업로드

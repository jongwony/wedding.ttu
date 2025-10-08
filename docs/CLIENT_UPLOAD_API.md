# Gallery 벌크 업로드 API 가이드 (클라이언트용)

## 개요

휴대폰에서 여러 미디어 파일을 효율적으로 업로드하기 위한 API입니다.
**Presigned URL 방식**을 사용하여 API Gateway의 10MB 제한을 우회하고, 최대 **5GB 파일**까지 업로드할 수 있습니다.

---

## 업로드 플로우

```
┌─────────────┐
│ 1. 초기화   │  POST /upload/init
│   요청      │  (파일 메타데이터 전송)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 2. 응답     │  Presigned URLs 수신
│   수신      │  (각 파일마다 URL 생성)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 3. S3 직접  │  PUT to Presigned URL
│   업로드    │  (병렬 처리 가능)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ 4. 완료     │  POST /upload/complete
│   알림      │  (메타데이터 저장)
└─────────────┘
```

---

## API 엔드포인트

### 베이스 URL
```
https://api.jongwony.com
```

---

## 1. 업로드 초기화

### `POST /iac/gallery/v1/upload/init`

파일 메타데이터를 전송하고, S3 업로드용 Presigned URL을 받습니다.

#### 요청

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "files": [
    {
      "filename": "IMG_1234.jpg",
      "contentType": "image/jpeg",
      "size": 2048576
    },
    {
      "filename": "VID_5678.mp4",
      "contentType": "video/mp4",
      "size": 10485760
    }
  ]
}
```

**필드 설명:**
- `files`: 업로드할 파일 배열 (최대 50개)
  - `filename`: 파일명 (확장자 포함)
  - `contentType`: MIME 타입
    - 이미지: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
    - 비디오: `video/mp4`, `video/quicktime`, `video/x-msvideo`
  - `size`: 파일 크기 (bytes, 최대 50MB = 52,428,800 bytes)

#### 응답

**성공 (200 OK):**
```json
{
  "uploads": [
    {
      "uploadId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "IMG_1234.jpg",
      "presignedUrl": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.jpg?X-Amz-Algorithm=...",
      "s3Key": "wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.jpg",
      "expiresIn": 900
    },
    {
      "uploadId": "660f9511-f3ac-52e5-b827-557766551111",
      "filename": "VID_5678.mp4",
      "presignedUrl": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/660f9511-f3ac-52e5-b827-557766551111.mp4?X-Amz-Algorithm=...",
      "s3Key": "wedding-gallery/originals/660f9511-f3ac-52e5-b827-557766551111.mp4",
      "expiresIn": 900
    }
  ]
}
```

**필드 설명:**
- `uploadId`: 업로드 고유 ID (완료 단계에서 사용)
- `filename`: 원본 파일명
- `presignedUrl`: S3 업로드용 임시 URL (15분 유효)
- `s3Key`: S3 저장 경로 (완료 단계에서 사용)
- `expiresIn`: URL 유효 시간 (초)

**에러 (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "file IMG_1234.jpg: file size exceeds 50MB limit"
}
```

---

## 2. S3 직접 업로드

### Presigned URL로 파일 업로드

받은 `presignedUrl`에 HTTP PUT 요청으로 파일을 직접 업로드합니다.

#### 요청 예시 (JavaScript)

```javascript
// 각 파일마다 병렬 업로드
const uploadPromises = response.uploads.map(async (upload) => {
  const file = files.find(f => f.name === upload.filename);

  const uploadResponse = await fetch(upload.presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed for ${upload.filename}`);
  }

  return {
    uploadId: upload.uploadId,
    s3Key: upload.s3Key,
  };
});

const uploadedItems = await Promise.all(uploadPromises);
```

#### 요청 예시 (iOS Swift)

```swift
func uploadFile(presignedUrl: String, fileData: Data, contentType: String) async throws {
    var request = URLRequest(url: URL(string: presignedUrl)!)
    request.httpMethod = "PUT"
    request.setValue(contentType, forHTTPHeaderField: "Content-Type")
    request.httpBody = fileData

    let (_, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw UploadError.failed
    }
}

// 병렬 업로드
await withThrowingTaskGroup(of: UploadedItem.self) { group in
    for upload in uploads {
        group.addTask {
            try await uploadFile(
                presignedUrl: upload.presignedUrl,
                fileData: fileData,
                contentType: upload.contentType
            )
            return UploadedItem(uploadId: upload.uploadId, s3Key: upload.s3Key)
        }
    }
}
```

#### 요청 예시 (Android Kotlin)

```kotlin
suspend fun uploadFile(presignedUrl: String, file: File, contentType: String): Result<Unit> {
    return withContext(Dispatchers.IO) {
        try {
            val connection = URL(presignedUrl).openConnection() as HttpURLConnection
            connection.requestMethod = "PUT"
            connection.setRequestProperty("Content-Type", contentType)
            connection.doOutput = true

            file.inputStream().use { input ->
                connection.outputStream.use { output ->
                    input.copyTo(output)
                }
            }

            if (connection.responseCode == 200) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Upload failed: ${connection.responseCode}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// 병렬 업로드
coroutineScope {
    uploads.map { upload ->
        async {
            uploadFile(upload.presignedUrl, file, upload.contentType)
            UploadedItem(upload.uploadId, upload.s3Key)
        }
    }.awaitAll()
}
```

#### 중요 사항

- **HTTP 메서드**: 반드시 `PUT` 사용
- **Content-Type**: 원본 파일의 MIME 타입 유지
- **타임아웃**: 15분 이내 업로드 완료 필요
- **재시도**: 네트워크 오류 시 재시도 로직 권장
- **진행률**: 파일 전송 진행률 표시 권장

---

## 3. 업로드 완료 알림

### `POST /iac/gallery/v1/upload/complete`

S3 업로드가 완료되면 서버에 알려서 메타데이터를 저장합니다.

#### 요청

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "uploadId": "550e8400-e29b-41d4-a716-446655440000",
      "s3Key": "wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.jpg"
    },
    {
      "uploadId": "660f9511-f3ac-52e5-b827-557766551111",
      "s3Key": "wedding-gallery/originals/660f9511-f3ac-52e5-b827-557766551111.mp4"
    }
  ]
}
```

**필드 설명:**
- `items`: 업로드 완료된 항목 배열
  - `uploadId`: Step 1에서 받은 업로드 ID
  - `s3Key`: Step 1에서 받은 S3 키

#### 응답

**성공 (200 OK):**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "image",
      "original_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.jpg",
      "optimized_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/550e8400-e29b-41d4-a716-446655440000.jpg",
      "thumbnail_url": "",
      "likes": 0,
      "uploaded_at": "2025-10-08T12:34:56Z"
    },
    {
      "id": "660f9511-f3ac-52e5-b827-557766551111",
      "type": "video",
      "original_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/660f9511-f3ac-52e5-b827-557766551111.mp4",
      "optimized_url": "https://jongwony-private.s3.ap-northeast-2.amazonaws.com/wedding-gallery/originals/660f9511-f3ac-52e5-b827-557766551111.mp4",
      "thumbnail_url": "wedding-gallery/thumbnails/660f9511-f3ac-52e5-b827-557766551111_thumb.webp",
      "likes": 0,
      "uploaded_at": "2025-10-08T12:35:12Z"
    }
  ],
  "success": 2,
  "failed": 0
}
```

**필드 설명:**
- `items`: 저장된 미디어 항목 배열
- `success`: 성공한 항목 수
- `failed`: 실패한 항목 수

**부분 성공 (200 OK):**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "image",
      "original_url": "...",
      "optimized_url": "...",
      "thumbnail_url": "",
      "likes": 0,
      "uploaded_at": "2025-10-08T12:34:56Z"
    }
  ],
  "success": 1,
  "failed": 1
}
```
> **참고**: 일부 파일이 실패해도 성공한 파일은 정상 저장됩니다.

---

## 전체 예제 (JavaScript)

```javascript
async function bulkUploadFiles(files) {
  // Step 1: 업로드 초기화
  const initResponse = await fetch('https://api.jongwony.com/iac/gallery/v1/upload/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: files.map(f => ({
        filename: f.name,
        contentType: f.type,
        size: f.size,
      })),
    }),
  });

  const { uploads } = await initResponse.json();

  // Step 2: S3 직접 업로드 (병렬)
  const uploadedItems = await Promise.all(
    uploads.map(async (upload) => {
      const file = files.find(f => f.name === upload.filename);

      await fetch(upload.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      return {
        uploadId: upload.uploadId,
        s3Key: upload.s3Key,
      };
    })
  );

  // Step 3: 완료 알림
  const completeResponse = await fetch('https://api.jongwony.com/iac/gallery/v1/upload/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: uploadedItems }),
  });

  const result = await completeResponse.json();
  console.log(`업로드 완료: ${result.success}개 성공, ${result.failed}개 실패`);

  return result.items;
}
```

---

## 에러 처리

### 공통 에러 응답

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### 에러 코드

| 상태 코드 | 설명 | 해결 방법 |
|-----------|------|-----------|
| 400 | 잘못된 요청 | 요청 형식 확인 (파일 크기, 타입 등) |
| 500 | 서버 오류 | 재시도 또는 지원팀 문의 |

### 재시도 전략

**네트워크 오류:**
- S3 업로드 실패 시 최대 3회 재시도
- Exponential backoff 사용 (1초, 2초, 4초)

**부분 실패:**
- 실패한 파일만 선택적으로 재업로드
- `failed > 0`인 경우 사용자에게 알림

---

## 제약 사항

| 항목 | 제한 |
|------|------|
| 최대 파일 크기 | 50MB |
| 최대 동시 업로드 | 50개 |
| Presigned URL 유효 시간 | 15분 |
| 지원 이미지 형식 | JPG, PNG, WebP, GIF |
| 지원 비디오 형식 | MP4, MOV, AVI |

---

## 성능 최적화 팁

### 1. 병렬 업로드
- 여러 파일을 동시에 업로드하여 속도 향상
- 모바일: 최대 3-5개 동시 업로드 권장
- Wi-Fi: 최대 10개 동시 업로드 가능

### 2. 진행률 표시
```javascript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  const percent = (e.loaded / e.total) * 100;
  console.log(`진행률: ${percent}%`);
});
```

### 3. 네트워크 상태 체크
- 모바일 데이터 사용 시 사용자 동의 필요
- Wi-Fi 연결 확인 후 자동 업로드 권장

### 4. 백그라운드 업로드
- iOS: `URLSessionConfiguration.background`
- Android: `WorkManager` 사용

---

## FAQ

### Q1: 15분 내에 업로드를 못 끝내면?
**A**: Presigned URL이 만료되므로 Step 1부터 다시 시작해야 합니다.

### Q2: 일부 파일만 실패하면?
**A**: Step 3에서 `failed > 0`으로 확인 가능합니다. 실패한 파일만 재시도하세요.

### Q3: 50MB 이상 파일은?
**A**: 현재 제한은 50MB입니다. 추후 확대 예정입니다.

### Q4: 업로드 중 앱이 종료되면?
**A**: 백그라운드 업로드 기능을 구현하거나, 재시작 시 미완료 항목을 다시 업로드하세요.

### Q5: 동영상 썸네일은 언제 생성되나요?
**A**: 현재는 자동 생성되지 않습니다. 추후 비동기 처리로 추가 예정입니다.

---

## 지원

문제가 발생하면 아래 정보를 포함하여 문의하세요:
- 에러 메시지
- 요청/응답 예시
- 파일 크기 및 타입
- 네트워크 환경 (Wi-Fi/모바일)

#!/bin/bash
# image-optimize.sh

# 도움말 함수
show_help() {
    echo "사용법: $0 [디렉토리명]"
    echo ""
    echo "이미지 디렉토리를 모바일용으로 최적화합니다."
    echo ""
    echo "인자:"
    echo "  디렉토리명    최적화할 이미지 디렉토리명 (기본값: carousel)"
    echo ""
    echo "예시:"
    echo "  $0              # public/images/carousel 디렉토리 최적화"
    echo "  $0 gallery      # public/images/gallery 디렉토리 최적화"
    echo "  $0 photos       # public/images/photos 디렉토리 최적화"
    echo ""
    echo "옵션:"
    echo "  -h, --help      이 도움말 표시"
}

# 도움말 요청 확인
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# 디렉토리명 설정 (기본값: carousel)
DIRECTORY_NAME="${1:-carousel}"

echo "🚀 ${DIRECTORY_NAME} 이미지 모바일 최적화 시작..."

# 현재 디렉토리 저장
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$PROJECT_ROOT/public/images/$DIRECTORY_NAME"
MOBILE_DIR="$SOURCE_DIR/mobile"

# 소스 디렉토리 존재 확인
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 오류: 디렉토리가 존재하지 않습니다: $SOURCE_DIR"
    echo "💡 다음 명령으로 사용 가능한 디렉토리를 확인하세요:"
    echo "   ls public/images/"
    exit 1
fi

# WebP 파일 존재 확인
webp_count=$(find "$SOURCE_DIR" -maxdepth 1 -name "*.webp" | wc -l)
if [ "$webp_count" -eq 0 ]; then
    echo "❌ 오류: $SOURCE_DIR 에서 WebP 파일을 찾을 수 없습니다."
    echo "💡 처리 가능한 파일 형식: *.webp"
    exit 1
fi

# mobile 디렉토리 생성
mkdir -p "$MOBILE_DIR"

# 처리된 파일 수 카운터
count=0
total=$webp_count

echo "📁 소스 디렉토리: $SOURCE_DIR"
echo "📁 출력 디렉토리: $MOBILE_DIR"
echo "📊 총 $total 개 파일 처리 예정"
echo ""

# WebP 파일들을 모바일용으로 최적화
for file in "$SOURCE_DIR"/*.webp; do
    if [ -f "$file" ]; then
        # 파일명 추출 (확장자 제거)
        filename=$(basename "$file" .webp)

        # 진행률 표시
        count=$((count + 1))
        echo "[$count/$total] 처리 중: $filename"

        # 800px 폭, 품질 80%로 최적화
        cwebp -resize 800 0 -q 80 -m 6 -mt "$file" -o "$MOBILE_DIR/${filename}-mobile.webp"

        # 파일 크기 비교
        original_size=$(du -h "$file" | cut -f1)
        mobile_size=$(du -h "$MOBILE_DIR/${filename}-mobile.webp" | cut -f1)
        echo "   원본: $original_size → 모바일: $mobile_size"
        echo ""
    fi
done

echo "✅ 모든 파일 처리 완료!"
echo "📊 결과 요약:"
echo "   - 대상 디렉토리: $DIRECTORY_NAME"
echo "   - 총 처리 파일: $count 개"
echo "   - 출력 위치: public/images/$DIRECTORY_NAME/mobile/"
echo "   - 최적화 설정: 800px 폭, 품질 80%"

# 총 용량 비교
original_total=$(du -sh "$SOURCE_DIR"/*.webp | tail -1 | cut -f1)
mobile_total=$(du -sh "$MOBILE_DIR" | cut -f1)
echo "   - 원본 총 용량: $original_total"
echo "   - 모바일 총 용량: $mobile_total"
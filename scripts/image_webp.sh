#!/bin/bash

# 첫 번째 인자로 이미지 디렉토리 경로를 받음, 기본값은 public/images
IMAGE_DIR="${1:-public/images}"

echo "Processing images in directory: $IMAGE_DIR"

# ImageMagick을 사용해서 방향을 자동 보정하고 WebP로 변환
# -auto-orient: EXIF 방향 정보에 따라 자동 회전
# -rotate: EXIF 정보가 없어도 수동으로 회전 (필요한 경우)
find "$IMAGE_DIR" -name "*.jpg" -exec sh -c '
    input_file="{}"
    output_file="{}.webp"
    echo "Converting: $input_file"

    # ImageMagick을 사용해서 방향 보정 후 WebP로 변환
    magick "$input_file" -auto-orient -quality 80 "$output_file"
' \;
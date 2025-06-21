import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import resourcePaths from "@/config/resourcePaths";

export const revalidate = 300; // 300초마다 재검증

export async function GET() {
  const imagesDirectory = path.join(process.cwd(), "public", resourcePaths.carouselImages);
  // 디렉터리 내의 파일 목록을 읽습니다.
  const files = fs.readdirSync(imagesDirectory);
  // 이미지 확장자에 해당하는 파일만 필터링합니다.
  const imageList = files
    .filter(file => /\.(jpe?g|png|gif|svg|webp)$/i.test(file))
    .map(file => path.join(resourcePaths.carouselImages, file).replace(/\\/g, "/"))

  return NextResponse.json({ images: imageList });
}
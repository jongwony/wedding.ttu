
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import resourcePaths from "@/config/resourcePaths";

export const revalidate = 300; // 300초마다 재검증

export async function GET() {
  const imagesDirectory = path.join(process.cwd(), "public", resourcePaths.carouselImagesHyfilm);
  const files = fs.readdirSync(imagesDirectory);
  const imageList = files
    .filter(file => /\.(jpe?g|png|gif|svg|webp)$/i.test(file))
    .map(file => path.join(resourcePaths.carouselImagesHyfilm, file).replace(/\\/g, "/"))

  return NextResponse.json({ images: imageList });
}
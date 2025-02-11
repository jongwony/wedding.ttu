"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  // 한 화면에 3개 보이도록 할 때, 가능한 최대 슬라이드 인덱스
  const maxIndex = images.length > 3 ? images.length - 3 : 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; // 최소 스와이프 거리 (픽셀)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // 터치가 시작될 때 이전 값을 초기화
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // 왼쪽으로 스와이프 → 다음 슬라이드
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // 오른쪽으로 스와이프 → 이전 슬라이드
      prevSlide();
    }
  };

  // 순환하고 싶으면 주석 해제
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      // prevIndex === 0 ? maxIndex : prevIndex - 1
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      // prevIndex === maxIndex ? 0 : prevIndex + 1
      prevIndex === maxIndex ? maxIndex : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* 슬라이드 영역 (터치 이벤트 추가) */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          // 각 이미지가 1/3 너비이므로, 현재 인덱스 만큼 33.33%씩 이동합니다.
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="flex-shrink-0 w-1/3">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={800}
                height={600}
                priority={false}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
      >
        <ChevronLeft />
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
      >
        <ChevronRight />
      </button>

      {/* 인디케이터 (현재 슬라이드를 표시) */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
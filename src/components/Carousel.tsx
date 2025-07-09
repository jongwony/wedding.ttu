"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronsRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHyfilm } from "@/hooks/useHyfilm";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const { isHyfilm } = useHyfilm();
  const [showHint, setShowHint] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!hasScrolled && container.scrollLeft > 0) {
        setHasScrolled(true);
      }
    };

    if (hasScrolled) {
      setShowHint(false);
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // 모달 관련 이벤트 핸들러
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="relative w-full max-w-full">
      {/* 스크롤 컨테이너: scroll-snap 속성 적용 */}
      <div
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
        ref={scrollContainerRef}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="flex-shrink-0 w-1/3 snap-start">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                quality={80}
                width={800}
                height={600}
                className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 사용자가 스크롤하지 않은 경우에만 스와이프 애니메이션 표시 */}
      <div className={showHint ? "" : "fadeout-carousel"}>
        {/* fade out */}
        <div className="absolute top-0 right-0 h-full w-16 pointer-events-none bg-gradient-to-l from-[var(--fadeout)] to-transparent"></div>
        <div className="absolute top-1/2 right-4 pointer-events-none">
          <div className="flex items-center space-x-2 animate-swipeHint">
            <ChevronsRight className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isHyfilm ? "bg-black bg-opacity-90" : "bg-white bg-opacity-90"}`}>
          {/* 배경 클릭으로 모달 닫기 */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeModal}
          />

          {/* 모달 콘텐츠 */}
          <div className="relative max-w-full max-h-full p-4">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X size={24} />
            </button>

            {/* 이전 버튼 */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            {/* 다음 버튼 */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight size={24} />
            </button>

            {/* 확대된 이미지 */}
            <div className="relative">
              <Image
                src={images[selectedImageIndex]}
                alt={`확대된 이미지 ${selectedImageIndex + 1}`}
                quality={100}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                priority
              />
            </div>

            {/* 이미지 카운터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        div[ref] {
          -webkit-scrollbar: none;
        }
        div[ref]::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeOutAnimation {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .fadeout-carousel {
          animation: fadeOutAnimation 1s forwards;
        }

        @keyframes swipeHint {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(8px);
            opacity: 0.5;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-swipeHint {
          animation: swipeHint 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
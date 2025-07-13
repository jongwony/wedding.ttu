"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronsRight, X } from "lucide-react";
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
  const modalScrollContainerRef = useRef<HTMLDivElement>(null);

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

  // 모달이 열릴 때 선택된 이미지로 즉시 이동
  useEffect(() => {
    if (isModalOpen && modalScrollContainerRef.current) {
      const container = modalScrollContainerRef.current;
      const imageWidth = container.scrollWidth / images.length;
      container.scrollTo({
        left: selectedImageIndex * imageWidth,
        behavior: 'instant'
      });
    }
  }, [isModalOpen, selectedImageIndex, images.length]);

  // 모달 스크롤 이벤트 핸들러
  useEffect(() => {
    const container = modalScrollContainerRef.current;
    if (!container) return;

    const handleModalScroll = () => {
      const imageWidth = container.scrollWidth / images.length;
      const currentIndex = Math.round(container.scrollLeft / imageWidth);
      // 인덱스 범위 체크
      const clampedIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
      setSelectedImageIndex(clampedIndex);
    };

    container.addEventListener("scroll", handleModalScroll);
    return () => container.removeEventListener("scroll", handleModalScroll);
  }, [images.length]);

  // 모달 관련 이벤트 핸들러
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === 'Escape') {
        closeModal();
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
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X size={24} />
            </button>

            {/* 스와이프 가능한 이미지 컨테이너 */}
            <div
              className="overflow-x-auto scroll-smooth snap-x snap-mandatory w-full h-full"
              ref={modalScrollContainerRef}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex h-full">
                {images.map((src, index) => (
                  <div key={index} className="flex-shrink-0 w-[80%] snap-center flex items-center justify-center p-4">
                    <Image
                      src={src}
                      alt={`확대된 이미지 ${index + 1}`}
                      quality={100}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[90vh] object-contain"
                      priority={index === selectedImageIndex}
                    />
                  </div>
                ))}
              </div>

              {/* 좌우 그라데이션 효과로 다음 이미지 힌트 */}
              <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-black from-0% to-transparent to-100% opacity-30 pointer-events-none"></div>
              <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-black from-0% to-transparent to-100% opacity-30 pointer-events-none"></div>
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
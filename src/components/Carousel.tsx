"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronsRight } from "lucide-react";

interface CarouselProps {
  images: string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [showHint, setShowHint] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
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

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* 스크롤 컨테이너: scroll-snap 속성 적용 */}
      <div
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
        ref={scrollContainerRef}
      >
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="flex-shrink-0 w-1/3 snap-start">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
      {/* 사용자가 스크롤하지 않은 경우에만 스와이프 애니메이션 표시 */}
      <div className={showHint ? "" : "fadeout-carousel"}>
        {/* fade out */}
        <div className="absolute top-0 right-0 h-full w-16 pointer-events-none bg-gradient-to-l from-white to-transparent dark:from-black"></div>
        <div className="absolute top-1/2 right-4 pointer-events-none translate-y-1/2">
          <div className="flex items-center space-x-2 animate-swipeHint">
            <ChevronsRight />
          </div>
        </div>
      </div>
      <style jsx>{`
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
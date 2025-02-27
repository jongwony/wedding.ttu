"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AnimationHeader from "@/components/Typewriter";
import { ChevronsDown } from "lucide-react";

export default function Hero() {
  const [showed, setShowed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowed(true)
    }, 3000)

  }, [showed])

  return (
    <>
      <div
        className="relative max-h-screen aspect-[9/16]"
      >
        <Image
          src="/images/jeju_snap.webp"
          alt="Jeju Snap"
          fill
          priority
          quality={80}
          className="object-cover"
        />
        <video
          // src="/videos/flower.mp4"
          src="/videos/snow.mp4"
          autoPlay
          loop
          muted
          playsInline
          draggable={false}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* 사용자가 스크롤하지 않은 경우에만 스와이프 애니메이션 표시 */}
      {!showed && (
        <div className="fadeout-hero">
          {/* fade out */}
          <div className="absolute bottom-0 w-full h-16 pointer-events-none bg-gradient-to-t from-white to-transparent dark:from-black"></div>
          <div className="absolute bottom-4 left-1/2 pointer-events-none">
            <div className="flex items-center animate-swipeHeroHint">
              <ChevronsDown />
            </div>
          </div>
        </div>
      )}

      <AnimationHeader />

      <style jsx>{`
        @keyframes fadeOutAnimation {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .fadeout-hero {
          /* 1초 지연 후 애니메이션 2초 동안 실행 */
          animation: fadeOutAnimation 2s forwards;
          animation-delay: 1s;
        }

        @keyframes swipeHeroHint {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(8px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-swipeHeroHint {
          animation: swipeHeroHint 1.5s ease-in-out 2;
        }
      `}</style>
    </>
  )

}
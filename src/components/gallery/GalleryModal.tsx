"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { MediaItem } from "./GalleryItem";

interface GalleryModalProps {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onLike: (id: string) => void;
}

export default function GalleryModal({
  item,
  items,
  onClose,
  onLike,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((i) => i.id === item.id)
  );
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const currentItem = items[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsLiked(false);
    }
  };

  // Double tap to like
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      if (!isLiked) {
        setIsLiked(true);
        onLike(currentItem.id);
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 1000);
      }
    }

    lastTapRef.current = now;
  };

  const handleLikeClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike(currentItem.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal content */}
      <div
        ref={containerRef}
        className="relative z-10 flex h-full w-full items-center justify-center"
        onDoubleClick={handleDoubleTap}
        onTouchEnd={handleDoubleTap}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        >
          <X size={24} />
        </button>

        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Next button */}
        {currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Media */}
        <div className="relative flex h-full w-full items-center justify-center p-4">
          {currentItem.type === "image" ? (
            currentItem.src ? (
              <Image
                src={currentItem.src}
                alt=""
                width={1200}
                height={800}
                className="max-h-[90vh] max-w-full object-contain"
                priority
              />
            ) : (
              <div className="text-white">이미지를 불러올 수 없습니다</div>
            )
          ) : (
            <video
              src={currentItem.src}
              controls
              autoPlay
              loop
              className="max-h-[90vh] max-w-full"
            />
          )}

          {/* Double tap heart animation */}
          {showHeartAnimation && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Heart className="h-32 w-32 animate-ping fill-red-500 text-red-500" />
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-2 transition-transform hover:scale-110"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "fill-red-500 text-red-500" : "fill-white"
                  }`}
                />
                <span className="text-sm font-semibold">
                  {currentItem.likes + (isLiked ? 1 : 0)}
                </span>
              </button>
            </div>
            <div className="text-sm text-gray-300">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

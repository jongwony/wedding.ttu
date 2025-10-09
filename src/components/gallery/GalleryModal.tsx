"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { MediaItem } from "./GalleryItem";

interface GalleryModalProps {
  item: MediaItem;
  items: MediaItem[];
  likedItems: Set<string>;
  onClose: () => void;
  onLike: (id: string) => void;
}

export default function GalleryModal({
  item,
  items,
  likedItems,
  onClose,
  onLike,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((i) => i.id === item.id)
  );
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTapRef = useRef<number>(0);

  const currentItem = items[currentIndex];
  const isLiked = likedItems.has(currentItem.id);

  // Keyboard navigation (fixed stale closure)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items.length, onClose]);

  // Focus trap and prevent body scroll
  useEffect(() => {
    // Focus on close button when modal opens
    closeButtonRef.current?.focus();

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Double tap to like
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      onLike(currentItem.id);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }

    lastTapRef.current = now;
  };

  const handleLikeClick = () => {
    onLike(currentItem.id);
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
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        >
          <X size={24} />
        </button>

        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            aria-label="이전 항목"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Next button */}
        {currentIndex < items.length - 1 && (
          <button
            onClick={handleNext}
            aria-label="다음 항목"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Media */}
        <div className="relative flex h-full w-full items-center justify-center p-4">
          {currentItem.type === "image" ? (
            currentItem.originalUrl ? (
              <Image
                src={currentItem.originalUrl}
                alt={`갤러리 이미지 ${currentIndex + 1} / ${items.length}`}
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
              src={currentItem.originalUrl}
              controls
              autoPlay
              loop
              className="max-h-[90vh] max-w-full"
              aria-label={`갤러리 동영상 ${currentIndex + 1} / ${items.length}`}
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
                  {currentItem.likes}
                </span>
              </button>
            </div>
            <div className="text-sm text-gray-300">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

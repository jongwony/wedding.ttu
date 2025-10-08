"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, Play } from "lucide-react";
import Image from "next/image";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  likes: number;
  uploadedAt: string;
}

interface GalleryItemProps {
  item: MediaItem;
  onLike: (id: string) => void;
  onClick: (item: MediaItem) => void;
}

export default function GalleryItem({ item, onLike, onClick }: GalleryItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Format number using Intl API
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num);
  };

  // Video autoplay when in viewport
  useEffect(() => {
    if (item.type !== "video" || !videoRef.current) return;

    const currentRef = itemRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {
              // Autoplay might be blocked by browser
            });
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [item.type]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Double tap to like
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (!isLiked) {
      setIsLiked(true);
      onLike(item.id);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      handleDoubleTap(e);
    } else {
      // Single tap with slight delay
      clickTimeoutRef.current = setTimeout(() => {
        onClick(item);
      }, 300);
    }

    lastTapRef.current = now;
  };

  return (
    <div
      ref={itemRef}
      role="button"
      tabIndex={0}
      aria-label={`${item.type === 'image' ? '이미지' : '동영상'} 보기`}
      className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onTouchEnd={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
    >
      {/* Media */}
      {item.type === "image" ? (
        item.src ? (
          <Image
            src={item.src}
            alt={`갤러리 이미지 ${item.id}`}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300">
            <span className="text-gray-500">이미지 없음</span>
          </div>
        )
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.thumbnail}
          loop
          muted
          playsInline
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Video indicator */}
      {item.type === "video" && (
        <div className="absolute right-2 top-2 z-10">
          <Play className="h-5 w-5 fill-white text-white drop-shadow-lg" />
        </div>
      )}

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-6 bg-black/40 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 text-white">
          <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "fill-white"}`} />
          <span className="font-semibold">{formatNumber(item.likes + (isLiked ? 1 : 0))}</span>
        </div>
      </div>

      {/* Double tap heart animation */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart className="h-24 w-24 fill-red-500 text-red-500 animate-ping" />
        </div>
      )}
    </div>
  );
}

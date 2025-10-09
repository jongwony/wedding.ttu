"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  originalUrl: string;
  thumbnailUrl: string;
  likes: number;
  uploadedAt: string;
}

interface GalleryItemProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export default function GalleryItem({ item, onClick }: GalleryItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

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

  const handleClick = () => {
    onClick(item);
  };

  return (
    <div
      ref={itemRef}
      role="button"
      tabIndex={0}
      aria-label={`${item.type === 'image' ? '이미지' : '동영상'} 보기`}
      className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-200"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
    >
      {/* Media */}
      {item.type === "image" ? (
        <Image
          src={item.thumbnailUrl}
          alt={`갤러리 이미지 ${item.id}`}
          fill
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <video
          ref={videoRef}
          src={item.thumbnailUrl}
          poster={item.thumbnailUrl}
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
    </div>
  );
}

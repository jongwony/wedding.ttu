"use client";
import Image from "next/image";
import resourcePaths from "@/config/resourcePaths";
import AnimationHeader from "./Typewriter";
import { useHyfilm } from "@/hooks/useHyfilm";

export default function Hero() {
  const { isHyfilm } = useHyfilm()

  return (
    <>
      <div
        className="relative max-h-screen min-w-full aspect-[9/16] overflow-hidden"
      >
        <Image
          src={isHyfilm ? resourcePaths.heroHyfilm : resourcePaths.heroImage}
          alt="Jeju Snap"
          fill
          priority
          quality={80}
          className="object-cover"
        />
        <AnimationHeader />
        <video
          // src="/videos/flower.mp4"
          src={isHyfilm ? "/videos/snow.mp4" : "/videos/flower.mp4"}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          controls={false}
          preload="auto"
          draggable={false}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>
    </>
  )

}
"use client";
import Image from "next/image";
import resourcePaths from "@/config/resourcePaths";
import AnimationHeader from "./Typewriter";

export default function Hero() {
  return (
    <>
      <div
        className="relative max-h-screen aspect-[9/16]"
      >
        <Image
          src={resourcePaths.heroImage}
          alt="Jeju Snap"
          fill
          priority
          quality={80}
          className="object-cover"
        />
        <AnimationHeader />
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
    </>
  )

}
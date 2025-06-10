"use client";
import resourcePaths from "@/config/resourcePaths";

export default function Hero_() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative h-screen">
        <video
          src={resourcePaths.video}
          autoPlay
          muted
          playsInline
          draggable={false}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          className="w-full h-full object-cover"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
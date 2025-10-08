"use client"
import React from "react";
import Image from "next/image";

const Kakaomap: React.FC = () => {
  return (
    <div className="w-full max-w-md">
      <div className="relative border rounded-md overflow-hidden shadow-lg">
        <Image
          src="/images/route/static_map.jpeg"
          alt="스타시티 아트홀 위치 - 서울시 광진구 화양동 능동로 110"
          width={750}
          height={749}
          className="w-full h-96 object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default Kakaomap;

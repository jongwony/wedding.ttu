"use client";
import React, { useEffect, useState } from "react";

const WeddingCountdown = () => {
  const weddingDate = new Date("2025-10-19T12:00:00+09:00").getTime(); // 결혼식 날짜
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    return {
      일: Math.floor(difference / (1000 * 60 * 60 * 24)),
      시간: Math.floor((difference / (1000 * 60 * 60)) % 24),
      분: Math.floor((difference / (1000 * 60)) % 60),
      초: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-24 flex flex-col items-center p-8">
      {/* 제목 */}
      <h2 className="text-3xl font-semibold mb-8">
        종원 ❤️ 수경 결혼식까지
      </h2>

      {/* 카운트다운 컨테이너 */}
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center bg-pink-200 rounded-full text-xl text-gray-600">
              <span className="text-xl">{value}</span>
              <div>
                <span className="text-xs">{label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingCountdown;
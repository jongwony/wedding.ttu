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
    <>
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .countdown-container {
          position: relative;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.8) 50%,
            rgba(241, 245, 249, 0.9) 100%
          );
          backdrop-filter: blur(10px);
          border-radius: 30px;
          padding: 40px;
          box-shadow:
            0 20px 40px rgba(190, 165, 190, 0.3),
            0 8px 16px rgba(219, 186, 219, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.6);
          animation: fadeInUp 1s ease-out;
        }

        .countdown-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle,
            rgba(219, 186, 219, 0.1) 0%,
            rgba(248, 187, 208, 0.05) 40%,
            transparent 70%
          );
          animation: gentleFloat 6s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 32px;
        }

        .time-unit {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: gentleFloat 4s ease-in-out infinite;
        }

        .time-unit:nth-child(1) { animation-delay: 0s; }
        .time-unit:nth-child(2) { animation-delay: 1s; }
        .time-unit:nth-child(3) { animation-delay: 2s; }
        .time-unit:nth-child(4) { animation-delay: 3s; }

        .time-circle {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 187, 208, 0.4) 30%,
            rgba(219, 186, 219, 0.5) 70%,
            rgba(190, 165, 190, 0.6) 100%
          );
          box-shadow:
            0 8px 24px rgba(190, 165, 190, 0.3),
            0 4px 8px rgba(219, 186, 219, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(190, 165, 190, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          animation: softPulse 2s ease-in-out infinite;
        }

        .time-circle:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow:
            0 12px 32px rgba(190, 165, 190, 0.4),
            0 6px 12px rgba(219, 186, 219, 0.3);
        }

        .time-circle::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg,
            rgba(248, 187, 208, 0.6),
            rgba(219, 186, 219, 0.4),
            rgba(190, 165, 190, 0.6),
            rgba(248, 187, 208, 0.4)
          );
          background-size: 400% 400%;
          animation: shimmer 4s ease-in-out infinite;
          z-index: -1;
        }

        .time-value {
          font-size: 24px;
          font-weight: 700;
          color: #6b5b73;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
          margin-bottom: 2px;
        }

        .time-label {
          font-size: 12px;
          font-weight: 500;
          color: #8b7992;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .decorative-dots {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 6px;
          height: 6px;
          background: rgba(248, 187, 208, 0.6);
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
        }

        .decorative-dots::before,
        .decorative-dots::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(219, 186, 219, 0.8);
          border-radius: 50%;
        }

        .decorative-dots::before {
          top: -12px;
          left: -8px;
          animation: sparkle 2s ease-in-out infinite 0.5s;
        }

        .decorative-dots::after {
          top: 8px;
          left: 12px;
          animation: sparkle 2s ease-in-out infinite 1s;
        }

        @media (max-width: 768px) {
          .countdown-container {
            padding: 24px;
            margin: 0 16px;
          }

          .countdown-grid {
            gap: 16px;
          }

          .time-circle {
            width: 70px;
            height: 70px;
          }

          .time-value {
            font-size: 18px;
          }

          .time-label {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="mt-24 flex flex-col items-center p-4">
        <div className="countdown-container">
          <div className="decorative-dots"></div>
          {/* 제목 */}
          <h2 className="text-4xl font-bold text-center mb-2">
            종원 ❤️ 수경 결혼식까지
          </h2>

          <div className="text-center text-gray-500">
            우리의 특별한 날을 함께해 주세요
          </div>

          {/* 카운트다운 컨테이너 */}
          <div className="countdown-grid">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="time-unit">
                <div className="time-circle">
                  <span className="time-value">{value}</span>
                  <span className="time-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeddingCountdown;
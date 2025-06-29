"use client"

import { useEffect, useState } from "react"
import GlassContainer from "./ui/GlassContainer"

const WeddingCountdown = () => {
  const weddingDate = new Date("2025-10-19T12:00:00+09:00").getTime()
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date().getTime()
    const difference = weddingDate - now

    return {
      일: Math.floor(difference / (1000 * 60 * 60 * 24)),
      시간: Math.floor((difference / (1000 * 60 * 60)) % 24),
      분: Math.floor((difference / (1000 * 60)) % 60),
      초: Math.floor((difference / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes cloudFloat {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translateY(8px) translateX(4px) rotate(-0.5deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(15px) translateX(8px) rotate(1deg);
            opacity: 1;
          }
          75% {
            transform: translateY(12px) translateX(6px) rotate(0.8deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.7;
          }
        }

        @keyframes gentleBreathe {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.03) rotate(0.5deg);
            filter: brightness(1.05);
          }
        }

        @keyframes cloudShimmer {
          0% {
            background-position: -200% 0;
            opacity: 0.5;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.5;
          }
        }

        @keyframes floatingParticles {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0.5;
          }
          33% {
            transform: translateY(20px) scale(1.1);
            opacity: 0.6;
          }
          66% {
            transform: translateY(10px) scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: translateY(30px) scale(0.7);
            opacity: 0.5;
          }
        }

        @keyframes softGlow {
          0%, 100% {
            box-shadow:
              0 8px 32px rgba(248, 187, 208, 0.4),
              0 4px 16px rgba(255, 255, 255, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
          }
          50% {
            box-shadow:
              0 12px 40px rgba(248, 187, 208, 0.3),
              0 6px 20px rgba(255, 255, 255, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 1);
          }
        }

        .background-clouds {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }

        .cloud {
          position: absolute;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(248, 187, 208, 0.05) 50%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border-radius: 50px;
          filter: blur(1px);
        }

        .cloud-1 {
          width: 120px;
          height: 60px;
          top: 10%;
          left: 10%;
          animation: cloudFloat 8s ease-in-out infinite;
        }

        .cloud-2 {
          width: 80px;
          height: 40px;
          top: 20%;
          right: 15%;
          animation: cloudFloat 10s ease-in-out infinite 2s;
        }

        .cloud-3 {
          width: 100px;
          height: 50px;
          bottom: 15%;
          left: 20%;
          animation: cloudFloat 12s ease-in-out infinite 4s;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 40px;
          position: relative;
        }

        .time-unit {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cloudFloat 6s ease-in-out infinite;
        }

        .time-unit:nth-child(1) { animation-delay: 0s; }
        .time-unit:nth-child(2) { animation-delay: 1.5s; }
        .time-unit:nth-child(3) { animation-delay: 3s; }
        .time-unit:nth-child(4) { animation-delay: 4.5s; }

        .time-circle {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.85) 30%,
            rgba(248, 187, 208, 0.3) 70%,
            rgba(255, 255, 255, 0.9) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: gentleBreathe 4s ease-in-out infinite, softGlow 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }

        .time-circle:hover {
          transform: translateY(-8px) scale(1.08);
          animation-play-state: paused;
        }

        .time-circle::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          background: linear-gradient(45deg,
            rgba(255, 255, 255, 0.3),
            rgba(248, 187, 208, 0.2),
            rgba(255, 255, 255, 0.4),
            rgba(248, 187, 208, 0.15)
          );
          background-size: 400% 400%;
          animation: cloudShimmer 6s ease-in-out infinite;
          z-index: -1;
          filter: blur(2px);
        }

        .time-circle::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: rgba(248, 187, 208, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: floatingParticles 3s ease-in-out infinite;
        }

        .time-value {
          font-size: 32px;
          color: #6b5b73;
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
        }

        .time-label {
          font-size: 14px;
          color: #8b7992;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(248, 187, 208, 0.3);
          border-radius: 50%;
          animation: floatingParticles 4s ease-in-out infinite;
        }

        .floating-dot:nth-child(1) {
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-dot:nth-child(2) {
          top: 60%;
          right: 20%;
          animation-delay: 2s;
        }

        .floating-dot:nth-child(3) {
          bottom: 30%;
          left: 25%;
          animation-delay: 4s;
        }

        .title-container {
          position: relative;
          animation: gentleBreathe 5s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .countdown-grid {
            gap: 20px;
            margin-top: 32px;
          }

          .time-circle {
            width: 60px;
            height: 60px;
          }

          .time-value {
            font-size: 18px;
          }

          .time-label {
            font-size: 10px;
          }

          .cloud {
            display: none;
          }
        }
      `}</style>

      <div className="mt-32 mb-32 flex flex-col items-center relative">
        <GlassContainer
          variant="default"
          animation="fadeInUp"
          padding="xl"
          borderRadius="xl"
          className="md:mx-0 mx-4 md:px-12 px-8 relative overflow-hidden"
        >
          {/* 배경 구름 효과 */}
          <div className="background-clouds">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
          </div>

          {/* 떠다니는 요소들 */}
          <div className="floating-elements">
            <div className="floating-dot"></div>
            <div className="floating-dot"></div>
            <div className="floating-dot"></div>
          </div>

          {/* 제목 */}
          <div className="title-container">
            <h2 className="text-3xl text-center mb-3 text-[var(--header)] font-light">종원 ❤️ 수경 결혼식까지</h2>
            <div className="text-center text-gray-400 text-lg font-light">우리의 특별한 날을 함께해 주세요</div>
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
        </GlassContainer>
      </div>
    </>
  )
}

export default WeddingCountdown

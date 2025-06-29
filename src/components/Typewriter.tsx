import { ChevronsDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnimationHeader() {
  // const [sparkle, setSparkle] = useState(false);
  const [showed, setShowed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowed(true)
    }, 15000)

  }, [showed])


  // 컴포넌트가 처음 마운트되면 animate 상태를 true로 변경
  useEffect(() => {
    // 2초 후에 sparkle 클래스 추가 (타이핑 애니메이션 완료 직후)
    const timer = setTimeout(() => {
      // setSparkle(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center">
      <div className={`absolute top-20 z-1`}>
        {/* 옵션 1: 텍스트 그림자만 사용 */}
        <h1 className={`p-4 sm:text-4xl text-3xl text-white whitespace-nowrap overflow-hidden font-goldenplains font-extraBold typewriter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
          We&rsquo;re getting Married!
        </h1>
        <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
          2025년 10월 19일 일요일 오후 12시
        </p>
      </div>

      {!showed && (
        <div className="fadeout-hero">
          <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-[var(--fadeout)] to-transparent"></div>
          <div className="animate-swipeHeroHint pointer-events-none absolute bottom-4 left-1/2">
            <ChevronsDown className="text-[var(--subtitle)]" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeOutAnimation {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .fadeout-hero {
          /* 10초 지연 후 애니메이션 2초 동안 실행 */
          animation: fadeOutAnimation 2s forwards;
          animation-delay: 10s;
        }

        @keyframes swipeHeroHint {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(8px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-swipeHeroHint {
          animation: swipeHeroHint 1.5s ease-in-out 10;
        }

        @keyframes typewriter {
          from { width: 0%; }
          to { width: 100%; }
        }

        .typewriter {
          animation: typewriter 2s steps(120) forwards;
        }
      `}</style>

    </div >
  );
}

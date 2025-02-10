import { useEffect, useState } from "react";

export default function AnimationHeader() {
  const [animate, setAnimate] = useState(false);
  const [sparkle, setSparkle] = useState(false);

  // 컴포넌트가 처음 마운트되면 animate 상태를 true로 변경
  useEffect(() => {
    setAnimate(true);
    // 3초 후에 sparkle 클래스 추가 (타이핑 애니메이션 완료 직후)
    const timer = setTimeout(() => {
      setSparkle(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center">
      <h1 className={`top-40 p-4 text-4xl text-white font-goldenplains font-extraBold ${animate ? "typewriter" : ""} ${sparkle ? "sparkle" : ""}`}>
        We&rsquo;re getting Married!
      </h1>

      <style jsx>{`
        @keyframes typewriter {
          from { width: 0%; }
          to { width: 100%; }
        }
        .typewriter {
          z-index: 10;
          position: absolute;
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 4s steps(120) forwards;
        }

        @keyframes sparkle {
          0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 1); }
          100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        }
        .sparkle {
          animation: sparkle 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

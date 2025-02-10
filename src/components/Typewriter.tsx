import { useEffect, useState } from "react";

export default function AnimationHeader() {
  const [animate, setAnimate] = useState(false);

  // 컴포넌트가 처음 마운트되면 animate 상태를 true로 변경
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex justify-center">
      <h1 className={`top-40 p-4 text-4xl font-goldenplains ${animate ? "typewriter" : ""}`}>We&rsquo;re getting Married!</h1>

      <style jsx>{`
        @keyframes typewriter {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .typewriter {
          z-index: 10;
          position: absolute;
          overflow: hidden;        /* 넘치는 텍스트 숨김 */
          white-space: nowrap;     /* 텍스트 줄바꿈 방지 */
          animation: typewriter 4s steps(120) forwards; /* 4초간 120단계 애니메이션, 한 번 실행 */
        }
      `}</style>
    </div>
  );
}

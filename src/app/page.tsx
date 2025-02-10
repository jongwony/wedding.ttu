"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";

export default function Home() {
  const [animate, setAnimate] = useState(false);

  // 컴포넌트가 처음 마운트되면 animate 상태를 true로 변경
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section className="font-pretendard mx-auto px-4 py-12 text-center">
      <h1 className={`text-6xl font-goldenplains p-4 ${animate ? "typewriter" : ""}`}>We&rsquo;re getting Married!</h1>

      <div className="mt-12 flex justify-center">
        <Image
          src="/images/jeju_snap.jpg"
          alt="Couple"
          layout="responsive"
          width={100}
          height={100}
          className="rounded-lg shadow-lg max-w-md"
        />
      </div>


      <div className={`font-nanumdahang text-2xl m-16`}>
        <p >
          내가 그다지 사랑하는 그대여
          <br />
          내 한 평생에 차마
          <br />
          그대를 잊을 수 없소이다.
          <br />
          내 차례에 못 올 사랑인 줄 알면서도
          <br />
          나 혼자는 꾸준히 생각하리라.
          <br />
          <br />
          자, 그러면 내내 어여쁘소서.
          <br />
          <br />
          - 이런 시, 이상
        </p>
      </div>

      <CalendarEventActions />

      <h2 className="mt-24 font-nanumdahang text-4xl font-bold">오시는 길</h2>
      <p className="font-maru text-gray-400 m-4">
        건대입구 역 3번 출구
      </p>

      <div className="flex justify-center mt-8">
        <Kakaomap />
      </div>

      <h2 className="mt-24 font-nanumdahang text-4xl font-bold">Apple 지갑에 추가하기</h2>
      <p className="font-maru text-gray-400 m-4">
        아이폰을 사용하신다면 Apple 지갑에 추가하여 알림을 받아보세요.
      </p>
      <AddToAppleWalletButton />

      <h2 className="mt-24 font-nanumdahang text-4xl font-bold">축하의 마음 전하기</h2>
      <p className="font-maru text-gray-400 m-4">
        소중한 날 함께 해 주신다면 더할 나위 없이 기쁠것입니다.
        <span className="block m-2">
          직접 참석이 어려우시더라도,
          <br />
          따뜻한 마음을 전해 주신다면 저희에게 큰 힘이 될 것입니다.
        </span>
        진심으로 감사드립니다.
      </p>
      <TransferButtons />

      <style jsx>{`
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .typewriter {
          display: inline-block;
          overflow: hidden;        /* 넘치는 텍스트 숨김 */
          white-space: nowrap;     /* 텍스트 줄바꿈 방지 */
          animation: typewriter 4s steps(40) forwards; /* 4초간 40단계 애니메이션, 한 번 실행 */
        }
      `}</style>
    </section>
  );
}
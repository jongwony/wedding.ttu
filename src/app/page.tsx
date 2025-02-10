"use client";
import Image from "next/image";

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";
import WeddingCountdown from "@/components/Countdown";
import AnimationHeader from "@/components/Typewriter";

export default function Home() {
  return (
    <section className="flex flex-col font-pretendard text-center">
      <div className="relative max-h-screen aspect-[9/16]">
        <Image
          src="/images/jeju_snap.jpg"
          alt="Jeju Snap"
          fill={true}
          priority={false}
          className="object-cover"
        />
      </div>

      <AnimationHeader />

      <div className={`font-nanumdahang text-2xl m-8`}>
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

      <WeddingCountdown />

      <CalendarEventActions />

      <h2 className="mt-24 font-nanumdahang text-3xl font-bold">오시는 길</h2>
      <p className="font-maru text-gray-400 m-4">
        건대입구 역 3번 출구
      </p>

      <Kakaomap />

      <h2 className="mt-24 font-nanumdahang text-3xl font-bold">Apple 지갑에 추가하기</h2>
      <p className="font-maru text-gray-400 m-4">
        아이폰을 사용하신다면 Apple 지갑에 추가하여 알림을 받아보세요.
      </p>

      <AddToAppleWalletButton />

      <h2 className="mt-24 font-nanumdahang text-3xl font-bold">축하의 마음 전하기</h2>
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

    </section>
  );
}
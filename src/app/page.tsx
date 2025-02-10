"use client";
import Image from "next/image";

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";
import WeddingCountdown from "@/components/Countdown";
import AnimationHeader from "@/components/Typewriter";
import BrideGroomProfile from "@/components/Profile";
import InterviewModal from "@/components/Interview";

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

      <h1 className={`font-maru text-2xl m-8 text-pink-500`}>
        소중한 분들을 초대합니다.
      </h1>
      <p className="font-maru text-gray-400 m-4">
        오랜 기다림 끝에 저희 두사람.
        <br />
        한 마음 되어 이제 결실을 맺으려 합니다.
        <br />
        <br />
        오셔서 함께해 주시면 감사하겠습니다.
      </p>

      <BrideGroomProfile />

      <InterviewModal />

      <WeddingCountdown />

      <CalendarEventActions />

      <Kakaomap />

      <TransferButtons />

      <AddToAppleWalletButton />

    </section>
  );
}
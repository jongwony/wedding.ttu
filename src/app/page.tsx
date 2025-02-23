"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const WeddingCountdown = dynamic(() => import('@/components/Countdown'), {
  ssr: false,
});

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";
import BrideGroomProfile from "@/components/Profile";
import InterviewModal from "@/components/Interview";
import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";

export default function Home() {
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/carousel-images");
        const data = await res.json();
        setImageList(data.images);
      } catch (error) {
        console.error("이미지 목록을 불러오는데 실패했습니다:", error);
      }
    }
    fetchImages();
  }, []);

  return (
    <section className="flex flex-col font-pretendard text-center">
      <Hero />

      <Carousel images={imageList} />

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
      <p className="font-maru text-gray-500 m-4">
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
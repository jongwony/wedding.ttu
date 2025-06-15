"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const WeddingCountdown = dynamic(() => import('@/components/Countdown'), {
  ssr: false,
});

// import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";
import BrideGroomProfile from "@/components/Profile";
import InterviewModal from "@/components/Interview";
import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import MapButtons from "@/components/Navigation";
import InformationTabs from "@/components/Information";
// import GlassContainerExamples from "@/components/examples/GlassContainerExamples";
import GlassContainer from "@/components/ui/GlassContainer";

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

  // 전역 터치 이벤트 핸들러 추가
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      // 이벤트 객체의 메서드들을 직접 무력화
      Object.defineProperty(e, 'preventDefault', {
        value: () => {},
        writable: false
      });
      Object.defineProperty(e, 'stopPropagation', {
        value: () => {},
        writable: false
      });
    };

    // 캡처 단계에서 이벤트를 가로채서 처리
    document.addEventListener('touchstart', handleTouch, {
      passive: false,
      capture: true
    });
    document.addEventListener('touchmove', handleTouch, {
      passive: false,
      capture: true
    });

    // 정리 함수
    return () => {
      document.removeEventListener('touchstart', handleTouch, { capture: true });
      document.removeEventListener('touchmove', handleTouch, { capture: true });
    };
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden text-center">
      <Hero />

      <div className="mt-32 mb-32 flex flex-col items-center">
        <GlassContainer
          variant="default"
          animation="gentleFloat"
          padding="xl"
          className="mx-4"
        >

          <h1 className={`text-3xl text-pink-500`}>
            소중한 분들을 초대합니다.
          </h1>

          <div className="flex flex-row items-center justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              💌
            </div>
          </div>

          <p className="mt-4 text-gray-600 text-lg">
            수많은 인연 중
            <br />
            서로를 알아본 두 사람이
            <br />
            사랑으로 결실을 맺습니다.
            <br />
            소중한 걸음으로 축복해 주세요.
          </p>
        </GlassContainer>
      </div>

      <Carousel images={imageList} />

      {/* <GlassContainerExamples /> */}

      <BrideGroomProfile />

      <InterviewModal />

      <WeddingCountdown />

      <CalendarEventActions />

      <Kakaomap />

      <MapButtons />

      <InformationTabs />

      <TransferButtons />

      {/* <AddToAppleWalletButton /> */}

    </div>
  );
}
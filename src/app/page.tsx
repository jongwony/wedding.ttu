"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const WeddingCountdown = dynamic(() => import('@/components/Countdown'), {
  ssr: false,
});

// import AddToAppleWalletButton from "@/components/AppleWallet";
import TransferButtons from "@/components/Account";
import CalendarEventActions from "@/components/Calendar";
import BrideGroomProfile from "@/components/Profile";
import InterviewModal from "@/components/Interview";
import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import InformationTabs from "@/components/Information";
import Invite from "@/components/Invite";
import { useHyfilm } from "@/hooks/useHyfilm";

export default function Home() {
  const [imageList, setImageList] = useState<string[]>([]);
  const { isHyfilm } = useHyfilm();

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = isHyfilm ? await fetch("/api/hyfilm-carousel-images") : await fetch("/api/carousel-images");
        const data = await res.json();
        setImageList(data.images);
      } catch (error) {
        console.error("이미지 목록을 불러오는데 실패했습니다:", error);
      }
    }
    fetchImages();
  }, [isHyfilm]); // isHyfilm이 변경될 때마다 API 재호출

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

      <Invite />

      <Carousel images={imageList} />

      <BrideGroomProfile />

      <InterviewModal />

      <WeddingCountdown />

      <CalendarEventActions />

      <InformationTabs />

      <TransferButtons />

      {/* <AddToAppleWalletButton /> */}

    </div>
  );
}
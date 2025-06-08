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
import AnimationHeader from "@/components/Typewriter";
import resourcePaths from "@/config/resourcePaths.yaml";
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

  return (
    <section className="flex flex-col text-center">

      <div className="flex flex-col justify-center items-center">
        <div className="relative h-screen">
          <video
            src={resourcePaths.video}
            autoPlay
            muted
            className="w-full h-full object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>

      <AnimationHeader />

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

      <Hero />

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

    </section>
  );
}
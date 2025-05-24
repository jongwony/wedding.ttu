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
import MapButtons from "@/components/Navigation";
import InformationTabs from "@/components/Information";
import AnimationHeader from "@/components/Typewriter";
import resourcePaths from "@/config/resourcePaths.yaml";

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

      <AnimationHeader />

      <div className="h-screen">
        <video
          src={resourcePaths.video}
          autoPlay
          loop
          muted
          className="w-full h-screen mx-auto object-cover"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <h1 className={`text-2xl m-8 text-pink-500`}>
        소중한 분들을 초대합니다.
      </h1>
      <p className="text-gray-600 m-4">
        오랜 기다림 끝에 저희 두사람.
        <br />
        한 마음 되어 이제 결실을 맺으려 합니다.
        <br />
        <br />
        오셔서 함께해 주시면 감사하겠습니다.
      </p>

      <Hero />

      <Carousel images={imageList} />

      <BrideGroomProfile />

      <InterviewModal />

      <WeddingCountdown />

      <CalendarEventActions />

      <Kakaomap />

      <MapButtons />

      <InformationTabs />

      <TransferButtons />

      <AddToAppleWalletButton />

    </section>
  );
}
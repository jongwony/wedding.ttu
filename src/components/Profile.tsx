"use client";
import Image from "next/image";
import React from "react";
import resourcePaths from "@/config/resourcePaths";
import { useHyfilm } from "@/hooks/useHyfilm";

const BrideGroomProfile = () => {
  const { isHyfilm } = useHyfilm();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl text-[var(--header)]">신랑 신부를 소개합니다!</h2>
      <div className="mt-8 flex flex-row gap-2 justify-center items-center">

        {/* 신랑 정보 */}
        <div className="flex flex-col items-center">
          <Image
            src={isHyfilm ? resourcePaths.profileImagesHyfilm.groom : resourcePaths.profileImages.groom}
            alt="신랑 최종원"
            width={300}
            height={300}
            className="rounded-md"
          />
          <h3 className="text-blue-500 text-lg mt-4">
            신랑 최종원 <a href="tel:010-8514-0289">📞</a>
          </h3>
          <p className="text-[var(--subtitle)] mt-2 text-center">
            1991년생, 부산남자 <br />
            호기심 많은 사색가 ENTP
          </p>
          <p className="text-gray-500 text-sm mt-2">#데이터엔지니어 #수학덕후</p>
          <p className="text-[var(--subtitle)] text-sm mt-2">최정환 · 김해숙 의 아들</p>
        </div>

        {/* 신부 정보 */}
        <div className="flex flex-col items-center">
          <Image
            src={isHyfilm ? resourcePaths.profileImagesHyfilm.bride : resourcePaths.profileImages.bride}
            alt="신부 윤수경"
            width={300}
            height={300}
            className="rounded-md"
          />
          <h3 className="text-yellow-500 text-lg mt-4">
            신부 윤수경 <a href="tel:010-8756-4189">📞</a>
          </h3>
          <p className="text-[var(--subtitle)] mt-2 text-center">
            1998년생, 서울여자 <br />
            현실적인 해결사 ISTJ
          </p>
          <p className="text-gray-500 text-sm mt-2">#응급구조사 #책임감100%</p>
          <p className="text-[var(--subtitle)] text-sm mt-2">윤혁 · 이은영 의 딸</p>
        </div>
      </div>
    </div>
  );
};

export default BrideGroomProfile;
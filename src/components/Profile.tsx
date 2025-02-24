"use client";
import Image from "next/image";
import React from "react";

const BrideGroomProfile = () => {
  return (
    <>
    <h2 className="mt-24 font-nanumdahang text-3xl font-bold">신랑 신부를 소개합니다!</h2>
    <div className="mt-8 font-maru flex flex-row gap-2 justify-center items-center">

      {/* 신랑 정보 */}
      <div className="flex flex-col items-center">
        <Image
          src="/images/groom.jpg"
          alt="신랑 최종원"
          width={300}
          height={300}
          className="rounded-md"
          priority
        />
        <h3 className="text-blue-500 text-lg font-semibold mt-4">
          신랑 최종원 <a href="tel:010-8514-0289">📞</a>
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-center">
          1991년생, 부산남자 <br />
          논리적인 낭만가 ENFP
        </p>
        <p className="text-gray-500 text-sm mt-2">#데이터엔지니어 #수학덕후</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">최정환 · 김해숙 의 아들</p>
      </div>

      {/* 신부 정보 */}
      <div className="flex flex-col items-center">
        <Image
          src="/images/bride.jpg"
          alt="신부 윤수경"
          width={300}
          height={300}
          className="rounded-md"
          priority
        />
        <h3 className="text-pink-500 text-lg font-semibold mt-4">
          신부 윤수경 <a href="tel:010-8756-4189">📞</a>
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-center">
          1998년생, 서울여자 <br />
          현실적인 해결사 ISTJ
        </p>
        <p className="text-gray-500 text-sm mt-2">#응급구조사 #책임감100%</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">윤혁 · 이은영 의 딸</p>
      </div>
    </div>
    </>
  );
};

export default BrideGroomProfile;
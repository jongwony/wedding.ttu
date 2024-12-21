// import Image from "next/image";

import Kakaomap from "@/components/KakaoMap";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Wedding Invitation 💒</h1>
      <p className="text-lg text-gray-600 mb-6">
        2025년 10월 19일 일요일 오후 12시
      </p>
      <div className="flex justify-center">
        <img
          src="/images/couple.jpg"
          alt="Couple"
          className="rounded-lg shadow-lg w-full max-w-md"
        />
      </div>
      <h2 className="mt-12 text-4xl font-bold mb-4">오시는 길</h2>
      <p className="text-lg text-gray-600 mb-6">
        건대입구 역 3번 출구
      </p>
      <div className="flex justify-center">
        <Kakaomap />
      </div>
    </section>
  );
}
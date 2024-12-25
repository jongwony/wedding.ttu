import Image from "next/image";

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Wedding Invitation 💒</h1>
      <p className="text-lg text-gray-400 mb-6">
        2025년 10월 19일 일요일 오후 12시
      </p>
      <div className="flex justify-center">
        <Image
          src="/images/couple.jpg"
          alt="Couple"
          layout="responsive"
          width={100}
          height={100}
          className="rounded-lg shadow-lg max-w-md"
        />
      </div>
      <h2 className="mt-12 text-4xl font-bold mb-4">오시는 길</h2>
      <p className="text-lg text-gray-400 mb-6">
        건대입구 역 3번 출구
      </p>
      <div className="flex justify-center">
        <Kakaomap />
      </div>
      <h2 className="mt-12 text-4xl font-bold mb-4">Apple 지갑에 추가하기</h2>
      <p className="text-lg text-gray-400 mb-6">
        아이폰을 사용하신다면 Apple 지갑에 추가하여 알림을 받아보세요.
      </p>
      <AddToAppleWalletButton />
    </section>
  );
}
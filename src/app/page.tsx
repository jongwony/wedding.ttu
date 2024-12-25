import Image from "next/image";

import AddToAppleWalletButton from "@/components/AppleWallet";
import Kakaomap from "@/components/KakaoMap";
import TransferButtons from "@/components/Account";

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
      <h2 className="mt-12 text-4xl font-bold mb-4">축하의 마음을 전하는 방법</h2>
      <p className="text-lg text-gray-400 mb-6">
        소중한 날 함께 해 주신다면 더할 나위 없이 기쁠것입니다.
      </p>
      <p className="text-lg text-gray-400 mb-6">
        직접 참석이 어려우시더라도,
        <br />
        따뜻한 마음을 전해 주신다면 저희에게 큰 힘이 될 것입니다.
      </p>
      <p className="text-lg text-gray-400 mb-6">
        진심으로 감사드립니다.
      </p>
      <TransferButtons />
    </section>
  );
}
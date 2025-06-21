import Image from "next/image";
import Link from "next/link";
import React from "react";
import GlassContainer from "./ui/GlassContainer";

const TransferButtons = () => {
  const links = [
    {
      label: "부부 살림",
      subtitle: "새로운 시작을 위해",
      href: "supertoss://send?amount=0&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=100151320105&origin=qr",
      bgColor: "bg-blue-600",
      color: "text-white",
      src: "/images/logo/toss.png",
    },
    {
      label: "신랑에게",
      subtitle: "따뜻한 마음을",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-400",
      color: "text-gray-800",
      src: "/images/logo/kakaopay.png",
    },
    {
      label: "신부에게",
      subtitle: "축복의 인사를",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-400",
      color: "text-gray-800",
      src: "/images/logo/kakaopay.png",
    },
  ];

  return (
    <div className="mt-32 mb-32 flex flex-col items-center px-4">
      <GlassContainer
        variant="default"
        animation="fadeInUp"
        padding="xl"
        borderRadius="xl"
        className="w-full max-w-lg"
      >
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-16"></div>
            <div className="mx-4 text-pink-400">❤</div>
            <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-16"></div>
          </div>

          <h2 className="text-2xl text-pink-500 font-light mb-3">
            마음을 전해주세요
          </h2>

          <p className="text-gray-600 text-base leading-relaxed">
            소중한 날 함께 해 주신다면 더할 나위 없이 기쁠 것입니다.
            <span className="block mt-3 mb-2">
              직접 참석이 어려우시더라도,
            </span>
            <span className="block">
              따뜻한 마음을 전해 주신다면 저희에게 큰 힘이 될 것입니다.
            </span>
          </p>

          <p className="text-pink-400 text-sm mt-4 font-light">
            진심으로 감사드립니다.
          </p>
        </div>

        {/* 버튼 섹션 */}
        <div className="space-y-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`
                ${link.color} ${link.bgColor}
                flex items-center justify-between
                px-4 py-3
                rounded-lg shadow-md
                border border-white/20
                active:scale-95 transition-transform duration-150
              `}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <Image
                    src={link.src}
                    width={24}
                    height={24}
                    alt={link.label}
                    className="h-6 w-6 drop-shadow-sm"
                  />
                </div>

                <div className="text-left">
                  <div className="font-medium text-sm mb-0.5">
                    {link.label}
                  </div>
                  <div className="text-xs opacity-75 font-light">
                    {link.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-lg opacity-60">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 장식 */}
        <div className="flex justify-center items-center mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent w-full max-w-xs"></div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default TransferButtons;
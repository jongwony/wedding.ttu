import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import GlassContainer from "./ui/GlassContainer";
import { useIsMobile } from "@/hooks/useIsMobile";

type ButtonLink = {
  type: 'button';
  label: string;
  subtitle: string;
  onClick: () => void;
  bgColor: string;
  color: string;
  icon: string;
};

type ExternalLink = {
  type: 'link';
  label: string;
  subtitle: string;
  href: string;
  bgColor: string;
  color: string;
  src: string;
};

type AccountLink = ButtonLink | ExternalLink;

const TransferButtons = () => {
  const isMobile = useIsMobile(); // 모바일 환경 감지
  const [activeTab, setActiveTab] = useState("couple"); // 탭 상태 관리

  const handleCopyAccount = async (accountInfo: string) => {
    try {
      await navigator.clipboard.writeText(accountInfo);
      alert("계좌번호가 복사되었습니다!");
    } catch {
      // 브라우저가 클립보드 API를 지원하지 않는 경우
      const textArea = document.createElement("textarea");
      textArea.value = accountInfo;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("계좌번호가 복사되었습니다!");
    }
  };

  const groomParentLinks: AccountLink[] = [
    {
      label: "신랑 아버지: 최정환",
      subtitle: "KB국민은행 555302-91-121317",
      onClick: () => handleCopyAccount("KB국민은행 55530291121317"),
      bgColor: "bg-gray-100",
      color: "text-gray-800",
      icon: "📋",
      type: "button"
    },
    {
      label: "신랑 어머니: 김해숙",
      subtitle: "부산은행 112-2306-8192-08",
      onClick: () => handleCopyAccount("부산은행 1122306819208"),
      bgColor: "bg-gray-100",
      color: "text-gray-800",
      icon: "📋",
      type: "button"
    },
  ]

  const brideParentLinks: AccountLink[] = [
    {
      label: "신부 아버지: 윤혁",
      subtitle: "우리은행 1002-440-342943",
      onClick: () => handleCopyAccount("우리은행 1002440342943"),
      bgColor: "bg-gray-100",
      color: "text-gray-800",
      icon: "📋",
      type: "button"
    },
    {
      label: "신부 어머니: 이은영",
      subtitle: "국민은행 021-24-0398-601",
      onClick: () => handleCopyAccount("국민은행 021240398601"),
      bgColor: "bg-gray-100",
      color: "text-gray-800",
      icon: "📋",
      type: "button"
    },
  ]

  const links: AccountLink[] = [
    {
      label: "계좌번호 복사",
      subtitle: "토스뱅크 1001-5132-0105",
      onClick: () => handleCopyAccount("토스뱅크 100151320105"),
      bgColor: "bg-gray-100",
      color: "text-gray-800",
      icon: "📋",
      type: "button"
    },
    {
      label: "부부 살림",
      subtitle: "새로운 시작을 위해",
      href: "supertoss://send?amount=0&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=100151320105&origin=qr",
      bgColor: "bg-blue-600",
      color: "text-white",
      src: "/images/logo/toss.png",
      type: "link"
    },
    {
      label: "신랑에게",
      subtitle: "따뜻한 마음을",
      // href: "https://qr.kakaopay.com/281006011000008349896956",
      href: "https://qr.kakaopay.com/Ej7r2tVT2",
      bgColor: "bg-yellow-400",
      color: "text-gray-800",
      src: "/images/logo/kakaopay.png",
      type: "link"
    },
    {
      label: "신부에게",
      subtitle: "축복의 인사를",
      href: "https://qr.kakaopay.com/Ej78j8hw7",
      bgColor: "bg-yellow-400",
      color: "text-gray-800",
      src: "/images/logo/kakaopay.png",
      type: "link"
    },
  ];

  // 탭에 따른 링크 선택
  const getCurrentLinks = () => {
    switch (activeTab) {
      case "groom":
        return groomParentLinks;
      case "bride":
        return brideParentLinks;
      default:
        return links;
    }
  };

  // 현재 링크를 모바일 환경에 따라 필터링
  const filteredLinks = getCurrentLinks().filter((link) => {
    // 부모님 탭인 경우는 필터링하지 않음
    if (activeTab === "groom" || activeTab === "bride") {
      return true;
    }
    // 모바일이 아닌 경우 "계좌번호 복사" 버튼만 표시
    if (!isMobile) {
      return link.label === "계좌번호 복사";
    }
    // 모바일인 경우 모든 버튼 표시
    return true;
  });

  const tabs = [
    { id: "couple", label: "부부", icon: "💑" },
    { id: "groom", label: "신랑 부모님", icon: "👨" },
    { id: "bride", label: "신부 부모님", icon: "👩" },
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
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--header)] to-transparent w-16"></div>
            <div className="mx-4 text-[var(--header)]">❤</div>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--header)] to-transparent w-16"></div>
          </div>

          <h2 className="text-2xl text-[var(--header)] font-light mb-3">
            마음을 전해주세요
          </h2>

          <p className="text-[var(--subtitle)] text-base leading-relaxed">
            소중한 날 함께 해 주신다면 더할 나위 없이 기쁠 것입니다.
            <span className="block mt-3 mb-2">
              직접 참석이 어려우시더라도,
            </span>
            <span className="block">
              따뜻한 마음을 전해 주신다면 저희에게 큰 힘이 될 것입니다.
            </span>
          </p>

          <p className="text-[var(--header)] text-sm mt-4 font-light">
            진심으로 감사드립니다.
          </p>
        </div>

        {/* 탭 섹션 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-[var(--background)] rounded-full p-1 shadow-lg border border-[var(--border)] gap-2">
            {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-xs transition-all duration-300 flex
                  flex items-center justify-center
                  ${
                    activeTab === tab.id
                      ? "bg-[var(--header)] text-[var(--background)] rounded-full shadow-md"
                      : "text-[var(--subtitle)] hover:bg-[var(--header)] hover:text-[var(--background)]"
                  }
                `}
              >
                <span className="text-xs">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="space-y-2">
          {filteredLinks.map((link, index) => (
            <div key={index}>
              {link.type === "link" ? (
                <Link
                  href={link.href!}
                  className={`
                    ${link.color} ${link.bgColor}
                    flex items-center justify-between
                    px-4 py-3
                    rounded-lg shadow-md
                    border border-white/20
                    active:scale-95 transition-transform duration-150
                    w-full text-left
                  `}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <Image
                        src={link.src!}
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
              ) : (
                <button
                  onClick={link.onClick}
                  className={`
                    ${link.color} ${link.bgColor}
                    flex items-center justify-between
                    px-4 py-3
                    rounded-lg shadow-md
                    border border-white/20
                    active:scale-95 transition-transform duration-150
                    w-full text-left
                  `}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="text-xl">{link.icon}</span>
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
                    📋
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

      </GlassContainer>
    </div>
  );
};

export default TransferButtons;
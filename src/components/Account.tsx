import Image from "next/image";
import Link from "next/link";
import React from "react";

const TransferButtons = () => {
  const links = [
    {
      label: "신랑 신부 함께",
      href: "supertoss://send?amount=0&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=100151320105&origin=qr",
      bgColor: "bg-blue-500",
      color: "text-white",
      src: "/images/toss_logo.png",
    },
    {
      label: "신랑에게",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-300",
      color: "text-black",
      src: "/images/kakaopay_logo.png",
    },
    {
      label: "신부에게",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-300",
      color: "text-black",
      src: "/images/kakaopay_logo.png",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="mt-24 font-nanumdahang text-3xl font-bold">축하의 마음 전하기</h2>
      <p className="font-maru text-gray-400 m-4">
        소중한 날 함께 해 주신다면 더할 나위 없이 기쁠것입니다.
        <span className="block m-2">
          직접 참석이 어려우시더라도,
          <br />
          따뜻한 마음을 전해 주신다면 저희에게 큰 힘이 될 것입니다.
        </span>
        진심으로 감사드립니다.
      </p>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} ${link.bgColor} px-4 py-2 font-bold text-sm rounded-lg shadow-lg transition-colors hover:bg-opacity-80`}
          >
            <Image src={link.src} width={32} height={32} alt={link.label} className="inline-block mr-2" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TransferButtons;
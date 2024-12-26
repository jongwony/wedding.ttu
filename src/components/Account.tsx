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
  );
};

export default TransferButtons;
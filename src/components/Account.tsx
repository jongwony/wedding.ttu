import Image from "next/image";
import Link from "next/link";
import React from "react";

const TransferButtons = () => {
  const links = [
    {
      label: "",
      href: "supertoss://send?amount=0&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=100151320105&origin=qr",
      bgColor: "bg-blue-500",
      color: "bg-blue-500",
      src: "/images/toss_logo.png",
    },
    {
      label: "신랑",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-300",
      color: "bg-blue-500",
      src: "/images/kakaopay_logo.png",
    },
    {
      label: "신부",
      href: "https://qr.kakaopay.com/281006011000008349896956",
      bgColor: "bg-yellow-300",
      color: "bg-blue-500",
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
          className={`${link.color} ${link.bgColor} px-6 py-3 font-bold rounded-lg shadow-lg transition-colors hover:bg-opacity-80`}
        >
          <Image src={link.src} width={48} height={48} alt={link.label} className="inline-block mr-2" />
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default TransferButtons;
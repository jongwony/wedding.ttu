import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HyfilmProvider } from "@/hooks/useHyfilm";

const title = "초이 ❤️ 뚜 웨딩에 초대합니다!"
const description = "2025년 10월 19일 일요일 오후 12시 스타시티아트홀"

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s",
  },
  description: description,
  alternates: {
    canonical: "https://wedding.ttu.world",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://wedding.ttu.world",
    title: title,
    siteName: title,
    description: description,
    images: [
      {
        url: "https://wedding.ttu.world/images/og_image.jpg",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: ["https://wedding.ttu.world/images/og_image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-modu">
        <HyfilmProvider>
          <Navbar />
          <main className="flex flex-col">
            {children}
          </main>
          <Footer />
        </HyfilmProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HyfilmProvider } from "@/hooks/useHyfilm";

export const metadata: Metadata = {
  title: "Jongwon ❤️ Ttu",
  description: "Wedding 💒",
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

import type { Metadata } from "next";
import "./globals.css";

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
      <body
        className={`flex flex-col min-h-screen antialiased`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

// Navbar 컴포넌트
import Link from "next/link";

function Navbar() {
  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">💒</h1>
        <div>
          <Link href="/" className="px-4 py-2 text-gray-600">Home</Link>
          <Link href="/gallery" className="px-4 py-2 text-gray-600">Gallery</Link>
          <Link href="/dining" className="px-4 py-2 text-gray-600">Dining</Link>
        </div>
      </div>
    </nav>
  );
}

// Footer 컴포넌트
function Footer() {
  return (
    <footer className="text-center py-4 text-gray-600">
      <p>© 2024 Wedding Invitation. All rights reserved.</p>
    </footer>
  );
}
import Link from "next/link";

export default function Navbar() {
  // Navbar 컴포넌트
  return (
    <nav className="fixed z-10 w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl left-1/2 transform -translate-x-1/2">
      <div className="py-4 flex justify-between items-center">
        <h1 className="text-xl text-pink-500">
          <Link href="/" className="px-4 py-2">💒</Link>
        </h1>
      </div>
    </nav>
  );
}

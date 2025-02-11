import Link from "next/link";

export default function Navbar() {
  // Navbar 컴포넌트
  return (
    <nav className="fixed z-10 w-full">
      <div className="px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/" className="px-4 py-2">💒</Link>
        </h1>
        <div>
          <Link href="/dining" className="px-4 py-2 text-gray-600">Dining</Link>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

export default function Navbar() {
  // Navbar 컴포넌트
  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
            <Link href="/" className="px-4 py-2">💒</Link></h1>
        <div>
          <Link href="/gallery" className="px-4 py-2 text-gray-600">Gallery</Link>
          <Link href="/dining" className="px-4 py-2 text-gray-600">Dining</Link>
        </div>
      </div>
    </nav>
  );
}

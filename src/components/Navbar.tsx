"use client";
import { useHyfilm } from "@/hooks/useHyfilm";

export default function Navbar() {
  const { isHyfilm, toggleHyfilm } = useHyfilm();

  return (
    <nav className="fixed z-10 w-full left-1/2 transform -translate-x-1/2">
      <div className="py-4 flex justify-end items-center">
        <button
          onClick={toggleHyfilm}
          className={`px-3 py-1 mx-4 rounded-full text-sm font-medium transition-all duration-300 bg-[var(--background)] text-[var(--foreground)] shadow-md`}
        >
          {isHyfilm ? '📸 Soopia' : '💒 Saaii'}
        </button>
      </div>
    </nav>
  );
}

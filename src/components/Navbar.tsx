"use client";
import { useHyfilm } from "@/hooks/useHyfilm";
import LiquidGlass from "./ui/LiquidGlass";

export default function Navbar() {
  const { isHyfilm, toggleHyfilm } = useHyfilm();

  const handleButtonClick = () => {
    toggleHyfilm();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav
      className="fixed z-10 w-full left-1/2 transform -translate-x-1/2 bottom-4"
    >
      <div
        className="py-4 flex justify-center items-center"
      >
        <LiquidGlass width={92} height={36}>
          <button
            onClick={handleButtonClick}
          >
            <span
              className="text-md font-medium relative transition-all duration-300 ease-out"
            >
              {isHyfilm ? '📸 Soopia' : '💒 Saaii'}
            </span>
          </button>
        </LiquidGlass>
      </div>
    </nav>
  );
}

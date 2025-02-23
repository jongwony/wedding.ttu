"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AnimationHeader from "@/components/Typewriter";
import { ChevronsDown } from "lucide-react";

export default function Hero() {
    const [hasScrolled, setHasScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (!hasScrolled && container.scrollHeight > 0) {
                setHasScrolled(true);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasScrolled]);

    return (
        <>
            <div className="relative max-h-screen aspect-[9/16]">
                <Image
                    src="/images/jeju_snap.jpg"
                    alt="Jeju Snap"
                    fill={true}
                    priority={false}
                    className="object-cover"
                />
            </div>

            <AnimationHeader />

            {/* 사용자가 스크롤하지 않은 경우에만 스와이프 애니메이션 표시 */}
            {!hasScrolled && (
                <>
                    {/* fade out */}
                    <div className="absolute bottom-0 w-full h-48 pointer-events-none bg-gradient-to-t from-white to-transparent dark:from-black"></div>
                    <div className="absolute bottom-4 left-1/2 pointer-events-none">
                        <div className="flex items-center animate-swipeHint">
                            <ChevronsDown />
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
            @keyframes swipeHint {
                0% {
                transform: translateY(0);
                opacity: 1;
                }
                50% {
                transform: translateY(10px);
                opacity: 0.5;
                }
                100% {
                transform: translateY(0);
                opacity: 1;
                }
            }
            .animate-swipeHint {
                animation: swipeHint 1.5s ease-in-out infinite;
            }
            `}</style>
        </>
    )

}
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HyfilmContextType {
  isHyfilm: boolean;
  toggleHyfilm: () => void;
}

const HyfilmContext = createContext<HyfilmContextType | undefined>(undefined);

export function HyfilmProvider({ children }: { children: ReactNode }) {
  const [isHyfilm, setIsHyfilm] = useState(false);

  useEffect(() => {
    // 서버 사이드 렌더링 환경에서도 에러가 발생하지 않도록 체크
    if (typeof window !== 'undefined') {
      const savedHyfilm = localStorage.getItem('hyfilm-mode');
      setIsHyfilm(savedHyfilm === 'true');
    }
  }, []);

  const toggleHyfilm = () => {
    const newState = !isHyfilm;
    setIsHyfilm(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hyfilm-mode', String(newState));
    }
  };

  return (
    <HyfilmContext.Provider value={{ isHyfilm, toggleHyfilm }}>
      {children}
    </HyfilmContext.Provider>
  );
}

export const useHyfilm = () => {
  const context = useContext(HyfilmContext);
  if (context === undefined) {
    throw new Error('useHyfilm must be used within a HyfilmProvider');
  }
  return context;
};
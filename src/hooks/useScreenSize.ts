"use client";
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isDestop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}
const screenSizes = {
  xs: "375px",
  sm: "480px",
  md: "768px",
  md2: "883px",
  lg: "976px",
  lg2: "1167px",
  xl: "1440px",
  xxl: "1600px",
};

export default function useScreenSize(): WindowSize {
  const isDestop = typeof window !== 'undefined' && window.matchMedia(`(min-width: ${screenSizes.lg})`).matches;
  const isTablet = typeof window !== 'undefined' && window.matchMedia(`(min-width: ${screenSizes.md})`).matches;
  const isMobile = typeof window !== 'undefined' && window.matchMedia(`(max-width: ${screenSizes.md})`).matches;
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isDestop,
    isTablet,
    isMobile,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isDestop: window.matchMedia(`(min-width: ${screenSizes.lg})`).matches,
        isTablet: window.matchMedia(`(min-width: ${screenSizes.md})`).matches,
        isMobile: window.matchMedia(`(max-width: ${screenSizes.md})`).matches,
      });
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {...windowSize, isDestop, isTablet, isMobile};
}
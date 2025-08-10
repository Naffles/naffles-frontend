import { useState, useEffect } from 'react';

export interface GameBreakpoints {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
  isLowPowerMode: boolean;
}

export interface GameResponsiveConfig {
  cardSize: {
    width: number;
    height: number;
  };
  coinSize: number;
  buttonSize: 'sm' | 'md' | 'lg';
  animationComplexity: 'low' | 'medium' | 'high';
  touchFriendly: boolean;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

const getBreakpoints = (): GameBreakpoints => {
  if (typeof window === 'undefined') {
    return {
      mobile: false,
      tablet: false,
      desktop: true,
      isTouchDevice: false,
      prefersReducedMotion: false,
      isLowPowerMode: false
    };
  }

  const width = window.innerWidth;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect low power mode (simplified heuristic)
  const isLowPowerMode = navigator.hardwareConcurrency <= 2 || 
                        (navigator as any).deviceMemory <= 4 ||
                        prefersReducedMotion;

  return {
    mobile: width < 768,
    tablet: width >= 768 && width < 1024,
    desktop: width >= 1024,
    isTouchDevice,
    prefersReducedMotion,
    isLowPowerMode
  };
};

const getResponsiveConfig = (breakpoints: GameBreakpoints): GameResponsiveConfig => {
  const { mobile, tablet, desktop, isTouchDevice, prefersReducedMotion, isLowPowerMode } = breakpoints;

  // Determine animation complexity
  let animationComplexity: 'low' | 'medium' | 'high' = 'high';
  if (prefersReducedMotion || isLowPowerMode) {
    animationComplexity = 'low';
  } else if (mobile) {
    animationComplexity = 'medium';
  }

  if (mobile) {
    return {
      cardSize: { width: 48, height: 72 }, // 3rem x 4.5rem
      coinSize: 80,
      buttonSize: isTouchDevice ? 'md' : 'sm',
      animationComplexity,
      touchFriendly: true,
      fontSize: {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-lg',
        xlarge: 'text-2xl'
      },
      spacing: {
        small: 'gap-1',
        medium: 'gap-2',
        large: 'gap-4'
      }
    };
  }

  if (tablet) {
    return {
      cardSize: { width: 64, height: 96 }, // 4rem x 6rem
      coinSize: 100,
      buttonSize: 'md',
      animationComplexity,
      touchFriendly: isTouchDevice,
      fontSize: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-xl',
        xlarge: 'text-3xl'
      },
      spacing: {
        small: 'gap-2',
        medium: 'gap-4',
        large: 'gap-6'
      }
    };
  }

  // Desktop
  return {
    cardSize: { width: 80, height: 120 }, // 5rem x 7.5rem
    coinSize: 120,
    buttonSize: 'lg',
    animationComplexity,
    touchFriendly: false,
    fontSize: {
      small: 'text-base',
      medium: 'text-lg',
      large: 'text-2xl',
      xlarge: 'text-4xl'
    },
    spacing: {
      small: 'gap-2',
      medium: 'gap-6',
      large: 'gap-8'
    }
  };
};

export const useGameResponsive = () => {
  const [breakpoints, setBreakpoints] = useState<GameBreakpoints>(getBreakpoints);
  const [config, setConfig] = useState<GameResponsiveConfig>(getResponsiveConfig(getBreakpoints()));

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoints = getBreakpoints();
      setBreakpoints(newBreakpoints);
      setConfig(getResponsiveConfig(newBreakpoints));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    breakpoints,
    config,
    // Utility functions
    getCardStyle: () => ({
      width: `${config.cardSize.width}px`,
      height: `${config.cardSize.height}px`
    }),
    getCoinStyle: () => ({
      width: `${config.coinSize}px`,
      height: `${config.coinSize}px`
    }),
    getAnimationProps: (baseProps: any) => {
      if (config.animationComplexity === 'low') {
        return {
          ...baseProps,
          transition: { ...baseProps.transition, duration: 0.2 }
        };
      }
      if (config.animationComplexity === 'medium') {
        return {
          ...baseProps,
          transition: { ...baseProps.transition, duration: baseProps.transition?.duration * 0.7 || 0.3 }
        };
      }
      return baseProps;
    }
  };
};
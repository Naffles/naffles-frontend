import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameResponsive } from '@hooks/useGameResponsive';
import { useGameAssetPreloader, AssetPreloadConfig } from '@utils/gameAssetPreloader';

interface ResponsiveGameContainerProps {
  children: React.ReactNode;
  gameType: 'blackjack' | 'coin-toss' | 'rps';
  assetConfig?: AssetPreloadConfig;
  className?: string;
  showLoadingScreen?: boolean;
}

interface LoadingScreenProps {
  progress: number;
  gameType: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, gameType }) => (
  <div className="absolute inset-0 bg-nafl-grey-900 flex flex-col items-center justify-center z-50">
    <div className="text-nafl-white text-2xl font-bold mb-8 capitalize">
      Loading {gameType.replace('-', ' ')}...
    </div>
    
    {/* Loading bar */}
    <div className="w-64 h-2 bg-nafl-grey-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-nafl-aqua-500 to-nafl-sponge-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    
    <div className="text-nafl-white text-sm mt-4">
      {Math.round(progress)}%
    </div>
    
    {/* Loading animation */}
    <div className="mt-8 flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-nafl-aqua-500 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  </div>
);

const SkeletonLoader: React.FC<{ gameType: string }> = ({ gameType }) => {
  const { config } = useGameResponsive();
  
  return (
    <div className="animate-pulse">
      {gameType === 'blackjack' && (
        <div className="space-y-4">
          {/* Dealer cards skeleton */}
          <div className="flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-nafl-grey-600 rounded-lg"
                style={config.getCardStyle()}
              />
            ))}
          </div>
          
          {/* Player cards skeleton */}
          <div className="flex justify-center gap-2 mt-16">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-nafl-grey-600 rounded-lg"
                style={config.getCardStyle()}
              />
            ))}
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-nafl-grey-600 rounded-lg w-20 h-10" />
            ))}
          </div>
        </div>
      )}
      
      {gameType === 'coin-toss' && (
        <div className="flex flex-col items-center space-y-8">
          {/* Coin skeleton */}
          <div
            className="bg-nafl-grey-600 rounded-full"
            style={config.getCoinStyle()}
          />
          
          {/* Buttons skeleton */}
          <div className="flex gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-nafl-grey-600 rounded-lg w-24 h-16" />
            ))}
          </div>
        </div>
      )}
      
      {gameType === 'rps' && (
        <div className="flex flex-col items-center space-y-8">
          {/* Hands skeleton */}
          <div className="flex gap-16">
            {[1, 2].map((i) => (
              <div key={i} className="bg-nafl-grey-600 rounded-full w-32 h-32" />
            ))}
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-nafl-grey-600 rounded-lg w-20 h-20" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResponsiveGameContainer: React.FC<ResponsiveGameContainerProps> = ({
  children,
  gameType,
  assetConfig,
  className = '',
  showLoadingScreen = true
}) => {
  const { breakpoints, config } = useGameResponsive();
  const { preloadAssets } = useGameAssetPreloader();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(showLoadingScreen && !!assetConfig);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!assetConfig || !showLoadingScreen) {
      setIsLoading(false);
      return;
    }

    const loadAssets = async () => {
      try {
        await preloadAssets(assetConfig, (result) => {
          setLoadingProgress(result.progress);
          
          if (result.completed) {
            setTimeout(() => {
              setIsLoading(false);
            }, 500); // Small delay for smooth transition
          }
        });
      } catch (error) {
        console.warn('Asset preloading failed:', error);
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [assetConfig, showLoadingScreen, preloadAssets]);

  // Show skeleton loader for slow connections
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const getContainerClasses = () => {
    const baseClasses = 'relative w-full mx-auto transition-all duration-300';
    const responsiveClasses = breakpoints.mobile 
      ? 'max-w-sm px-2' 
      : breakpoints.tablet 
      ? 'max-w-2xl px-4' 
      : 'max-w-4xl px-6';
    
    return `${baseClasses} ${responsiveClasses} ${className}`;
  };

  const getGameAreaClasses = () => {
    const baseClasses = 'relative bg-gradient-to-br from-nafl-grey-800 via-nafl-grey-700 to-nafl-grey-900 rounded-3xl overflow-hidden border-4 border-nafl-aqua-500 shadow-2xl';
    const heightClass = breakpoints.mobile ? 'h-[400px]' : breakpoints.tablet ? 'h-[500px]' : 'h-[600px]';
    
    return `${baseClasses} ${heightClass}`;
  };

  // Orientation lock for mobile gaming
  useEffect(() => {
    if (breakpoints.mobile && 'screen' in window && 'orientation' in window.screen) {
      const lockOrientation = async () => {
        try {
          if (gameType === 'blackjack') {
            // Blackjack works better in landscape
            await (window.screen.orientation as any).lock('landscape');
          }
        } catch (error) {
          // Orientation lock not supported or failed
          console.log('Orientation lock not available');
        }
      };

      lockOrientation();

      return () => {
        try {
          (window.screen.orientation as any).unlock();
        } catch (error) {
          // Ignore unlock errors
        }
      };
    }
  }, [breakpoints.mobile, gameType]);

  return (
    <div className={getContainerClasses()}>
      <div className={getGameAreaClasses()}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {showSkeleton ? (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <SkeletonLoader gameType={gameType} />
                </div>
              ) : (
                <LoadingScreen progress={loadingProgress} gameType={gameType} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs text-nafl-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {breakpoints.mobile ? 'Mobile' : breakpoints.tablet ? 'Tablet' : 'Desktop'} | 
          {config.animationComplexity} | 
          {breakpoints.prefersReducedMotion ? 'Reduced Motion' : 'Full Motion'}
        </div>
      )}
    </div>
  );
};
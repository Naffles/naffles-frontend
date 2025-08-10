import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameResponsive } from '@hooks/useGameResponsive';
import { gameAssetManager } from '@utils/gameAssetManager';

interface GameLoadingScreenProps {
  gameType: 'blackjack' | 'coin-toss' | 'rps';
  onLoadingComplete: () => void;
  showProgress?: boolean;
  showTips?: boolean;
}

interface LoadingTip {
  text: string;
  icon: string;
}

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({
  gameType,
  onLoadingComplete,
  showProgress = true,
  showTips = true
}) => {
  const { breakpoints, config } = useGameResponsive();
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Game-specific loading tips
  const getGameTips = (gameType: string): LoadingTip[] => {
    const tips = {
      blackjack: [
        { text: "Aces can be worth 1 or 11 points", icon: "🃏" },
        { text: "Get as close to 21 without going over", icon: "🎯" },
        { text: "Double down to double your bet and get one more card", icon: "⬆️" },
        { text: "Split pairs to play two hands", icon: "↔️" },
        { text: "Dealer must hit on 16 and stand on 17", icon: "🏠" }
      ],
      'coin-toss': [
        { text: "Choose heads (Pepe) or tails (Bitcoin)", icon: "🪙" },
        { text: "Watch the coin fly to the moon!", icon: "🌙" },
        { text: "50/50 chance - pure luck!", icon: "🍀" },
        { text: "Quick and exciting gameplay", icon: "⚡" },
        { text: "Perfect for beginners", icon: "👶" }
      ],
      rps: [
        { text: "Rock crushes scissors", icon: "✊" },
        { text: "Paper covers rock", icon: "✋" },
        { text: "Scissors cuts paper", icon: "✌️" },
        { text: "You have 30 seconds to choose", icon: "⏰" },
        { text: "Auto-select if time runs out", icon: "🤖" }
      ]
    };
    
    return tips[gameType] || [];
  };

  const tips = getGameTips(gameType);

  // Simulate asset loading progress
  useEffect(() => {
    const deviceType = breakpoints.mobile ? 'mobile' : breakpoints.tablet ? 'tablet' : 'desktop';
    
    const loadAssets = async () => {
      try {
        // Simulate progressive loading
        const intervals = [20, 40, 60, 80, 95, 100];
        
        for (let i = 0; i < intervals.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
          setProgress(intervals[i]);
        }
        
        // Actually preload the assets
        await gameAssetManager.preloadGameAssets(gameType, deviceType);
        
        setProgress(100);
        setIsComplete(true);
        
        // Small delay before completing
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
        
      } catch (error) {
        console.error('Asset loading failed:', error);
        // Continue anyway with fallbacks
        setProgress(100);
        setIsComplete(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    };

    loadAssets();
  }, [gameType, breakpoints, onLoadingComplete]);

  // Cycle through tips
  useEffect(() => {
    if (!showTips || tips.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [tips.length, showTips]);

  const getGameIcon = (gameType: string) => {
    const icons = {
      blackjack: '🃏',
      'coin-toss': '🪙',
      rps: '✊'
    };
    return icons[gameType] || '🎮';
  };

  const getGameTitle = (gameType: string) => {
    const titles = {
      blackjack: 'Blackjack',
      'coin-toss': 'Coin Toss',
      rps: 'Rock Paper Scissors'
    };
    return titles[gameType] || 'Game';
  };

  return (
    <div className="fixed inset-0 bg-nafl-grey-900 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        
        {/* Game Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={`text-8xl mb-6 ${breakpoints.mobile ? 'text-6xl mb-4' : ''}`}
        >
          {getGameIcon(gameType)}
        </motion.div>

        {/* Game Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`font-bold text-nafl-white mb-8 ${
            breakpoints.mobile ? 'text-2xl mb-6' : 'text-4xl'
          }`}
        >
          Loading {getGameTitle(gameType)}
        </motion.h1>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="w-full bg-nafl-grey-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-nafl-aqua-500 to-nafl-sponge-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2 text-sm text-nafl-grey-400">
              <span>Loading assets...</span>
              <span>{progress}%</span>
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-nafl-aqua-500 rounded-full mx-1"
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

        {/* Game Tips */}
        {showTips && tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="min-h-[60px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-2xl mb-2">{tips[currentTip].icon}</div>
                <div className={`text-nafl-grey-300 ${
                  breakpoints.mobile ? 'text-sm' : 'text-base'
                }`}>
                  {tips[currentTip].text}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Completion Animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-6xl">✅</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton Preview */}
        {progress > 50 && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="mt-8 p-4 border border-nafl-grey-700 rounded-lg"
          >
            <div className="text-nafl-grey-500 text-xs mb-2">Preview</div>
            
            {gameType === 'blackjack' && (
              <div className="flex justify-center gap-2">
                {gameAssetManager.generateSkeletonCard()}
                {gameAssetManager.generateSkeletonCard()}
              </div>
            )}
            
            {gameType === 'coin-toss' && (
              <div className="flex justify-center">
                {gameAssetManager.generateSkeletonCoin()}
              </div>
            )}
            
            {gameType === 'rps' && (
              <div className="flex justify-center gap-4">
                <div className="w-16 h-16 bg-nafl-grey-600 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 bg-nafl-grey-600 rounded-full animate-pulse"></div>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-nafl-grey-500 text-xs"
        >
          Powered by Naffles Gaming Platform
        </motion.div>
      </div>
    </div>
  );
};
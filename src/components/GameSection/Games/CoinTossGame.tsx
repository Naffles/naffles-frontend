import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/shared/Button";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import { GameHistoryDisplay, useGameHistory } from "./GameHistoryDisplay";

interface CoinTossState {
  gameStatus: 'waiting' | 'countdown' | 'throwing' | 'landing' | 'finished';
  selectedChoice?: 'heads' | 'tails';
  result?: 'heads' | 'tails';
  gameResult?: 'win' | 'lose';
  countdown: number;
}

export const CoinTossGame = (props: GameContainerProps) => {
  const {
    onGameStart,
    onGameReset,
    isPaused,
    resetToInitial,
    onLimitReached,
    callGameResultModal,
  } = props;
  
  const { setPoints } = useBasicUser();
  const [gameState, setGameState] = useState<CoinTossState>({
    gameStatus: 'waiting',
    countdown: 3
  });
  const [displayPoints, setDisplayPoints] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Game history hook
  const { addResult } = useGameHistory('coin-toss');
  
  // Audio refs for sound effects
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const landingSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Performance optimization states
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [batteryConservation, setBatteryConservation] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize audio elements and performance settings
  useEffect(() => {
    // Create audio elements for sound effects
    spinSoundRef.current = new Audio();
    landingSoundRef.current = new Audio();
    
    // Set audio properties
    if (spinSoundRef.current) {
      spinSoundRef.current.volume = 0.3;
      spinSoundRef.current.preload = 'auto';
    }
    if (landingSoundRef.current) {
      landingSoundRef.current.volume = 0.5;
      landingSoundRef.current.preload = 'auto';
    }
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Battery conservation mode detection
    const checkBatteryStatus = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          const lowBattery = battery.level < 0.2 && !battery.charging;
          setBatteryConservation(lowBattery);
          
          battery.addEventListener('levelchange', () => {
            const isLowBattery = battery.level < 0.2 && !battery.charging;
            setBatteryConservation(isLowBattery);
          });
        }
      } catch (error) {
        // Battery API not supported, continue without battery optimization
      }
    };
    
    checkBatteryStatus();
    
    return () => {
      // Cleanup audio elements
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current = null;
      }
      if (landingSoundRef.current) {
        landingSoundRef.current.pause();
        landingSoundRef.current = null;
      }
      
      // Cleanup event listeners
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('resize', checkMobile);
      
      // Cancel any pending animation frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Performance-optimized animation configurations
  const getAnimationConfig = useCallback(() => {
    if (reducedMotion) {
      return {
        duration: 0.5,
        rotations: 180,
        sparkles: 4,
        fireworks: false,
        blur: false
      };
    }
    
    if (batteryConservation || isMobile) {
      return {
        duration: 1.5,
        rotations: 720,
        sparkles: 6,
        fireworks: true,
        blur: false,
        frameRate: 30
      };
    }
    
    return {
      duration: 2.5,
      rotations: 2880,
      sparkles: 12,
      fireworks: true,
      blur: true,
      frameRate: 60
    };
  }, [reducedMotion, batteryConservation, isMobile]);
  
  // Play sound effect helper
  const playSound = useCallback((type: 'spin' | 'landing') => {
    try {
      if (type === 'spin' && spinSoundRef.current) {
        // Generate coin spinning sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create spinning sound effect
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 2.5);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
        
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2.5);
        
      } else if (type === 'landing' && landingSoundRef.current) {
        // Generate coin landing sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create metallic landing sound
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.type = 'triangle';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      // Silently fail if audio context is not supported
      console.warn('Audio playback not supported:', error);
    }
  }, []);

  const startGame = useCallback(async (choice: 'heads' | 'tails') => {
    setHasError(false);
    setGameState(prev => ({
      ...prev,
      selectedChoice: choice,
      gameStatus: 'countdown',
      countdown: 3
    }));
    onGameStart?.(choice);
  }, [onGameStart]);

  const triggerCoinToss = useCallback(async () => {
    try {
      // Initialize secure game session
      const initResponse = await axios.post("/unified-secure-games/initialize", {
        gameType: 'coin-toss',
        tokenType: 'eth',
        betAmount: '0.01',
        gameConfig: { playerChoice: gameState.selectedChoice }
      });
      
      const { sessionId, signedGameState } = initResponse.data.data;
      
      // Process coin toss
      const response = await axios.post(`/unified-secure-games/${sessionId}/action`, {
        gameType: 'coin-toss',
        action: 'flip',
        signedGameState
      });
      
      const { data } = response.data;
      setDisplayPoints(data?.score || 0);
      
      // Start throwing animation with sound
      setGameState(prev => ({
        ...prev,
        gameStatus: 'throwing'
      }));
      
      // Play spinning sound effect
      playSound('spin');
      
      // After throw animation, show result
      setTimeout(() => {
        const coinResult = data.result === 'win' ? gameState.selectedChoice : 
                          (gameState.selectedChoice === 'heads' ? 'tails' : 'heads');
        
        setGameState(prev => ({
          ...prev,
          gameStatus: 'landing',
          result: coinResult,
          gameResult: data.result
        }));
        
        // Record result in history
        if (coinResult) {
          addResult(coinResult);
        }
        
        // Play landing sound effect
        playSound('landing');
        
        // Show final result
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameStatus: 'finished' }));
          callGameResultModal(data.result);
          
          // Reset after 3 seconds
          setTimeout(() => {
            resetGame();
          }, 3000);
        }, 1500); // Adjusted timing for landing animation
      }, 2500); // Extended for longer spinning animation
      
    } catch (error: any) {
      setHasError(true);
      if (error.response?.data?.statusCode === 429) {
        alert(error.response.data.message);
        onLimitReached();
      } else {
        alert("An error occurred while playing Coin toss");
      }
      resetGame();
    }
  }, [gameState.selectedChoice, onLimitReached, callGameResultModal]);

  const resetGame = () => {
    setGameState({
      gameStatus: 'waiting',
      countdown: 3
    });
    onGameReset?.();
  };

  // Countdown effect
  useEffect(() => {
    if (gameState.gameStatus === 'countdown' && gameState.countdown > 0) {
      const timer = setTimeout(() => {
        if (gameState.countdown === 1) {
          triggerCoinToss();
        } else {
          setGameState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.countdown, triggerCoinToss]);

  // Twinkling stars animation
  const StarField = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  // Moon component
  const Moon = () => (
    <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-lg">
      {/* Moon craters */}
      <div className="absolute top-2 left-3 w-2 h-2 bg-gray-500 rounded-full opacity-30" />
      <div className="absolute top-6 right-4 w-3 h-3 bg-gray-500 rounded-full opacity-20" />
      <div className="absolute bottom-4 left-6 w-1 h-1 bg-gray-500 rounded-full opacity-40" />
    </div>
  );

  // Enhanced Coin component with performance-optimized animation
  const Coin = () => {
    const isHeads = gameState.result === 'heads';
    const showResult = gameState.gameStatus === 'landing' || gameState.gameStatus === 'finished';
    const config = getAnimationConfig();
    
    return (
      <motion.div
        className="relative w-32 h-32 mx-auto"
        initial={{ x: 0, y: 0, rotateY: 0, rotateX: 0, scale: 1 }}
        animate={
          gameState.gameStatus === 'throwing' ? {
            // Performance-optimized throwing animation
            x: [0, 200, 400],
            y: [0, -300, -100],
            rotateY: [0, config.rotations * 0.125, config.rotations * 0.375, config.rotations * 0.75, config.rotations],
            rotateX: reducedMotion ? [0, 0, 0, 0, 0] : [0, 180, 540, 900, 1260],
            scale: reducedMotion ? [1, 1, 1, 1, 1] : [1, 0.8, 1.2, 0.9, 1],
            transition: {
              duration: config.duration,
              ease: reducedMotion ? "linear" : [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.2, 0.5, 0.8, 1],
              rotateY: {
                ease: reducedMotion ? "linear" : [0.6, 0.01, 0.05, 0.95],
                times: [0, 0.3, 0.7, 1]
              },
              rotateX: {
                ease: reducedMotion ? "linear" : [0.6, 0.01, 0.05, 0.95],
                times: [0, 0.3, 0.7, 1]
              }
            }
          } : gameState.gameStatus === 'landing' ? {
            // Performance-optimized landing animation
            y: reducedMotion ? [0, 10, 0] : [0, 30, 0, 15, 0, 8, 0],
            rotateY: showResult ? (isHeads ? 0 : 180) : 0,
            rotateX: 0,
            scale: reducedMotion ? [1, 1, 1] : [1, 1.1, 0.95, 1.05, 0.98, 1.02, 1],
            transition: {
              duration: reducedMotion ? 0.5 : 1.5,
              ease: "easeOut",
              times: reducedMotion ? [0, 0.5, 1] : [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1]
            }
          } : {}
        }
        style={{
          // GPU acceleration and conditional blur
          transform: 'translateZ(0)', // Force GPU acceleration
          willChange: gameState.gameStatus === 'throwing' ? 'transform, filter' : 'auto',
          filter: (gameState.gameStatus === 'throwing' && config.blur) ? 'blur(2px)' : 'blur(0px)',
          transition: 'filter 0.3s ease-in-out'
        }}
      >
        {/* Performance-optimized sparkle effects during rapid spinning */}
        {gameState.gameStatus === 'throwing' && !reducedMotion && (
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
            {/* Primary sparkles */}
            {[...Array(config.sparkles)].map((_, i) => (
              <motion.div
                key={`primary-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  willChange: 'transform, opacity'
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: batteryConservation ? [0, 180] : [0, 180, 360],
                }}
                transition={{
                  duration: batteryConservation ? 0.6 : 0.4,
                  repeat: Infinity,
                  delay: Math.random() * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Secondary sparkles - reduced on mobile/battery save */}
            {!batteryConservation && [...Array(Math.min(16, config.sparkles + 4))].map((_, i) => (
              <motion.div
                key={`secondary-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  willChange: 'transform, opacity'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: [0, (Math.random() - 0.5) * (isMobile ? 20 : 40)],
                  y: [0, (Math.random() - 0.5) * (isMobile ? 20 : 40)],
                }}
                transition={{
                  duration: isMobile ? 0.4 : 0.6,
                  repeat: Infinity,
                  delay: Math.random() * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Motion blur trails - only on desktop with good performance */}
            {!isMobile && !batteryConservation && config.blur && [...Array(6)].map((_, i) => (
              <motion.div
                key={`trail-${i}`}
                className="absolute w-8 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                  rotate: `${Math.random() * 360}deg`,
                  willChange: 'transform, opacity'
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: Math.random() * 0.2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Coin faces */}
        <div className="relative w-full h-full">
          {/* Heads side - Pepe */}
          <motion.div
            className={`absolute inset-0 w-32 h-32 rounded-full border-4 border-nafl-sponge-500 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl ${
              showResult && !isHeads ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: showResult && !isHeads ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="text-6xl">🐸</div>
            <div className="absolute bottom-2 text-xs font-bold text-green-800">HEADS</div>
          </motion.div>
          
          {/* Tails side - Bitcoin */}
          <motion.div
            className={`absolute inset-0 w-32 h-32 rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl ${
              showResult && isHeads ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: showResult && isHeads ? 'rotateY(-180deg)' : 'rotateY(180deg)'
            }}
          >
            <div className="text-4xl font-bold text-white">₿</div>
            <div className="absolute bottom-2 text-xs font-bold text-white">TAILS</div>
          </motion.div>
        </div>
        
        {/* Enhanced winner glow effect with golden aura */}
        {gameState.gameStatus === 'finished' && gameState.gameResult === 'win' && (
          <>
            {/* Golden aura glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255, 215, 0, 0.8)',
                  '0 0 0 30px rgba(255, 215, 0, 0)',
                  '0 0 0 0 rgba(255, 215, 0, 0.8)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner golden glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ opacity: 0.3 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
      </motion.div>
    );
  };

  // Performance-optimized Victory Celebration Component
  const VictoryCelebration = () => {
    if (gameState.gameStatus !== 'finished' || gameState.gameResult !== 'win') {
      return null;
    }

    const config = getAnimationConfig();
    
    // Skip fireworks on reduced motion or battery conservation
    if (reducedMotion) {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
      );
    }

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        {/* Streamer Poppers */}
        {/* Gold streamer popper - top left */}
        <motion.div
          className="absolute top-16 left-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`gold-${i}`}
              className="absolute w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"
              style={{
                transformOrigin: 'bottom center',
                rotate: `${i * 45}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0.8, 0],
                opacity: [0, 1, 0.8, 0],
                y: [0, -20, -40, -60]
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Silver streamer popper - top right */}
        <motion.div
          className="absolute top-16 right-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`silver-${i}`}
              className="absolute w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full"
              style={{
                transformOrigin: 'bottom center',
                rotate: `${i * 45}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0.8, 0],
                opacity: [0, 1, 0.8, 0],
                y: [0, -20, -40, -60]
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Rainbow streamer popper - top center */}
        <motion.div
          className="absolute top-12 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {[...Array(10)].map((_, i) => {
            const colors = [
              'from-red-400 to-red-600',
              'from-orange-400 to-orange-600',
              'from-yellow-400 to-yellow-600',
              'from-green-400 to-green-600',
              'from-blue-400 to-blue-600',
              'from-indigo-400 to-indigo-600',
              'from-purple-400 to-purple-600',
              'from-pink-400 to-pink-600'
            ];
            return (
              <motion.div
                key={`rainbow-${i}`}
                className={`absolute w-1 h-10 bg-gradient-to-b ${colors[i % colors.length]} rounded-full`}
                style={{
                  transformOrigin: 'bottom center',
                  rotate: `${i * 36}deg`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ 
                  scaleY: [0, 1, 0.8, 0],
                  opacity: [0, 1, 0.8, 0],
                  y: [0, -25, -50, -75]
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.7 + i * 0.03,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.div>

        {/* Performance-optimized Small Fireworks */}
        {config.fireworks && (
          <>
            {/* Small Fireworks - Bottom Left Corner */}
            <motion.div
              className="absolute bottom-20 left-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.2 }}
            >
              {[...Array(batteryConservation ? 4 : 6)].map((_, i) => (
                <motion.div
                  key={`firework-gold-${i}`}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform, opacity'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos(i * (360 / (batteryConservation ? 4 : 6)) * Math.PI / 180) * (isMobile ? 20 : 30)],
                    y: [0, Math.sin(i * (360 / (batteryConservation ? 4 : 6)) * Math.PI / 180) * (isMobile ? 20 : 30)],
                  }}
                  transition={{
                    duration: batteryConservation ? 0.8 : 1,
                    delay: 0.9 + i * (batteryConservation ? 0.15 : 0.1),
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Small Fireworks - Bottom Right Corner */}
            <motion.div
              className="absolute bottom-20 right-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, duration: 0.2 }}
            >
              {[...Array(batteryConservation ? 4 : 6)].map((_, i) => (
                <motion.div
                  key={`firework-blue-${i}`}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform, opacity'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos(i * (360 / (batteryConservation ? 4 : 6)) * Math.PI / 180) * (isMobile ? 20 : 30)],
                    y: [0, Math.sin(i * (360 / (batteryConservation ? 4 : 6)) * Math.PI / 180) * (isMobile ? 20 : 30)],
                  }}
                  transition={{
                    duration: batteryConservation ? 0.8 : 1,
                    delay: 1.1 + i * (batteryConservation ? 0.15 : 0.1),
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </>
        )}

        {/* Gradual fade-out overlay */}
        <motion.div
          className="absolute inset-0 bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1] }}
          transition={{ 
            duration: 2,
            delay: 1.5,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      {/* Starry Night Sky Background with GPU acceleration */}
      <div 
        className="relative w-full h-[600px] bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-3xl overflow-hidden border-4 border-nafl-purple shadow-2xl"
        style={{
          transform: 'translateZ(0)', // Force GPU acceleration
          willChange: gameState.gameStatus === 'throwing' ? 'contents' : 'auto'
        }}
      >
        
        {/* Twinkling Stars */}
        <StarField />
        
        {/* Moon */}
        <Moon />
        
        {/* Victory Celebration */}
        <VictoryCelebration />
        
        {/* Game History Display */}
        <GameHistoryDisplay gameType="coin-toss" maxResults={10} />
        
        {/* Game Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          
          {/* Countdown */}
          {gameState.gameStatus === 'countdown' && (
            <motion.div
              key={gameState.countdown}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-8xl font-bold text-nafl-sponge-500 mb-8"
            >
              {gameState.countdown}
            </motion.div>
          )}
          
          {/* Coin */}
          {(gameState.gameStatus === 'throwing' || gameState.gameStatus === 'landing' || gameState.gameStatus === 'finished') && (
            <div className="mb-8">
              <Coin />
            </div>
          )}
          
          {/* Choice Buttons */}
          {gameState.gameStatus === 'waiting' && (
            <div className="flex gap-8 mb-8">
              <Button
                size="lg"
                variant="primary-outline"
                onClick={() => startGame('heads')}
                disabled={isPaused}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-xl"
              >
                🐸 HEADS
              </Button>
              
              <Button
                size="lg"
                variant="primary-outline"
                onClick={() => startGame('tails')}
                disabled={isPaused}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-xl"
              >
                ₿ TAILS
              </Button>
            </div>
          )}
          
          {/* Selected Choice Display */}
          {gameState.selectedChoice && gameState.gameStatus !== 'waiting' && (
            <div className="text-nafl-white text-xl font-bold mb-4">
              You chose: {gameState.selectedChoice === 'heads' ? '🐸 HEADS' : '₿ TAILS'}
            </div>
          )}
          
          {/* Result Display */}
          {gameState.gameStatus === 'finished' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold mb-2 ${
                gameState.gameResult === 'win' ? 'text-green-500' : 'text-red-500'
              }`}>
                {gameState.gameResult === 'win' ? 'YOU WIN!' : 'YOU LOSE!'}
              </div>
              <div className="text-nafl-white text-lg">
                Result: {gameState.result === 'heads' ? '🐸 HEADS' : '₿ TAILS'}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Game Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-nafl-purple bg-opacity-90 p-4">
          <div className="flex justify-between items-center text-nafl-white">
            <div className="text-sm">
              {gameState.gameStatus === 'waiting' && 'Choose Heads or Tails'}
              {gameState.gameStatus === 'countdown' && 'Get ready...'}
              {gameState.gameStatus === 'throwing' && 'Coin is flying to the moon!'}
              {gameState.gameStatus === 'landing' && 'Landing...'}
              {gameState.gameStatus === 'finished' && 'Game complete!'}
            </div>
            <div className="text-sm">
              Points: {displayPoints}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="flex lg:hidden mt-4 gap-4 justify-center">
        {gameState.gameStatus === 'waiting' && (
          <>
            <Button
              size="sm"
              variant="primary-outline"
              onClick={() => startGame('heads')}
              disabled={isPaused}
              className="bg-green-600 hover:bg-green-700"
            >
              🐸 HEADS
            </Button>
            
            <Button
              size="sm"
              variant="primary-outline"
              onClick={() => startGame('tails')}
              disabled={isPaused}
              className="bg-orange-600 hover:bg-orange-700"
            >
              ₿ TAILS
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

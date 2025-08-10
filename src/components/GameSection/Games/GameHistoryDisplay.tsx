import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GameHistoryDisplay.module.css";

interface GameResult {
  id: string;
  result: string;
  timestamp: number;
}

interface GameHistoryDisplayProps {
  gameType: 'coin-toss' | 'rock-paper-scissors' | 'blackjack';
  maxResults?: number;
  className?: string;
}

// Maximum results to store in localStorage (for cleanup)
const MAX_STORED_RESULTS = 50;

export const GameHistoryDisplay = ({ 
  gameType, 
  maxResults = 10, 
  className = "" 
}: GameHistoryDisplayProps) => {
  const [results, setResults] = useState<GameResult[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Storage key based on game type
  const storageKey = `naffles-${gameType}-history`;
  
  // Detect mobile device for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load results from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedResults = JSON.parse(stored);
        // Clean up old results if they exceed MAX_STORED_RESULTS
        const cleanedResults = parsedResults.slice(0, MAX_STORED_RESULTS);
        if (cleanedResults.length !== parsedResults.length) {
          localStorage.setItem(storageKey, JSON.stringify(cleanedResults));
        }
        setResults(cleanedResults.slice(0, maxResults));
      }
    } catch (error) {
      console.warn('Failed to load game history:', error);
      // Clear corrupted data
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, maxResults]);
  
  // Function to add a new result with automatic cleanup
  const addResult = (result: string) => {
    const newResult: GameResult = {
      id: `${Date.now()}-${Math.random()}`,
      result,
      timestamp: Date.now()
    };
    
    setResults(prevResults => {
      const updatedResults = [newResult, ...prevResults].slice(0, maxResults);
      
      // Store in localStorage with automatic cleanup
      try {
        const allResults = [newResult, ...prevResults].slice(0, MAX_STORED_RESULTS);
        localStorage.setItem(storageKey, JSON.stringify(allResults));
        
        // Session persistence - also store in sessionStorage for session recovery
        sessionStorage.setItem(`${storageKey}-session`, JSON.stringify(updatedResults));
      } catch (error) {
        console.warn('Failed to save game history:', error);
        // If localStorage is full, try to clear old entries
        try {
          const reducedResults = [newResult, ...prevResults].slice(0, Math.floor(MAX_STORED_RESULTS / 2));
          localStorage.setItem(storageKey, JSON.stringify(reducedResults));
        } catch (secondError) {
          console.error('Failed to save even reduced game history:', secondError);
        }
      }
      
      return updatedResults;
    });
  };
  
  // Expose addResult function to parent components
  useEffect(() => {
    // Create a global function that can be called by game components
    (window as any)[`add${gameType.replace(/-/g, '')}Result`] = addResult;
    
    return () => {
      delete (window as any)[`add${gameType.replace(/-/g, '')}Result`];
    };
  }, [gameType]);
  
  // Don't render anything for blackjack
  if (gameType === 'blackjack') {
    return null;
  }
  
  // Don't render if no results
  if (results.length === 0) {
    return null;
  }
  
  // Render coin toss history
  if (gameType === 'coin-toss') {
    const coinSize = isMobile ? 'w-5 h-5' : 'w-6 h-6';
    const textSize = isMobile ? 'text-xs' : 'text-xs';
    const gap = isMobile ? 'gap-0.5' : 'gap-1';
    
    return (
      <div className={`absolute top-4 right-4 z-20 ${className}`}>
        <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-2 opacity-70 hover:opacity-100 transition-opacity duration-300 ${styles['non-intrusive-positioning']}`}>
          <div className={`${textSize} text-white/80 mb-1 text-center`}>Recent Results</div>
          <div className={`flex ${gap} max-w-xs overflow-hidden`}>
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: Math.max(0.3, 1 - (index * 0.1)) // Fade effect for older results
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative flex-shrink-0 ${styles['history-item']}`}
                  title={`${result.result === 'heads' ? 'Heads' : 'Tails'} - ${new Date(result.timestamp).toLocaleTimeString()}`}
                >
                  <div className={`${coinSize} rounded-full border border-white/30 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xs font-bold`}>
                    {result.result === 'heads' ? 'H' : 'T'}
                  </div>
                  {/* Small icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    {result.result === 'heads' ? '🐸' : '₿'}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
  
  // Render rock paper scissors history
  if (gameType === 'rock-paper-scissors') {
    const maxRPSResults = Math.min(maxResults, 8); // Limit to 8 for RPS
    const displayResults = results.slice(0, maxRPSResults);
    const handSize = isMobile ? 'w-6 h-6' : 'w-8 h-8';
    const textSize = isMobile ? 'text-xs' : 'text-xs';
    const iconSize = isMobile ? 'text-sm' : 'text-lg';
    const gap = isMobile ? 'gap-0.5' : 'gap-1';
    
    return (
      <div className={`absolute top-4 right-4 z-20 ${className}`}>
        <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-2 opacity-70 hover:opacity-100 transition-opacity duration-300 ${styles['non-intrusive-positioning']}`}>
          <div className={`${textSize} text-white/80 mb-1 text-center`}>System Moves</div>
          <div className={`flex ${gap} max-w-xs overflow-hidden`}>
            <AnimatePresence>
              {displayResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: Math.max(0.3, 1 - (index * 0.1)) // Fade effect for older results
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex flex-col items-center flex-shrink-0 ${styles['history-item']}`}
                  title={`${result.result.charAt(0).toUpperCase() + result.result.slice(1)} - ${new Date(result.timestamp).toLocaleTimeString()}`}
                >
                  <div className={`${handSize} rounded-lg border border-white/30 bg-black/40 flex items-center justify-center ${iconSize}`}>
                    {result.result === 'rock' && '✊'}
                    {result.result === 'paper' && '✋'}
                    {result.result === 'scissors' && '✌️'}
                  </div>
                  <div className={`${textSize} text-white/60 mt-1`}>
                    {result.result.charAt(0).toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

// Hook for easy integration with game components
export const useGameHistory = (gameType: 'coin-toss' | 'rock-paper-scissors' | 'blackjack') => {
  const addResult = (result: string) => {
    const addResultFn = (window as any)[`add${gameType.replace(/-/g, '')}Result`];
    if (addResultFn) {
      addResultFn(result);
    }
  };
  
  return { addResult };
};
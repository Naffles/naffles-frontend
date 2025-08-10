import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface GameIFrameMessage {
  type: string;
  payload: any;
  source?: string;
}

interface GameIFrameWrapperProps {
  gameType: 'blackjack' | 'coin-toss' | 'rps';
  sessionId?: string;
  tokenType?: string;
  betAmount?: string;
  theme?: string;
  autoStart?: boolean;
  onGameInitialized?: (data: any) => void;
  onGameStateChanged?: (data: any) => void;
  onGameCompleted?: (data: any) => void;
  onGameError?: (error: any) => void;
  onResize?: (dimensions: { width: number; height: number }) => void;
  className?: string;
}

interface GameDimensions {
  width: string;
  height: string;
  aspectRatio: string;
}

export const GameIFrameWrapper: React.FC<GameIFrameWrapperProps> = ({
  gameType,
  sessionId,
  tokenType,
  betAmount,
  theme,
  autoStart = false,
  onGameInitialized,
  onGameStateChanged,
  onGameCompleted,
  onGameError,
  onResize,
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState<GameDimensions>({ width: '800', height: '600', aspectRatio: '4:3' });
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'completed' | 'error'>('loading');

  // Game-specific configurations
  const getGameConfig = useCallback((gameType: string): GameDimensions => {
    const configs = {
      'blackjack': { width: '900', height: '700', aspectRatio: '9:7' },
      'coin-toss': { width: '600', height: '600', aspectRatio: '1:1' },
      'rps': { width: '700', height: '500', aspectRatio: '7:5' }
    };
    return configs[gameType as keyof typeof configs] || { width: '800', height: '600', aspectRatio: '4:3' };
  }, []);

  // Build iframe URL
  const buildIFrameURL = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    const gameUrl = `${baseUrl}/games/iframe/${gameType}`;
    
    const params = new URLSearchParams();
    if (sessionId) params.append('sessionId', sessionId);
    if (tokenType) params.append('tokenType', tokenType);
    if (betAmount) params.append('betAmount', betAmount);
    if (theme) params.append('theme', theme);
    if (autoStart) params.append('autoStart', 'true');

    return params.toString() ? `${gameUrl}?${params.toString()}` : gameUrl;
  }, [gameType, sessionId, tokenType, betAmount, theme, autoStart]);

  // Send message to iframe
  const sendMessageToGame = useCallback((type: string, payload: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type,
        payload,
        source: 'parent'
      }, '*');
    }
  }, []);

  // Handle messages from iframe
  const handleMessage = useCallback((event: MessageEvent<GameIFrameMessage>) => {
    // Verify origin (in production, check against allowed origins)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://naffles.com',
      'https://staging.naffles.com'
    ];

    if (process.env.NODE_ENV === 'production' && !allowedOrigins.includes(event.origin)) {
      console.warn('Received message from unauthorized origin:', event.origin);
      return;
    }

    const { type, payload } = event.data;

    switch (type) {
      case 'GAME_INITIALIZED':
        setGameState('ready');
        onGameInitialized?.(payload);
        break;

      case 'GAME_STATE_CHANGED':
        if (payload.state) {
          setGameState(payload.state);
        }
        onGameStateChanged?.(payload);
        break;

      case 'GAME_COMPLETED':
        setGameState('completed');
        onGameCompleted?.(payload);
        break;

      case 'GAME_ERROR':
        setGameState('error');
        onGameError?.(payload);
        break;

      case 'RESIZE_REQUEST':
        if (payload.width && payload.height) {
          const newDimensions = {
            width: payload.width.toString(),
            height: payload.height.toString(),
            aspectRatio: dimensions.aspectRatio
          };
          setDimensions(newDimensions);
          onResize?.(payload);
        }
        break;

      case 'GAME_READY':
        setIsLoaded(true);
        if (autoStart) {
          sendMessageToGame('INITIALIZE_GAME', { autoStart: true });
        }
        break;

      default:
        console.log('Unknown message type from game iframe:', type);
    }
  }, [onGameInitialized, onGameStateChanged, onGameCompleted, onGameError, onResize, dimensions.aspectRatio, autoStart, sendMessageToGame]);

  // Initialize dimensions and message listener
  useEffect(() => {
    setDimensions(getGameConfig(gameType));

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameType, getGameConfig, handleMessage]);

  // Handle iframe load
  const handleIFrameLoad = () => {
    setIsLoaded(true);
    // Send initial configuration
    setTimeout(() => {
      sendMessageToGame('PARENT_READY', {
        gameType,
        sessionId,
        tokenType,
        betAmount,
        theme
      });
    }, 100);
  };

  // API methods for parent component
  const gameAPI = {
    initializeGame: (config: any) => sendMessageToGame('INITIALIZE_GAME', config),
    sendAction: (action: string, data: any) => sendMessageToGame('GAME_ACTION', { action, data }),
    requestGameState: () => sendMessageToGame('REQUEST_GAME_STATE', {}),
    pauseGame: () => sendMessageToGame('PAUSE_GAME', {}),
    resumeGame: () => sendMessageToGame('RESUME_GAME', {}),
    endGame: () => sendMessageToGame('END_GAME', {})
  };

  // Expose API to parent component
  React.useImperativeHandle(React.forwardRef(() => null), () => gameAPI, [sendMessageToGame]);

  // Calculate padding for responsive aspect ratio
  const calculatePaddingTop = (aspectRatio: string) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Responsive container */}
      <div 
        className="relative w-full"
        style={{ paddingTop: calculatePaddingTop(dimensions.aspectRatio) }}
      >
        {/* Loading overlay */}
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-nafl-grey-800 rounded-lg flex items-center justify-center z-10"
          >
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-nafl-aqua-500 border-t-transparent rounded-full mx-auto mb-4" />
              <div className="text-nafl-white text-lg font-bold">
                Loading {gameType.replace('-', ' ')}...
              </div>
            </div>
          </motion.div>
        )}

        {/* Game state indicator */}
        {isLoaded && gameState !== 'ready' && gameState !== 'playing' && (
          <div className="absolute top-4 right-4 z-20">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              gameState === 'loading' ? 'bg-yellow-500 text-black' :
              gameState === 'completed' ? 'bg-green-500 text-white' :
              gameState === 'error' ? 'bg-red-500 text-white' :
              'bg-nafl-aqua-500 text-white'
            }`}>
              {gameState.toUpperCase()}
            </div>
          </div>
        )}

        {/* IFrame */}
        <iframe
          ref={iframeRef}
          src={buildIFrameURL()}
          className="absolute top-0 left-0 w-full h-full border-none rounded-lg shadow-lg"
          title={`Naffles ${gameType} Game`}
          frameBorder="0"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={handleIFrameLoad}
          style={{
            minHeight: '400px',
            background: 'linear-gradient(135deg, #2F2F2F 0%, #1A1A1A 100%)'
          }}
        />
      </div>

      {/* Game controls (if needed) */}
      {isLoaded && gameState === 'ready' && !autoStart && (
        <div className="mt-4 text-center">
          <button
            onClick={() => gameAPI.initializeGame({ autoStart: true })}
            className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Error state */}
      {gameState === 'error' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="font-bold">Game Error</div>
          <div className="text-sm">
            There was an error loading the game. Please try refreshing the page.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

// Hook for using the game API
export const useGameIFrameAPI = (wrapperRef: React.RefObject<any>) => {
  return {
    initializeGame: (config: any) => wrapperRef.current?.initializeGame(config),
    sendAction: (action: string, data: any) => wrapperRef.current?.sendAction(action, data),
    requestGameState: () => wrapperRef.current?.requestGameState(),
    pauseGame: () => wrapperRef.current?.pauseGame(),
    resumeGame: () => wrapperRef.current?.resumeGame(),
    endGame: () => wrapperRef.current?.endGame()
  };
};
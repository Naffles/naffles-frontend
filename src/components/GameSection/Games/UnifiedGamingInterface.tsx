import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedBettingInterface } from './UnifiedBettingInterface';
import { PlayerInfoDisplay } from './PlayerInfoDisplay';
import { GameIFrameWrapper } from './GameIFrameWrapper';
import { gameIFrameComm, GameMessage, BetConfirmationData, GameStateData, GameResultData } from '@services/gameIFrameComm';

interface TokenBalance {
  symbol: string;
  balance: string;
  usdValue?: string;
  icon?: string;
  chainId?: string;
  contractAddress?: string;
}

interface PlayerData {
  id: string;
  name: string;
  avatar?: string;
  balances: TokenBalance[];
  pointsBalance: number;
}

interface UnifiedGamingInterfaceProps {
  gameType: 'blackjack' | 'coin-toss' | 'rps';
  player: PlayerData;
  onBetPlaced?: (betAmount: string, tokenType: string) => Promise<void>;
  onGameCompleted?: (result: GameResultData) => void;
  onBalanceUpdate?: (newBalances: TokenBalance[]) => void;
  isPointsMode?: boolean;
  minBetAmount?: string;
  maxBetAmount?: string;
  autoStart?: boolean;
  theme?: string;
  className?: string;
}

interface GameSession {
  sessionId: string;
  gameType: string;
  betAmount: string;
  tokenType: string;
  startTime: Date;
  status: 'active' | 'completed' | 'error';
}

export const UnifiedGamingInterface: React.FC<UnifiedGamingInterfaceProps> = ({
  gameType,
  player,
  onBetPlaced,
  onGameCompleted,
  onBalanceUpdate,
  isPointsMode = false,
  minBetAmount = "0.001",
  maxBetAmount = "10",
  autoStart = false,
  theme = "dark",
  className = ""
}) => {
  // State management
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'ready' | 'playing' | 'completed' | 'error'>('idle');
  const [lastBetAmount, setLastBetAmount] = useState<string>("");
  const [lastTokenType, setLastTokenType] = useState<string>("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [showDetailedBalances, setShowDetailedBalances] = useState(false);
  const [balanceUpdateCount, setBalanceUpdateCount] = useState(0);

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gameWrapperRef = useRef<any>(null);

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Handle bet placement
  const handleBetPlaced = useCallback(async (betAmount: string, tokenType: string) => {
    setIsPlacingBet(true);
    setGameError(null);

    try {
      // Create new game session
      const sessionId = generateSessionId();
      const newSession: GameSession = {
        sessionId,
        gameType,
        betAmount,
        tokenType,
        startTime: new Date(),
        status: 'active'
      };

      setGameSession(newSession);
      setLastBetAmount(betAmount);
      setLastTokenType(tokenType);
      setGameState('loading');

      // Call external bet handler if provided
      if (onBetPlaced) {
        await onBetPlaced(betAmount, tokenType);
      }

      // Send bet confirmation to game iframe
      if (iframeRef.current) {
        const betData: BetConfirmationData = {
          betAmount,
          tokenType,
          gameType,
          sessionId,
          playerId: player.id
        };
        
        gameIFrameComm.sendBetConfirmation(iframeRef.current, betData);
      }

      setGameState('ready');
    } catch (error) {
      console.error('Error placing bet:', error);
      setGameError(error instanceof Error ? error.message : 'Failed to place bet');
      setGameState('error');
    } finally {
      setIsPlacingBet(false);
    }
  }, [gameType, player.id, onBetPlaced, generateSessionId]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (lastBetAmount && lastTokenType) {
      handleBetPlaced(lastBetAmount, lastTokenType);
    }
  }, [lastBetAmount, lastTokenType, handleBetPlaced]);

  // Setup iframe communication handlers
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Game ready handler
    unsubscribers.push(
      gameIFrameComm.onMessage('GAME_READY', (message: GameMessage) => {
        console.log('Game ready:', message.payload);
        if (gameState === 'loading') {
          setGameState('ready');
        }
      })
    );

    // Game state change handler
    unsubscribers.push(
      gameIFrameComm.onMessage('GAME_STATE_CHANGED', (message: GameMessage) => {
        const stateData: GameStateData = message.payload;
        console.log('Game state changed:', stateData);
        
        if (stateData.state === 'playing') {
          setGameState('playing');
        } else if (stateData.state === 'completed') {
          setGameState('completed');
          if (gameSession) {
            setGameSession({ ...gameSession, status: 'completed' });
          }
        } else if (stateData.state === 'error') {
          setGameState('error');
          setGameError('Game encountered an error');
        }
      })
    );

    // Game completed handler
    unsubscribers.push(
      gameIFrameComm.onMessage('GAME_COMPLETED', (message: GameMessage) => {
        const resultData: GameResultData = message.payload;
        console.log('Game completed:', resultData);
        
        setGameState('completed');
        if (gameSession) {
          setGameSession({ ...gameSession, status: 'completed' });
        }

        // Update balances based on result
        if (resultData.result === 'win' && resultData.winAmount) {
          // Simulate balance update (in real app, this would come from backend)
          const updatedBalances = player.balances.map(balance => {
            if (balance.symbol === lastTokenType) {
              const currentBalance = parseFloat(balance.balance);
              const winAmount = parseFloat(resultData.winAmount || '0');
              return {
                ...balance,
                balance: (currentBalance + winAmount).toString()
              };
            }
            return balance;
          });
          
          if (onBalanceUpdate) {
            onBalanceUpdate(updatedBalances);
          }
          setBalanceUpdateCount(prev => prev + 1);
        } else if (resultData.result === 'lose') {
          // Deduct bet amount from balance
          const updatedBalances = player.balances.map(balance => {
            if (balance.symbol === lastTokenType) {
              const currentBalance = parseFloat(balance.balance);
              const betAmount = parseFloat(lastBetAmount);
              return {
                ...balance,
                balance: Math.max(0, currentBalance - betAmount).toString()
              };
            }
            return balance;
          });
          
          if (onBalanceUpdate) {
            onBalanceUpdate(updatedBalances);
          }
          setBalanceUpdateCount(prev => prev + 1);
        }

        // Call external completion handler
        if (onGameCompleted) {
          onGameCompleted(resultData);
        }
      })
    );

    // Game error handler
    unsubscribers.push(
      gameIFrameComm.onMessage('GAME_ERROR', (message: GameMessage) => {
        console.error('Game error:', message.payload);
        setGameState('error');
        setGameError(message.payload.error || 'Unknown game error');
        if (gameSession) {
          setGameSession({ ...gameSession, status: 'error' });
        }
      })
    );

    // Bet request handler (from game)
    unsubscribers.push(
      gameIFrameComm.onMessage('BET_REQUESTED', (message: GameMessage) => {
        console.log('Bet requested by game:', message.payload);
        // Game is requesting a bet - could show betting interface or auto-bet
      })
    );

    // Resize request handler
    unsubscribers.push(
      gameIFrameComm.onMessage('RESIZE_REQUEST', (message: GameMessage) => {
        console.log('Resize requested:', message.payload);
        // Handle iframe resize if needed
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [gameState, gameSession, player.balances, lastTokenType, lastBetAmount, onBalanceUpdate, onGameCompleted]);

  // Reset game state
  const resetGame = useCallback(() => {
    setGameSession(null);
    setGameState('idle');
    setGameError(null);
    setIsPlacingBet(false);
  }, []);

  // Get available tokens (filter out zero balances for betting)
  const getAvailableTokens = useCallback(() => {
    return player.balances.filter(balance => parseFloat(balance.balance) > 0);
  }, [player.balances]);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Player Information */}
      <PlayerInfoDisplay
        playerName={player.name}
        playerAvatar={player.avatar}
        balances={player.balances}
        currentTokenType={lastTokenType}
        isPointsMode={isPointsMode}
        totalPointsBalance={player.pointsBalance}
        isLoading={balanceUpdateCount > 0}
        showDetailedBalances={showDetailedBalances}
        className="mb-4"
      />

      {/* Game Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Betting Interface */}
        <div className="lg:col-span-1 space-y-4">
          <UnifiedBettingInterface
            availableTokens={getAvailableTokens()}
            onBetPlaced={handleBetPlaced}
            onPlayAgain={gameState === 'completed' ? handlePlayAgain : undefined}
            isGameActive={gameState === 'playing'}
            isGameCompleted={gameState === 'completed'}
            isLoading={isPlacingBet}
            minBetAmount={minBetAmount}
            maxBetAmount={maxBetAmount}
            lastBetAmount={lastBetAmount}
            lastTokenType={lastTokenType}
            disabled={gameState === 'error'}
          />

          {/* Game Session Info */}
          {gameSession && (
            <div className="bg-nafl-grey-800 rounded-lg p-4 border border-nafl-grey-700">
              <h4 className="text-sm font-bold text-nafl-white mb-2">Current Session</h4>
              <div className="space-y-1 text-xs text-nafl-grey-400">
                <div>ID: {gameSession.sessionId.slice(-8)}</div>
                <div>Bet: {gameSession.betAmount} {gameSession.tokenType}</div>
                <div>Status: <span className={`font-bold ${
                  gameSession.status === 'active' ? 'text-green-500' :
                  gameSession.status === 'completed' ? 'text-blue-500' :
                  'text-red-500'
                }`}>{gameSession.status.toUpperCase()}</span></div>
                <div>Started: {gameSession.startTime.toLocaleTimeString()}</div>
              </div>
            </div>
          )}

          {/* Balance Controls */}
          <div className="bg-nafl-grey-800 rounded-lg p-4 border border-nafl-grey-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-nafl-white">Balance View</h4>
              <button
                onClick={() => setShowDetailedBalances(!showDetailedBalances)}
                className="text-xs text-nafl-aqua-500 hover:text-nafl-aqua-400"
              >
                {showDetailedBalances ? 'Hide' : 'Show'} All
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-nafl-grey-400">
              <span>Mode: {isPointsMode ? 'Points' : 'Tokens'}</span>
              <span>Updates: {balanceUpdateCount}</span>
            </div>
          </div>
        </div>

        {/* Game Display */}
        <div className="lg:col-span-2">
          {gameState === 'idle' ? (
            <div className="bg-nafl-grey-800 rounded-lg p-8 border border-nafl-grey-700 text-center">
              <div className="text-6xl mb-4">
                {gameType === 'blackjack' ? '🃏' : gameType === 'coin-toss' ? '🪙' : '✊'}
              </div>
              <h3 className="text-2xl font-bold text-nafl-white mb-2 capitalize">
                {gameType.replace('-', ' ')}
              </h3>
              <p className="text-nafl-grey-400 mb-6">
                Place a bet to start playing
              </p>
              <div className="text-sm text-nafl-grey-500">
                Min bet: {minBetAmount} • Max bet: {maxBetAmount}
              </div>
            </div>
          ) : (
            <div className="relative">
              <GameIFrameWrapper
                ref={gameWrapperRef}
                gameType={gameType}
                sessionId={gameSession?.sessionId}
                tokenType={lastTokenType}
                betAmount={lastBetAmount}
                theme={theme}
                autoStart={autoStart}
                onGameInitialized={(data) => console.log('Game initialized:', data)}
                onGameStateChanged={(data) => console.log('Game state changed:', data)}
                onGameCompleted={(data) => console.log('Game completed:', data)}
                onGameError={(error) => console.error('Game error:', error)}
                className="min-h-[500px]"
              />

              {/* Game State Overlay */}
              <AnimatePresence>
                {gameState === 'loading' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-nafl-grey-900/80 flex items-center justify-center rounded-lg z-10"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-nafl-aqua-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <div className="text-nafl-white text-lg font-bold">
                        Initializing Game...
                      </div>
                      <div className="text-nafl-grey-400 text-sm mt-2">
                        Bet: {lastBetAmount} {lastTokenType}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {gameState === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-900/80 flex items-center justify-center rounded-lg z-10"
                  >
                    <div className="text-center max-w-md">
                      <div className="text-6xl mb-4">⚠️</div>
                      <div className="text-white text-lg font-bold mb-2">
                        Game Error
                      </div>
                      <div className="text-red-200 text-sm mb-4">
                        {gameError || 'An unknown error occurred'}
                      </div>
                      <button
                        onClick={resetGame}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                      >
                        Reset Game
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-nafl-grey-800 rounded-lg p-4 border border-nafl-grey-700">
          <h4 className="text-sm font-bold text-nafl-white mb-2">Debug Info</h4>
          <div className="text-xs text-nafl-grey-400 space-y-1">
            <div>Game State: {gameState}</div>
            <div>Session: {gameSession?.sessionId || 'None'}</div>
            <div>Last Bet: {lastBetAmount} {lastTokenType}</div>
            <div>Balance Updates: {balanceUpdateCount}</div>
            <div>Communication: {gameIFrameComm.getConnectionStatus().messageCount} messages</div>
          </div>
        </div>
      )}
    </div>
  );
};
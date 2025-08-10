"use client";

import React, { useEffect, useState } from 'react';
import { BlackjackGame } from '@components/GameSection/Games/BlackjackGame';
import { useSearchParams } from 'next/navigation';
import { gameIFrameComm, GameMessage, BetConfirmationData } from '@services/gameIFrameComm';

export default function BlackjackIFramePage() {
  const searchParams = useSearchParams();
  const [gameConfig, setGameConfig] = useState({
    sessionId: searchParams.get('sessionId'),
    tokenType: searchParams.get('tokenType'),
    betAmount: searchParams.get('betAmount'),
    theme: searchParams.get('theme') || 'default',
    autoStart: searchParams.get('autoStart') === 'true'
  });
  const [isParentReady, setIsParentReady] = useState(false);
  const [betData, setBetData] = useState<BetConfirmationData | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Setup iframe communication
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Parent ready handler
    unsubscribers.push(
      gameIFrameComm.onMessage('PARENT_READY', (message: GameMessage) => {
        setIsParentReady(true);
        gameIFrameComm.notifyGameReady('blackjack', gameConfig);
      })
    );

    // Bet confirmation handler
    unsubscribers.push(
      gameIFrameComm.onMessage('BET_CONFIRMED', (message: GameMessage) => {
        const betConfirmation: BetConfirmationData = message.payload;
        setBetData(betConfirmation);
        setGameConfig(prev => ({
          ...prev,
          sessionId: betConfirmation.sessionId || null,
          tokenType: betConfirmation.tokenType || null,
          betAmount: betConfirmation.betAmount || null
        }));
        
        gameIFrameComm.notifyGameStateChange({
          state: 'ready',
          gameType: 'blackjack',
          sessionId: betConfirmation.sessionId
        });
      })
    );

    // Initialize game handler
    unsubscribers.push(
      gameIFrameComm.onMessage('INITIALIZE_GAME', (message: GameMessage) => {
        setGameStarted(true);
        gameIFrameComm.notifyGameStateChange({
          state: 'playing',
          gameType: 'blackjack',
          sessionId: gameConfig.sessionId
        });
      })
    );

    // Game action handler
    unsubscribers.push(
      gameIFrameComm.onMessage('GAME_ACTION', (message: GameMessage) => {
        console.log('Game action received:', message.payload);
        // Handle specific game actions if needed
      })
    );

    // Pause/Resume handlers
    unsubscribers.push(
      gameIFrameComm.onMessage('PAUSE_GAME', (message: GameMessage) => {
        gameIFrameComm.notifyGameStateChange({
          state: 'paused',
          gameType: 'blackjack',
          sessionId: gameConfig.sessionId
        });
      })
    );

    unsubscribers.push(
      gameIFrameComm.onMessage('RESUME_GAME', (message: GameMessage) => {
        gameIFrameComm.notifyGameStateChange({
          state: 'playing',
          gameType: 'blackjack',
          sessionId: gameConfig.sessionId
        });
      })
    );

    // End game handler
    unsubscribers.push(
      gameIFrameComm.onMessage('END_GAME', (message: GameMessage) => {
        gameIFrameComm.notifyGameCompleted({
          result: 'draw', // Default result when ended by parent
          gameType: 'blackjack',
          sessionId: gameConfig.sessionId
        });
      })
    );

    // Request game state handler
    unsubscribers.push(
      gameIFrameComm.onMessage('REQUEST_GAME_STATE', (message: GameMessage) => {
        gameIFrameComm.notifyGameStateChange({
          state: gameStarted ? 'playing' : 'ready',
          gameType: 'blackjack',
          sessionId: gameConfig.sessionId
        });
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [gameConfig, gameStarted]);

  // Initialize communication on mount
  useEffect(() => {
    gameIFrameComm.notifyGameReady('blackjack', gameConfig);
  }, []);

  // Game event handlers
  const handleGameStart = (choice?: string) => {
    setGameStarted(true);
    gameIFrameComm.notifyGameStateChange({
      state: 'playing',
      gameType: 'blackjack',
      sessionId: gameConfig.sessionId,
      data: { action: 'game_started', choice }
    });
  };

  const handleGameReset = () => {
    setGameStarted(false);
    gameIFrameComm.notifyGameStateChange({
      state: 'ready',
      gameType: 'blackjack',
      sessionId: gameConfig.sessionId,
      data: { action: 'game_reset' }
    });
  };

  const handleGameCompleted = (result: string) => {
    setGameStarted(false);
    
    // Determine win amount based on result and bet
    let winAmount = '0';
    if (result === 'win') {
      winAmount = betData?.betAmount ? (parseFloat(betData.betAmount) * 2).toString() : '0';
    } else if (result === 'blackjack') {
      winAmount = betData?.betAmount ? (parseFloat(betData.betAmount) * 2.5).toString() : '0';
    }

    gameIFrameComm.notifyGameCompleted({
      result: result === 'win' || result === 'blackjack' ? 'win' : 
             result === 'lose' ? 'lose' : 'draw',
      gameType: 'blackjack',
      sessionId: gameConfig.sessionId,
      winAmount,
      details: { originalResult: result }
    });
  };

  const handleGameError = () => {
    gameIFrameComm.notifyGameError('Game encountered an error', {
      gameType: 'blackjack',
      sessionId: gameConfig.sessionId
    });
  };

  const handleLimitReached = () => {
    gameIFrameComm.notifyGameError('Rate limit reached', {
      gameType: 'blackjack',
      sessionId: gameConfig.sessionId
    });
  };

  return (
    <div className="min-h-screen bg-nafl-grey-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-nafl-white mb-2">
            Naffles Blackjack
          </h1>
          {gameConfig.sessionId && (
            <div className="text-nafl-grey-400 text-sm">
              Session: {gameConfig.sessionId}
            </div>
          )}
        </div>

        {/* Bet Information */}
        {betData && (
          <div className="bg-nafl-grey-800 rounded-lg p-4 mb-4 border border-nafl-grey-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-nafl-grey-400">Current Bet:</span>
              <span className="text-nafl-white font-bold">
                {betData.betAmount} {betData.tokenType}
              </span>
            </div>
          </div>
        )}

        {/* Game Component */}
        {betData ? (
          <BlackjackGame
            onGameStart={handleGameStart}
            onGameReset={handleGameReset}
            callGameResultModal={handleGameCompleted}
            onLimitReached={handleLimitReached}
            isPaused={false}
            resetToInitial={false}
          />
        ) : (
          <div className="bg-nafl-grey-800 rounded-lg p-8 text-center border border-nafl-grey-700">
            <div className="text-6xl mb-4">🃏</div>
            <h2 className="text-2xl font-bold text-nafl-white mb-2">
              Waiting for Bet
            </h2>
            <p className="text-nafl-grey-400">
              Place a bet using the betting interface to start playing
            </p>
          </div>
        )}

        {/* IFrame Footer */}
        <div className="mt-6 text-center text-nafl-grey-500 text-xs">
          <div>Powered by Naffles Gaming Platform</div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2">
              Config: {JSON.stringify(gameConfig, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
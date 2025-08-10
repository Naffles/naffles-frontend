"use client";

import React, { useEffect, useState } from 'react';
import { RockPaperScissorsGame } from '@components/GameSection/Games/RockPaperScissorsGame';
import { useSearchParams } from 'next/navigation';

interface IFrameGameMessage {
  type: string;
  payload: any;
  source?: string;
}

export default function RPSIFramePage() {
  const searchParams = useSearchParams();
  const [gameConfig, setGameConfig] = useState({
    sessionId: searchParams.get('sessionId'),
    tokenType: searchParams.get('tokenType'),
    betAmount: searchParams.get('betAmount'),
    theme: searchParams.get('theme') || 'default',
    autoStart: searchParams.get('autoStart') === 'true'
  });
  const [isParentReady, setIsParentReady] = useState(false);

  // Send message to parent window
  const sendMessageToParent = (type: string, payload: any) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type,
        payload,
        source: 'game'
      }, '*');
    }
  };

  // Handle messages from parent
  const handleParentMessage = (event: MessageEvent<IFrameGameMessage>) => {
    const { type, payload, source } = event.data;
    
    if (source !== 'parent') return;

    switch (type) {
      case 'PARENT_READY':
        setIsParentReady(true);
        sendMessageToParent('GAME_READY', { gameType: 'rps' });
        break;

      case 'INITIALIZE_GAME':
        sendMessageToParent('GAME_INITIALIZED', { 
          gameType: 'rps',
          config: payload 
        });
        break;

      case 'GAME_ACTION':
        console.log('Game action received:', payload);
        break;

      case 'PAUSE_GAME':
        sendMessageToParent('GAME_STATE_CHANGED', { 
          state: 'paused',
          gameType: 'rps' 
        });
        break;

      case 'RESUME_GAME':
        sendMessageToParent('GAME_STATE_CHANGED', { 
          state: 'playing',
          gameType: 'rps' 
        });
        break;

      case 'END_GAME':
        sendMessageToParent('GAME_COMPLETED', { 
          gameType: 'rps',
          reason: 'ended_by_parent' 
        });
        break;

      case 'REQUEST_GAME_STATE':
        sendMessageToParent('GAME_STATE_CHANGED', { 
          state: 'playing',
          gameType: 'rps' 
        });
        break;

      default:
        console.log('Unknown message type from parent:', type);
    }
  };

  // Initialize iframe communication
  useEffect(() => {
    window.addEventListener('message', handleParentMessage);
    
    // Notify parent that game is ready
    sendMessageToParent('GAME_READY', { gameType: 'rps' });

    return () => {
      window.removeEventListener('message', handleParentMessage);
    };
  }, []);

  // Game event handlers
  const handleGameStart = (choice?: string) => {
    sendMessageToParent('GAME_STATE_CHANGED', { 
      state: 'playing',
      gameType: 'rps',
      action: 'game_started',
      choice 
    });
  };

  const handleGameReset = () => {
    sendMessageToParent('GAME_STATE_CHANGED', { 
      state: 'ready',
      gameType: 'rps',
      action: 'game_reset' 
    });
  };

  const handleGameCompleted = (result: string) => {
    sendMessageToParent('GAME_COMPLETED', { 
      gameType: 'rps',
      result,
      sessionId: gameConfig.sessionId 
    });
  };

  const handleLimitReached = () => {
    sendMessageToParent('GAME_ERROR', { 
      gameType: 'rps',
      error: 'Rate limit reached' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nafl-grey-800 via-nafl-grey-700 to-nafl-grey-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-nafl-white mb-2">
            Naffles Rock Paper Scissors
          </h1>
          {gameConfig.sessionId && (
            <div className="text-nafl-grey-400 text-sm">
              Session: {gameConfig.sessionId}
            </div>
          )}
        </div>

        {/* Game Component */}
        <RockPaperScissorsGame
          onGameStart={handleGameStart}
          onGameReset={handleGameReset}
          callGameResultModal={handleGameCompleted}
          onLimitReached={handleLimitReached}
          isPaused={false}
          resetToInitial={false}
        />

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
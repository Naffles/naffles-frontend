import React, { useRef, useState } from 'react';
import { GameIFrameWrapper, useGameIFrameAPI } from './GameIFrameWrapper';

interface GameEmbedExampleProps {
  gameType: 'blackjack' | 'coin-toss' | 'rps';
  sessionId?: string;
  tokenType?: string;
  betAmount?: string;
}

export const GameEmbedExample: React.FC<GameEmbedExampleProps> = ({
  gameType,
  sessionId,
  tokenType,
  betAmount
}) => {
  const gameRef = useRef(null);
  const gameAPI = useGameIFrameAPI(gameRef);
  const [gameEvents, setGameEvents] = useState<any[]>([]);
  const [gameState, setGameState] = useState<string>('loading');

  // Add event to log
  const addEvent = (event: string, data: any) => {
    setGameEvents(prev => [...prev.slice(-9), { 
      timestamp: new Date().toLocaleTimeString(),
      event,
      data
    }]);
  };

  // Game event handlers
  const handleGameInitialized = (data: any) => {
    addEvent('Game Initialized', data);
    setGameState('ready');
  };

  const handleGameStateChanged = (data: any) => {
    addEvent('State Changed', data);
    if (data.state) {
      setGameState(data.state);
    }
  };

  const handleGameCompleted = (data: any) => {
    addEvent('Game Completed', data);
    setGameState('completed');
  };

  const handleGameError = (error: any) => {
    addEvent('Game Error', error);
    setGameState('error');
  };

  const handleResize = (dimensions: { width: number; height: number }) => {
    addEvent('Resize Request', dimensions);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Embed */}
        <div className="lg:col-span-2">
          <div className="bg-nafl-grey-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-nafl-white mb-4 capitalize">
              {gameType.replace('-', ' ')} Game Embed
            </h2>
            
            <GameIFrameWrapper
              ref={gameRef}
              gameType={gameType}
              sessionId={sessionId}
              tokenType={tokenType}
              betAmount={betAmount}
              theme="dark"
              autoStart={false}
              onGameInitialized={handleGameInitialized}
              onGameStateChanged={handleGameStateChanged}
              onGameCompleted={handleGameCompleted}
              onGameError={handleGameError}
              onResize={handleResize}
              className="mb-4"
            />

            {/* Game Controls */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => gameAPI.initializeGame({ autoStart: true })}
                className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 text-white px-4 py-2 rounded text-sm"
                disabled={gameState !== 'ready'}
              >
                Start Game
              </button>
              
              <button
                onClick={() => gameAPI.pauseGame()}
                className="bg-nafl-grey-600 hover:bg-nafl-grey-500 text-white px-4 py-2 rounded text-sm"
                disabled={gameState !== 'playing'}
              >
                Pause
              </button>
              
              <button
                onClick={() => gameAPI.resumeGame()}
                className="bg-nafl-grey-600 hover:bg-nafl-grey-500 text-white px-4 py-2 rounded text-sm"
                disabled={gameState !== 'paused'}
              >
                Resume
              </button>
              
              <button
                onClick={() => gameAPI.requestGameState()}
                className="bg-nafl-purple hover:bg-opacity-80 text-white px-4 py-2 rounded text-sm"
              >
                Get State
              </button>
              
              <button
                onClick={() => gameAPI.endGame()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                disabled={gameState === 'completed' || gameState === 'error'}
              >
                End Game
              </button>
            </div>
          </div>
        </div>

        {/* Event Log & Info */}
        <div className="space-y-4">
          {/* Game Status */}
          <div className="bg-nafl-grey-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-nafl-white mb-2">Game Status</h3>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
              gameState === 'loading' ? 'bg-yellow-500 text-black' :
              gameState === 'ready' ? 'bg-nafl-aqua-500 text-white' :
              gameState === 'playing' ? 'bg-green-500 text-white' :
              gameState === 'paused' ? 'bg-orange-500 text-white' :
              gameState === 'completed' ? 'bg-blue-500 text-white' :
              gameState === 'error' ? 'bg-red-500 text-white' :
              'bg-nafl-grey-600 text-white'
            }`}>
              {gameState.toUpperCase()}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-nafl-grey-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-nafl-white mb-2">Game Info</h3>
            <div className="text-nafl-grey-300 text-sm space-y-1">
              <div><strong>Type:</strong> {gameType}</div>
              {sessionId && <div><strong>Session:</strong> {sessionId}</div>}
              {tokenType && <div><strong>Token:</strong> {tokenType}</div>}
              {betAmount && <div><strong>Bet:</strong> {betAmount}</div>}
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-nafl-grey-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-nafl-white mb-2">Event Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {gameEvents.length === 0 ? (
                <div className="text-nafl-grey-400 text-sm">No events yet...</div>
              ) : (
                gameEvents.map((event, index) => (
                  <div key={index} className="text-xs">
                    <div className="text-nafl-grey-400">{event.timestamp}</div>
                    <div className="text-nafl-white font-bold">{event.event}</div>
                    <div className="text-nafl-grey-300 ml-2">
                      {JSON.stringify(event.data, null, 2)}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {gameEvents.length > 0 && (
              <button
                onClick={() => setGameEvents([])}
                className="mt-2 text-nafl-grey-400 hover:text-nafl-white text-xs"
              >
                Clear Log
              </button>
            )}
          </div>

          {/* Embed Code */}
          <div className="bg-nafl-grey-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-nafl-white mb-2">Embed Code</h3>
            <textarea
              readOnly
              className="w-full h-32 bg-nafl-grey-700 text-nafl-white text-xs p-2 rounded border border-nafl-grey-600"
              value={`<iframe 
  src="${window.location.origin}/games/iframe/${gameType}${sessionId ? `?sessionId=${sessionId}` : ''}"
  width="800"
  height="600"
  frameborder="0"
  allowfullscreen
  title="Naffles ${gameType} Game"
></iframe>`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
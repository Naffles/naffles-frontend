import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlackjackGame } from './BlackjackGame';
import { CoinTossGame } from './CoinTossGame';
import { RockPaperScissorsGame } from './RockPaperScissorsGame';
import { ResponsiveGameContainer } from './ResponsiveGameContainer';
import { GameLoadingScreen } from './GameLoadingScreen';
import { GameIFrameWrapper } from './GameIFrameWrapper';
import { GameEmbedExample } from './GameEmbedExample';
import { useGameResponsive } from '@hooks/useGameResponsive';
import { useGameAssets } from '@utils/gameAssetManager';
import { BLACKJACK_ASSETS, COIN_TOSS_ASSETS, RPS_ASSETS } from '@utils/gameAssetPreloader';

type GameType = 'blackjack' | 'coin-toss' | 'rps';
type ViewMode = 'standalone' | 'responsive' | 'iframe' | 'embed-demo';

interface GameShowcaseProps {
  initialGame?: GameType;
  initialMode?: ViewMode;
}

export const GameShowcase: React.FC<GameShowcaseProps> = ({
  initialGame = 'blackjack',
  initialMode = 'standalone'
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>(initialGame);
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [isLoading, setIsLoading] = useState(true);
  const [gameResults, setGameResults] = useState<any[]>([]);
  
  const { breakpoints, config } = useGameResponsive();
  const { isLoading: assetsLoading, loadingProgress, error: assetError } = useGameAssets(selectedGame);

  const games = [
    { id: 'blackjack' as GameType, name: 'Blackjack', icon: '🃏', color: 'bg-green-600' },
    { id: 'coin-toss' as GameType, name: 'Coin Toss', icon: '🪙', color: 'bg-purple-600' },
    { id: 'rps' as GameType, name: 'Rock Paper Scissors', icon: '✊', color: 'bg-blue-600' }
  ];

  const viewModes = [
    { id: 'standalone' as ViewMode, name: 'Standalone', icon: '🎮' },
    { id: 'responsive' as ViewMode, name: 'Responsive', icon: '📱' },
    { id: 'iframe' as ViewMode, name: 'iFrame', icon: '🖼️' },
    { id: 'embed-demo' as ViewMode, name: 'Embed Demo', icon: '🔗' }
  ];

  const getAssetConfig = (gameType: GameType) => {
    const configs = {
      'blackjack': BLACKJACK_ASSETS,
      'coin-toss': COIN_TOSS_ASSETS,
      'rps': RPS_ASSETS
    };
    return configs[gameType];
  };

  const handleGameResult = (result: string) => {
    setGameResults(prev => [...prev.slice(-4), {
      game: selectedGame,
      result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleLimitReached = () => {
    alert('Rate limit reached. Please wait before playing again.');
  };

  const renderGameComponent = () => {
    const gameProps = {
      onGameStart: () => console.log(`${selectedGame} started`),
      onGameReset: () => console.log(`${selectedGame} reset`),
      callGameResultModal: handleGameResult,
      onLimitReached: handleLimitReached,
      isPaused: false,
      resetToInitial: false
    };

    switch (selectedGame) {
      case 'blackjack':
        return <BlackjackGame {...gameProps} />;
      case 'coin-toss':
        return <CoinTossGame {...gameProps} />;
      case 'rps':
        return <RockPaperScissorsGame {...gameProps} />;
      default:
        return null;
    }
  };

  const renderGameView = () => {
    switch (viewMode) {
      case 'standalone':
        return (
          <div className="p-6">
            {renderGameComponent()}
          </div>
        );

      case 'responsive':
        return (
          <ResponsiveGameContainer
            gameType={selectedGame}
            assetConfig={getAssetConfig(selectedGame)}
            showLoadingScreen={true}
          >
            {renderGameComponent()}
          </ResponsiveGameContainer>
        );

      case 'iframe':
        return (
          <div className="p-6">
            <GameIFrameWrapper
              gameType={selectedGame}
              sessionId="demo-session-123"
              tokenType="ETH"
              betAmount="0.01"
              theme="dark"
              autoStart={false}
              onGameInitialized={(data) => console.log('Game initialized:', data)}
              onGameStateChanged={(data) => console.log('State changed:', data)}
              onGameCompleted={handleGameResult}
              onGameError={(error) => console.error('Game error:', error)}
            />
          </div>
        );

      case 'embed-demo':
        return (
          <GameEmbedExample
            gameType={selectedGame}
            sessionId="demo-session-456"
            tokenType="BTC"
            betAmount="0.001"
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <GameLoadingScreen
        gameType={selectedGame}
        onLoadingComplete={() => setIsLoading(false)}
        showProgress={true}
        showTips={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-nafl-grey-900 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-nafl-white mb-2">
            Naffles Game Showcase
          </h1>
          <p className="text-nafl-grey-400">
            Interactive demo of all game components and features
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Game Selection */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Select Game</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGame === game.id
                      ? `${game.color} border-nafl-sponge-500 text-white`
                      : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{game.icon}</div>
                  <div className="font-bold text-sm">{game.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Selection */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">View Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    viewMode === mode.id
                      ? 'bg-nafl-aqua-500 border-nafl-aqua-400 text-white'
                      : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                  }`}
                >
                  <div className="text-lg mb-1">{mode.icon}</div>
                  <div className="font-bold text-xs">{mode.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Display */}
        <div className="bg-nafl-grey-800 rounded-lg overflow-hidden mb-8">
          <div className="bg-nafl-grey-700 px-6 py-3 border-b border-nafl-grey-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-nafl-white capitalize">
                {selectedGame.replace('-', ' ')} - {viewModes.find(m => m.id === viewMode)?.name}
              </h2>
              
              {/* Device Info */}
              <div className="text-sm text-nafl-grey-400">
                {breakpoints.mobile ? '📱 Mobile' : breakpoints.tablet ? '📱 Tablet' : '🖥️ Desktop'} |
                {config.animationComplexity} animations |
                {breakpoints.prefersReducedMotion ? 'Reduced motion' : 'Full motion'}
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedGame}-${viewMode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderGameView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Results */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Recent Results</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gameResults.length === 0 ? (
                <div className="text-nafl-grey-400 text-sm">No games played yet</div>
              ) : (
                gameResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-nafl-grey-300 capitalize">
                      {result.game.replace('-', ' ')}
                    </span>
                    <span className={`font-bold ${
                      result.result === 'win' ? 'text-green-500' :
                      result.result === 'lose' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {result.result.toUpperCase()}
                    </span>
                    <span className="text-nafl-grey-500 text-xs">
                      {result.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Asset Loading Info */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Asset Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nafl-grey-300">Loading:</span>
                <span className={assetsLoading ? 'text-yellow-500' : 'text-green-500'}>
                  {assetsLoading ? 'In Progress' : 'Complete'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-300">Progress:</span>
                <span className="text-nafl-white">{loadingProgress}%</span>
              </div>
              {assetError && (
                <div className="text-red-500 text-xs">
                  Error: {assetError}
                </div>
              )}
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Technical Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nafl-grey-300">Screen:</span>
                <span className="text-nafl-white">
                  {window.innerWidth}x{window.innerHeight}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-300">Touch:</span>
                <span className="text-nafl-white">
                  {breakpoints.isTouchDevice ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-300">Performance:</span>
                <span className="text-nafl-white">
                  {breakpoints.isLowPowerMode ? 'Low Power' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
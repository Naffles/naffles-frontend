"use client";

import React, { useState } from 'react';
import { UnifiedGamingInterface } from '@components/GameSection/Games/UnifiedGamingInterface';
import { GameResultData } from '@services/gameIFrameComm';

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

export default function UnifiedGamingDemoPage() {
  const [selectedGame, setSelectedGame] = useState<'blackjack' | 'coin-toss' | 'rps'>('blackjack');
  const [isPointsMode, setIsPointsMode] = useState(false);
  const [gameResults, setGameResults] = useState<any[]>([]);
  
  // Mock player data
  const [playerData, setPlayerData] = useState<PlayerData>({
    id: 'player_123',
    name: 'Demo Player',
    avatar: undefined,
    balances: [
      {
        symbol: 'ETH',
        balance: '2.5',
        usdValue: '4250.00',
        icon: '⟠',
        chainId: 'ethereum',
        contractAddress: '0x...'
      },
      {
        symbol: 'BTC',
        balance: '0.15',
        usdValue: '6450.00',
        icon: '₿',
        chainId: 'bitcoin',
        contractAddress: '0x...'
      },
      {
        symbol: 'SOL',
        balance: '45.2',
        usdValue: '2260.00',
        icon: '◎',
        chainId: 'solana',
        contractAddress: '0x...'
      },
      {
        symbol: 'USDC',
        balance: '1000.0',
        usdValue: '1000.00',
        icon: '$',
        chainId: 'ethereum',
        contractAddress: '0x...'
      }
    ],
    pointsBalance: 15420
  });

  const games = [
    { id: 'blackjack' as const, name: 'Blackjack', icon: '🃏', color: 'bg-green-600' },
    { id: 'coin-toss' as const, name: 'Coin Toss', icon: '🪙', color: 'bg-purple-600' },
    { id: 'rps' as const, name: 'Rock Paper Scissors', icon: '✊', color: 'bg-blue-600' }
  ];

  // Handle bet placement
  const handleBetPlaced = async (betAmount: string, tokenType: string) => {
    console.log(`Bet placed: ${betAmount} ${tokenType} on ${selectedGame}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call the backend API
    // For demo, we'll just log it
    console.log('Bet processed successfully');
  };

  // Handle game completion
  const handleGameCompleted = (result: GameResultData) => {
    console.log('Game completed:', result);
    
    // Add to results history
    setGameResults(prev => [...prev.slice(-9), {
      game: selectedGame,
      result: result.result,
      winAmount: result.winAmount,
      timestamp: new Date().toLocaleTimeString(),
      details: result.details
    }]);
  };

  // Handle balance updates
  const handleBalanceUpdate = (newBalances: TokenBalance[]) => {
    setPlayerData(prev => ({
      ...prev,
      balances: newBalances
    }));
  };

  return (
    <div className="min-h-screen bg-nafl-grey-900 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-nafl-white mb-2">
            Unified Gaming Interface Demo
          </h1>
          <p className="text-nafl-grey-400">
            External betting controls with iframe game integration
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Game Selection */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Select Game</h3>
            <div className="space-y-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                    selectedGame === game.id
                      ? `${game.color} border-nafl-sponge-500 text-white`
                      : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                  }`}
                >
                  <div className="text-2xl">{game.icon}</div>
                  <div className="font-bold">{game.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Game Mode</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsPointsMode(false)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                  !isPointsMode
                    ? 'bg-nafl-aqua-500 border-nafl-aqua-400 text-white'
                    : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                }`}
              >
                <div className="text-2xl">💰</div>
                <div>
                  <div className="font-bold">Token Mode</div>
                  <div className="text-xs opacity-75">Bet with crypto tokens</div>
                </div>
              </button>
              
              <button
                onClick={() => setIsPointsMode(true)}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                  isPointsMode
                    ? 'bg-nafl-sponge-500 border-nafl-sponge-400 text-white'
                    : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                }`}
              >
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-bold">Points Mode</div>
                  <div className="text-xs opacity-75">Bet with platform points</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Recent Results</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gameResults.length === 0 ? (
                <div className="text-nafl-grey-400 text-sm">No games played yet</div>
              ) : (
                gameResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-nafl-grey-700 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {result.game === 'blackjack' ? '🃏' : 
                         result.game === 'coin-toss' ? '🪙' : '✊'}
                      </span>
                      <span className="text-nafl-grey-300 capitalize">
                        {result.game.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        result.result === 'win' ? 'text-green-500' :
                        result.result === 'lose' ? 'text-red-500' :
                        'text-yellow-500'
                      }`}>
                        {result.result.toUpperCase()}
                      </div>
                      {result.winAmount && result.result === 'win' && (
                        <div className="text-xs text-green-400">
                          +{result.winAmount}
                        </div>
                      )}
                      <div className="text-xs text-nafl-grey-500">
                        {result.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Unified Gaming Interface */}
        <div className="bg-nafl-grey-800 rounded-lg p-6 border border-nafl-grey-700">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-nafl-white capitalize">
              {selectedGame.replace('-', ' ')} - {isPointsMode ? 'Points Mode' : 'Token Mode'}
            </h2>
            <p className="text-nafl-grey-400 text-sm">
              Betting interface is external to the game iframe for unified control
            </p>
          </div>

          <UnifiedGamingInterface
            gameType={selectedGame}
            player={playerData}
            onBetPlaced={handleBetPlaced}
            onGameCompleted={handleGameCompleted}
            onBalanceUpdate={handleBalanceUpdate}
            isPointsMode={isPointsMode}
            minBetAmount="0.001"
            maxBetAmount="10"
            autoStart={false}
            theme="dark"
          />
        </div>

        {/* Technical Info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Features */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Features Demonstrated</h3>
            <div className="space-y-2 text-sm text-nafl-grey-300">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>External betting interface outside iframe</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Token selection with balance display</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Play Again functionality with bet retention</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Player information display</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Real-time balance updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Secure iframe communication</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Bet validation and error handling</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Game state synchronization</span>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="bg-nafl-grey-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-nafl-white mb-4">Player Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-nafl-grey-400">Total Balance (USD):</span>
                <span className="text-nafl-white font-bold">
                  ${playerData.balances.reduce((sum, b) => sum + parseFloat(b.usdValue || '0'), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-400">Available Tokens:</span>
                <span className="text-nafl-white font-bold">
                  {playerData.balances.filter(b => parseFloat(b.balance) > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-400">Points Balance:</span>
                <span className="text-nafl-white font-bold">
                  {playerData.pointsBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-400">Games Played:</span>
                <span className="text-nafl-white font-bold">
                  {gameResults.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nafl-grey-400">Win Rate:</span>
                <span className="text-nafl-white font-bold">
                  {gameResults.length > 0 
                    ? `${Math.round((gameResults.filter(r => r.result === 'win').length / gameResults.length) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
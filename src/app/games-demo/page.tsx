"use client";

import React, { useState } from 'react';
import { GameShowcase } from '@components/GameSection/Games/GameShowcase';
import { mockGameAPI } from '@utils/mockGameAPI';

export default function GamesDemoPage() {
  const [mockEnabled, setMockEnabled] = useState(mockGameAPI.isAPIEnabled());

  const toggleMockAPI = () => {
    if (mockEnabled) {
      mockGameAPI.disable();
    } else {
      mockGameAPI.enable();
    }
    setMockEnabled(!mockEnabled);
  };

  const resetRateLimit = () => {
    mockGameAPI.resetRateLimit();
    alert('Rate limit reset! You can play again.');
  };

  return (
    <div className="min-h-screen bg-nafl-grey-900">
      {/* Demo Controls */}
      <div className="bg-nafl-grey-800 border-b border-nafl-grey-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nafl-white">
              🎮 Naffles Games Demo
            </h1>
            <p className="text-nafl-grey-400 text-sm">
              Interactive demo with mock API (backend not required)
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mock API Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-nafl-grey-300 text-sm">Mock API:</span>
              <button
                onClick={toggleMockAPI}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                  mockEnabled 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {mockEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Rate Limit Reset */}
            <button
              onClick={resetRateLimit}
              className="px-3 py-1 bg-nafl-aqua-500 hover:bg-nafl-aqua-600 text-white rounded text-sm font-bold transition-colors"
            >
              Reset Rate Limit
            </button>

            {/* Demo Info */}
            <div className="text-nafl-grey-400 text-xs">
              <div>🎯 No backend required</div>
              <div>⚡ Simulated VRF responses</div>
              <div>🎲 Realistic game outcomes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Showcase */}
      <GameShowcase />

      {/* Demo Instructions */}
      <div className="bg-nafl-grey-800 border-t border-nafl-grey-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-nafl-white mb-4">
            🚀 Demo Instructions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-nafl-grey-700 rounded-lg p-4">
              <h3 className="font-bold text-nafl-white mb-2">🃏 Blackjack</h3>
              <ul className="text-nafl-grey-300 text-sm space-y-1">
                <li>• Click "Deal Cards" to start</li>
                <li>• Use Hit/Stand/Double/Split</li>
                <li>• Crypto-themed chips for betting</li>
                <li>• Realistic card animations</li>
              </ul>
            </div>

            <div className="bg-nafl-grey-700 rounded-lg p-4">
              <h3 className="font-bold text-nafl-white mb-2">🪙 Coin Toss</h3>
              <ul className="text-nafl-grey-300 text-sm space-y-1">
                <li>• Choose Heads (Pepe) or Tails (Bitcoin)</li>
                <li>• Watch coin fly to the moon</li>
                <li>• Twinkling stars background</li>
                <li>• Bouncing physics on landing</li>
              </ul>
            </div>

            <div className="bg-nafl-grey-700 rounded-lg p-4">
              <h3 className="font-bold text-nafl-white mb-2">✊ Rock Paper Scissors</h3>
              <ul className="text-nafl-grey-300 text-sm space-y-1">
                <li>• 30-second countdown timer</li>
                <li>• Animated hand gestures</li>
                <li>• Auto-select if time runs out</li>
                <li>• Detailed result explanations</li>
              </ul>
            </div>

            <div className="bg-nafl-grey-700 rounded-lg p-4">
              <h3 className="font-bold text-nafl-white mb-2">🎛️ Features</h3>
              <ul className="text-nafl-grey-300 text-sm space-y-1">
                <li>• Responsive design system</li>
                <li>• iFrame embedding support</li>
                <li>• Asset preloading</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-nafl-grey-700 rounded-lg">
            <h3 className="font-bold text-nafl-white mb-2">🔧 Technical Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="text-nafl-aqua-500 font-bold mb-1">Mock API System</h4>
                <ul className="text-nafl-grey-300 space-y-1">
                  <li>• Simulates VRF randomness</li>
                  <li>• Rate limiting (10 req/min)</li>
                  <li>• Network delay simulation</li>
                  <li>• Realistic game outcomes</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nafl-aqua-500 font-bold mb-1">Responsive Design</h4>
                <ul className="text-nafl-grey-300 space-y-1">
                  <li>• Mobile/tablet/desktop</li>
                  <li>• Touch-friendly buttons</li>
                  <li>• Performance-based animations</li>
                  <li>• Reduced motion support</li>
                </ul>
              </div>
              <div>
                <h4 className="text-nafl-aqua-500 font-bold mb-1">iFrame Integration</h4>
                <ul className="text-nafl-grey-300 space-y-1">
                  <li>• Cross-origin messaging</li>
                  <li>• Dynamic resizing</li>
                  <li>• Security validation</li>
                  <li>• Embed code generation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
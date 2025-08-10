"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DemoLauncherPage() {
  const demos = [
    {
      id: 'games-demo',
      title: 'Games Showcase',
      description: 'Interactive demo of all game components with mock API',
      icon: '🎮',
      color: 'bg-gradient-to-br from-nafl-aqua-500 to-nafl-aqua-600',
      features: ['All 3 games', 'Responsive design', 'iFrame embedding', 'Mock API'],
      href: '/games-demo'
    },
    {
      id: 'blackjack-standalone',
      title: 'Blackjack Standalone',
      description: 'Dedicated blackjack game experience',
      icon: '🃏',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      features: ['Crypto-themed table', 'Card animations', 'Chip betting', 'Mobile optimized'],
      href: '/games/iframe/blackjack'
    },
    {
      id: 'coin-toss-standalone',
      title: 'Coin Toss Standalone',
      description: 'Moon-throw coin toss with Pepe and Bitcoin',
      icon: '🪙',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      features: ['Moon animation', 'Starry background', 'Physics simulation', 'Sound effects'],
      href: '/games/iframe/coin-toss'
    },
    {
      id: 'rps-standalone',
      title: 'Rock Paper Scissors',
      description: 'Countdown-based RPS with gesture animations',
      icon: '✊',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      features: ['Countdown timer', 'Hand animations', 'Auto-selection', 'Result explanations'],
      href: '/games/iframe/rps'
    }
  ];

  return (
    <div className="min-h-screen bg-nafl-grey-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-nafl-white mb-4"
          >
            🎮 Naffles Games Demo
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-nafl-grey-400 mb-6"
          >
            Interactive showcase of crypto-themed gaming components
          </motion.p>
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold"
          >
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            Mock API Active - No Backend Required
          </motion.div>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group"
            >
              <Link href={demo.href}>
                <div className="bg-nafl-grey-800 rounded-2xl p-6 border border-nafl-grey-700 hover:border-nafl-aqua-500 transition-all duration-300 cursor-pointer group-hover:transform group-hover:scale-105">
                  
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 ${demo.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {demo.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-nafl-white group-hover:text-nafl-aqua-500 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-nafl-grey-400 text-sm">
                        {demo.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {demo.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-nafl-grey-300">
                        <div className="w-1.5 h-1.5 bg-nafl-aqua-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Launch Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-nafl-grey-500 text-xs">
                      Click to launch demo
                    </span>
                    <div className="text-nafl-aqua-500 group-hover:text-nafl-aqua-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Technical Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-nafl-grey-800 rounded-2xl p-8 border border-nafl-grey-700"
        >
          <h2 className="text-2xl font-bold text-nafl-white mb-6">
            🔧 Technical Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-nafl-aqua-500 mb-3">Mock API System</h3>
              <ul className="text-nafl-grey-300 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Simulates VRF randomness for fair gameplay
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Rate limiting (10 requests per minute)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Network delay simulation (300-1000ms)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Realistic win/lose distributions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-nafl-aqua-500 mb-3">Responsive Design</h3>
              <ul className="text-nafl-grey-300 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Mobile, tablet, and desktop layouts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Touch-friendly button sizing (48px min)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Performance-based animation complexity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Reduced motion accessibility support
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-nafl-aqua-500 mb-3">Advanced Features</h3>
              <ul className="text-nafl-grey-300 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  iFrame embedding with postMessage API
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Asset preloading and optimization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Crypto-themed visual design
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-nafl-sponge-500 rounded-full"></div>
                  Framer Motion animations
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-nafl-grey-700 rounded-lg">
            <h4 className="text-nafl-white font-bold mb-2">🚀 Quick Start</h4>
            <p className="text-nafl-grey-300 text-sm mb-3">
              All demos work without any backend setup. The mock API automatically handles game logic, 
              VRF simulation, and realistic responses. Perfect for testing and development!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-nafl-aqua-500 text-white text-xs rounded">No Backend Required</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Instant Demo</span>
              <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded">Full Features</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-nafl-grey-500 text-sm">
          <p>Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion</p>
          <p className="mt-1">Powered by Naffles Gaming Platform</p>
        </div>
      </div>
    </div>
  );
}
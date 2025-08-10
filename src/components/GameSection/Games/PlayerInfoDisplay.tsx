import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerBalance {
  symbol: string;
  balance: string;
  usdValue?: string;
  icon?: string;
  chainId?: string;
}

interface PlayerInfoDisplayProps {
  playerName: string;
  playerAvatar?: string;
  balances: PlayerBalance[];
  currentTokenType?: string;
  isPointsMode?: boolean;
  totalPointsBalance?: number;
  isLoading?: boolean;
  showDetailedBalances?: boolean;
  className?: string;
}

export const PlayerInfoDisplay: React.FC<PlayerInfoDisplayProps> = ({
  playerName,
  playerAvatar,
  balances,
  currentTokenType,
  isPointsMode = false,
  totalPointsBalance = 0,
  isLoading = false,
  showDetailedBalances = false,
  className = ""
}) => {
  const [displayedBalances, setDisplayedBalances] = useState<PlayerBalance[]>(balances);
  const [balanceUpdateAnimation, setBalanceUpdateAnimation] = useState<string | null>(null);

  // Update balances with animation when they change
  useEffect(() => {
    if (JSON.stringify(balances) !== JSON.stringify(displayedBalances)) {
      // Find which balance changed
      const changedBalance = balances.find((newBalance, index) => {
        const oldBalance = displayedBalances[index];
        return oldBalance && newBalance.balance !== oldBalance.balance;
      });

      if (changedBalance) {
        setBalanceUpdateAnimation(changedBalance.symbol);
        setTimeout(() => setBalanceUpdateAnimation(null), 2000);
      }

      setDisplayedBalances(balances);
    }
  }, [balances, displayedBalances]);

  // Get current token balance for display
  const getCurrentTokenBalance = () => {
    if (isPointsMode) {
      return {
        symbol: 'Points',
        balance: totalPointsBalance.toLocaleString(),
        icon: '🎯'
      };
    }

    if (currentTokenType) {
      return balances.find(b => b.symbol === currentTokenType) || balances[0];
    }

    return balances[0];
  };

  const currentBalance = getCurrentTokenBalance();

  // Format large numbers
  const formatBalance = (balance: string | number) => {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  // Get balance color based on amount
  const getBalanceColor = (balance: string | number) => {
    const num = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (num <= 0) return 'text-red-400';
    if (num < 1) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className={`bg-nafl-grey-800 rounded-lg p-4 border border-nafl-grey-700 ${className}`}>
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-4">
        {/* Player Info - Mobile */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            {playerAvatar ? (
              <img
                src={playerAvatar}
                alt={playerName}
                className="w-10 h-10 rounded-full border-2 border-nafl-grey-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-nafl-aqua-500 flex items-center justify-center text-white font-bold text-sm">
                {playerName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nafl-grey-800" />
          </div>

          {/* Player Name and Status - Mobile */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-nafl-white">{playerName}</h3>
            <div className="flex items-center space-x-2 text-xs text-nafl-grey-400">
              <span>Online</span>
              <span>•</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isPointsMode 
                  ? 'bg-nafl-sponge-500/20 text-nafl-sponge-400 border border-nafl-sponge-500/30'
                  : 'bg-nafl-aqua-500/20 text-nafl-aqua-400 border border-nafl-aqua-500/30'
              }`}>
                {isPointsMode ? '🎯 Points' : '💰 Tokens'}
              </div>
            </div>
          </div>
        </div>

        {/* Balance Display - Mobile */}
        <div className="text-center">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-nafl-aqua-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-nafl-grey-400 text-sm">Updating...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Current Balance - Mobile */}
              <div className="flex items-center justify-center space-x-2">
                {currentBalance?.icon && (
                  <span className="text-lg">{currentBalance.icon}</span>
                )}
                <div className="text-center">
                  <div className={`text-lg font-bold ${getBalanceColor(currentBalance?.balance || '0')}`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentBalance?.balance}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: balanceUpdateAnimation === currentBalance?.symbol ? [1, 1.1, 1] : 1
                        }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatBalance(currentBalance?.balance || '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="text-xs text-nafl-grey-400 flex items-center justify-center space-x-1">
                    <span>{currentBalance?.symbol}</span>
                    {currentBalance?.chainId && (
                      <span className="text-xs bg-nafl-grey-700 px-1 rounded">
                        {currentBalance.chainId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* USD Value - Mobile */}
              {currentBalance?.usdValue && !isPointsMode && (
                <div className="text-xs text-nafl-grey-400">
                  ≈ ${currentBalance.usdValue}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        
        {/* Player Info - Desktop */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            {playerAvatar ? (
              <img
                src={playerAvatar}
                alt={playerName}
                className="w-12 h-12 rounded-full border-2 border-nafl-grey-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-nafl-aqua-500 flex items-center justify-center text-white font-bold text-lg">
                {playerName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-nafl-grey-800" />
          </div>

          {/* Player Name and Status - Desktop */}
          <div>
            <h3 className="text-lg font-bold text-nafl-white">{playerName}</h3>
            <div className="flex items-center space-x-2 text-sm text-nafl-grey-400">
              <span>Online</span>
              <span>•</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isPointsMode 
                  ? 'bg-nafl-sponge-500/20 text-nafl-sponge-400 border border-nafl-sponge-500/30'
                  : 'bg-nafl-aqua-500/20 text-nafl-aqua-400 border border-nafl-aqua-500/30'
              }`}>
                {isPointsMode ? '🎯 Points Mode' : '💰 Token Mode'}
              </div>
            </div>
          </div>
        </div>

        {/* Balance Display - Desktop */}
        <div className="text-right">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-nafl-aqua-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-nafl-grey-400">Updating...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Current Balance */}
              <div className="flex items-center space-x-2">
                {currentBalance?.icon && (
                  <span className="text-lg">{currentBalance.icon}</span>
                )}
                <div className="text-right">
                  <div className={`text-xl font-bold ${getBalanceColor(currentBalance?.balance || '0')}`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentBalance?.balance}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: balanceUpdateAnimation === currentBalance?.symbol ? [1, 1.1, 1] : 1
                        }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatBalance(currentBalance?.balance || '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="text-sm text-nafl-grey-400 flex items-center space-x-1">
                    <span>{currentBalance?.symbol}</span>
                    {currentBalance?.chainId && (
                      <span className="text-xs bg-nafl-grey-700 px-1 rounded">
                        {currentBalance.chainId}
                      </span>
                    )}
                    {/* Currency type indicator */}
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      isPointsMode 
                        ? 'bg-nafl-sponge-500/20 text-nafl-sponge-400'
                        : 'bg-nafl-aqua-500/20 text-nafl-aqua-400'
                    }`}>
                      {isPointsMode ? 'PTS' : 'TOK'}
                    </span>
                  </div>
                </div>
              </div>

              {/* USD Value */}
              {currentBalance?.usdValue && !isPointsMode && (
                <div className="text-sm text-nafl-grey-400">
                  ≈ ${currentBalance.usdValue}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Balances */}
      <AnimatePresence>
        {showDetailedBalances && balances.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-nafl-grey-700"
          >
            <div className="text-sm text-nafl-grey-400 mb-2">All Balances:</div>
            <div className="grid grid-cols-2 gap-2">
              {balances.map((balance) => (
                <div
                  key={`${balance.symbol}-${balance.chainId}`}
                  className={`p-2 rounded bg-nafl-grey-700 transition-all ${
                    balanceUpdateAnimation === balance.symbol ? 'ring-2 ring-nafl-aqua-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {balance.icon && (
                        <img src={balance.icon} alt={balance.symbol} className="w-4 h-4" />
                      )}
                      <span className="text-nafl-white text-sm font-medium">
                        {balance.symbol}
                      </span>
                      {balance.chainId && (
                        <span className="text-xs text-nafl-grey-500 bg-nafl-grey-800 px-1 rounded">
                          {balance.chainId}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${getBalanceColor(balance.balance)}`}>
                        {formatBalance(balance.balance)}
                      </div>
                      {balance.usdValue && (
                        <div className="text-xs text-nafl-grey-500">
                          ${balance.usdValue}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points Balance (if in points mode) */}
      {isPointsMode && (
        <div className="mt-4 pt-4 border-t border-nafl-grey-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-nafl-grey-400">Total Points</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span className={`text-lg font-bold ${getBalanceColor(totalPointsBalance)}`}>
                {formatBalance(totalPointsBalance)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance Update Notification */}
      <AnimatePresence>
        {balanceUpdateAnimation && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-2 right-2 bg-nafl-aqua-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Balance Updated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
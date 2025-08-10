import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenBalance {
  symbol: string;
  balance: string;
  usdValue?: string;
  icon?: string;
  chainId?: string;
  contractAddress?: string;
}

interface BettingInterfaceProps {
  availableTokens: TokenBalance[];
  onBetPlaced: (betAmount: string, tokenType: string) => Promise<void>;
  onPlayAgain?: () => void;
  isGameActive: boolean;
  isGameCompleted: boolean;
  isLoading?: boolean;
  minBetAmount?: string;
  maxBetAmount?: string;
  lastBetAmount?: string;
  lastTokenType?: string;
  disabled?: boolean;
  className?: string;
}

interface BetValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export const UnifiedBettingInterface: React.FC<BettingInterfaceProps> = ({
  availableTokens,
  onBetPlaced,
  onPlayAgain,
  isGameActive,
  isGameCompleted,
  isLoading = false,
  minBetAmount = "0.001",
  maxBetAmount = "10",
  lastBetAmount,
  lastTokenType,
  disabled = false,
  className = ""
}) => {
  const [betAmount, setBetAmount] = useState<string>(lastBetAmount || "0.01");
  const [selectedToken, setSelectedToken] = useState<string>(lastTokenType || availableTokens[0]?.symbol || "");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [validationResult, setValidationResult] = useState<BetValidationResult>({ isValid: true });
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  // Update bet amount and token when props change
  useEffect(() => {
    if (lastBetAmount && lastBetAmount !== betAmount) {
      setBetAmount(lastBetAmount);
    }
    if (lastTokenType && lastTokenType !== selectedToken) {
      setSelectedToken(lastTokenType);
    }
  }, [lastBetAmount, lastTokenType]);

  // Validate bet amount
  const validateBet = useCallback((amount: string, tokenSymbol: string): BetValidationResult => {
    const numAmount = parseFloat(amount);
    const minAmount = parseFloat(minBetAmount);
    const maxAmount = parseFloat(maxBetAmount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { isValid: false, error: "Please enter a valid bet amount" };
    }
    
    if (numAmount < minAmount) {
      return { isValid: false, error: `Minimum bet is ${minBetAmount} ${tokenSymbol}` };
    }
    
    if (numAmount > maxAmount) {
      return { isValid: false, error: `Maximum bet is ${maxBetAmount} ${tokenSymbol}` };
    }
    
    const selectedTokenData = availableTokens.find(t => t.symbol === tokenSymbol);
    if (!selectedTokenData) {
      return { isValid: false, error: "Selected token not available" };
    }
    
    const balance = parseFloat(selectedTokenData.balance);
    if (numAmount > balance) {
      return { isValid: false, error: `Insufficient balance. Available: ${selectedTokenData.balance} ${tokenSymbol}` };
    }
    
    // Warning for high bets
    if (numAmount > balance * 0.5) {
      return { 
        isValid: true, 
        warning: `This bet is ${Math.round((numAmount / balance) * 100)}% of your balance` 
      };
    }
    
    return { isValid: true };
  }, [minBetAmount, maxBetAmount, availableTokens]);

  // Update validation when bet amount or token changes
  useEffect(() => {
    if (betAmount && selectedToken) {
      setValidationResult(validateBet(betAmount, selectedToken));
    }
  }, [betAmount, selectedToken, validateBet]);

  // Handle bet amount change
  const handleBetAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;
    setBetAmount(value);
  };

  // Handle token selection
  const handleTokenSelect = (tokenSymbol: string) => {
    setSelectedToken(tokenSymbol);
    setShowTokenDropdown(false);
  };

  // Handle play button click
  const handlePlayClick = async () => {
    if (!validationResult.isValid || isPlacingBet || disabled) return;
    
    setIsPlacingBet(true);
    try {
      await onBetPlaced(betAmount, selectedToken);
    } catch (error) {
      console.error('Error placing bet:', error);
      // Error handling would be done by parent component
    } finally {
      setIsPlacingBet(false);
    }
  };

  // Handle play again click
  const handlePlayAgainClick = () => {
    if (onPlayAgain && !isPlacingBet && !disabled) {
      onPlayAgain();
    }
  };

  // Quick bet amount buttons
  const quickBetAmounts = ["0.001", "0.01", "0.1", "1"];

  // Get selected token data
  const selectedTokenData = availableTokens.find(t => t.symbol === selectedToken);

  return (
    <div className={`bg-nafl-grey-800 rounded-lg p-6 border border-nafl-grey-700 ${className}`}>
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-nafl-white">Place Your Bet</h3>
          {isGameActive && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-500 font-medium">Game Active</span>
            </div>
          )}
        </div>

        {/* Bet Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-nafl-grey-300">
            Bet Amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={betAmount}
              onChange={(e) => handleBetAmountChange(e.target.value)}
              placeholder="0.00"
              disabled={isGameActive || disabled || isLoading}
              className={`w-full px-4 py-3 bg-nafl-grey-700 border rounded-lg text-nafl-white placeholder-nafl-grey-400 focus:outline-none focus:ring-2 transition-colors ${
                validationResult.isValid 
                  ? 'border-nafl-grey-600 focus:ring-nafl-aqua-500 focus:border-nafl-aqua-500'
                  : 'border-red-500 focus:ring-red-500 focus:border-red-500'
              } ${(isGameActive || disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {selectedTokenData && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nafl-grey-400 text-sm">
                {selectedToken}
              </div>
            )}
          </div>
          
          {/* Quick bet buttons */}
          <div className="flex space-x-2">
            {quickBetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isGameActive || disabled || isLoading}
                className={`px-3 py-1 text-xs rounded border transition-colors ${
                  betAmount === amount
                    ? 'bg-nafl-aqua-500 border-nafl-aqua-500 text-white'
                    : 'bg-nafl-grey-700 border-nafl-grey-600 text-nafl-grey-300 hover:border-nafl-grey-500'
                } ${(isGameActive || disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-nafl-grey-600'}`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-nafl-grey-300">
            Token
          </label>
          <div className="relative">
            <button
              onClick={() => setShowTokenDropdown(!showTokenDropdown)}
              disabled={isGameActive || disabled || isLoading}
              className={`w-full px-4 py-3 bg-nafl-grey-700 border border-nafl-grey-600 rounded-lg text-left flex items-center justify-between transition-colors ${
                (isGameActive || disabled || isLoading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-nafl-grey-500 focus:outline-none focus:ring-2 focus:ring-nafl-aqua-500 focus:border-nafl-aqua-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                {selectedTokenData?.icon && (
                  <img 
                    src={selectedTokenData.icon} 
                    alt={selectedToken}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <div>
                  <div className="text-nafl-white font-medium">{selectedToken}</div>
                  <div className="text-nafl-grey-400 text-sm">
                    Balance: {selectedTokenData?.balance || '0.00'}
                    {selectedTokenData?.usdValue && (
                      <span className="ml-2">(${selectedTokenData.usdValue})</span>
                    )}
                  </div>
                </div>
              </div>
              <svg 
                className={`w-5 h-5 text-nafl-grey-400 transition-transform ${showTokenDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Token Dropdown */}
            <AnimatePresence>
              {showTokenDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-nafl-grey-700 border border-nafl-grey-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {availableTokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => handleTokenSelect(token.symbol)}
                      className="w-full px-4 py-3 text-left hover:bg-nafl-grey-600 transition-colors flex items-center space-x-3"
                    >
                      {token.icon && (
                        <img 
                          src={token.icon} 
                          alt={token.symbol}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-nafl-white font-medium">{token.symbol}</div>
                        <div className="text-nafl-grey-400 text-sm">
                          Balance: {token.balance}
                          {token.usdValue && (
                            <span className="ml-2">(${token.usdValue})</span>
                          )}
                        </div>
                      </div>
                      {token.chainId && (
                        <div className="text-xs text-nafl-grey-500 bg-nafl-grey-800 px-2 py-1 rounded">
                          {token.chainId}
                        </div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Validation Messages */}
        <AnimatePresence>
          {(validationResult.error || validationResult.warning) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 rounded-lg text-sm ${
                validationResult.error 
                  ? 'bg-red-900/50 border border-red-500/50 text-red-300'
                  : 'bg-yellow-900/50 border border-yellow-500/50 text-yellow-300'
              }`}
            >
              {validationResult.error || validationResult.warning}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action Button with Smooth Transitions */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={isGameCompleted ? 'play-again' : 'play'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex space-x-3"
            >
              {/* Play Button */}
              {!isGameCompleted && (
                <motion.button
                  onClick={handlePlayClick}
                  disabled={!validationResult.isValid || isPlacingBet || isGameActive || disabled || isLoading}
                  whileHover={{ scale: validationResult.isValid && !isPlacingBet && !isGameActive && !disabled && !isLoading ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                    !validationResult.isValid || isPlacingBet || isGameActive || disabled || isLoading
                      ? 'bg-nafl-grey-600 cursor-not-allowed opacity-50'
                      : 'bg-nafl-aqua-500 hover:bg-nafl-aqua-600 hover:shadow-lg'
                  }`}
                >
                  {isPlacingBet ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Bet...</span>
                    </div>
                  ) : isLoading ? (
                    'Loading...'
                  ) : (
                    `Play (${betAmount} ${selectedToken})`
                  )}
                </motion.button>
              )}

              {/* Play Again Button - Prominent when game is completed */}
              {isGameCompleted && onPlayAgain && (
                <motion.button
                  onClick={handlePlayAgainClick}
                  disabled={!validationResult.isValid || isPlacingBet || disabled || isLoading}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  whileHover={{ 
                    scale: validationResult.isValid && !isPlacingBet && !disabled && !isLoading ? 1.02 : 1,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 px-6 rounded-lg font-bold text-white transition-all duration-200 relative overflow-hidden ${
                    !validationResult.isValid || isPlacingBet || disabled || isLoading
                      ? 'bg-nafl-grey-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-nafl-sponge-500 to-nafl-sponge-600 hover:from-nafl-sponge-600 hover:to-nafl-sponge-700'
                  }`}
                >
                  {isPlacingBet ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Starting New Game...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        🎮
                      </motion.span>
                      <span>Play Again ({betAmount} {selectedToken})</span>
                    </div>
                  )}
                  
                  {/* Animated background effect for Play Again button */}
                  {!isPlacingBet && !disabled && !isLoading && validationResult.isValid && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-nafl-sponge-400 to-nafl-sponge-500 opacity-20"
                      animate={{ 
                        x: ['-100%', '100%'],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quick Play Again with Same Bet Info */}
          {isGameCompleted && onPlayAgain && lastBetAmount && lastTokenType && (
            <div className="bg-nafl-grey-700 rounded-lg p-3 border border-nafl-grey-600">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-nafl-grey-400">Quick Replay:</span>
                  <span className="text-nafl-white font-medium">
                    {lastBetAmount} {lastTokenType}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-nafl-grey-400">
                  <span>⚡</span>
                  <span>Same bet amount</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bet Persistence Info */}
        {(lastBetAmount || lastTokenType) && (
          <div className="text-xs text-nafl-grey-400 text-center">
            Last bet: {lastBetAmount} {lastTokenType}
          </div>
        )}
      </div>
    </div>
  );
};
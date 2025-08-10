import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Button component removed - using regular buttons
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";
import { Button } from "flowbite-react";

interface Card {
  suit: string;
  value: string;
  numericValue: number;
  id?: string;
}

interface BlackjackGameState {
  playerHand: Card[];
  dealerHand: Card[];
  playerValue: number;
  dealerValue: number;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'finished' | 'blackjack_resolution';
  result?: 'win' | 'lose' | 'push' | 'player_blackjack' | 'dealer_blackjack';
  resultMessage?: string;
  canHit: boolean;
  canStand: boolean;
  canDouble: boolean;
  canSplit: boolean;
  betAmount: number;
  showStartOverlay: boolean;
  splitHands?: Card[][];
  currentSplitHand?: number;
  isAceSplit?: boolean;
  hasPlayerBlackjack?: boolean;
  hasDealerBlackjack?: boolean;
}

export const BlackjackGame = (props: GameContainerProps) => {
  const {
    onGameStart,
    onGameReset,
    isPaused,
    resetToInitial,
    onLimitReached,
    callGameResultModal,
  } = props;
  
  const { setPoints } = useBasicUser();
  const [gameState, setGameState] = useState<BlackjackGameState>({
    playerHand: [],
    dealerHand: [],
    playerValue: 0,
    dealerValue: 0,
    gameStatus: 'waiting',
    canHit: false,
    canStand: false,
    canDouble: false,
    canSplit: false,
    betAmount: 10,
    showStartOverlay: true
  });
  
  const [displayPoints, setDisplayPoints] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [gameResult, setGameResult] = useState<{result: string, details: string}>({result: '', details: ''});
  const [showBlackjackCelebration, setShowBlackjackCelebration] = useState(false);
  const [show21Celebration, setShow21Celebration] = useState(false);
  
  // Enhanced animation tracking for minimal card movement
  const [animatingCards, setAnimatingCards] = useState<{
    dealer: Set<number>;
    player: Set<number>;
    dealerRevealing: Set<number>;
    splitShifting: boolean;
  }>({
    dealer: new Set(),
    player: new Set(),
    dealerRevealing: new Set(),
    splitShifting: false
  });

  // Generate random cards for demo
  const generateRandomCard = useCallback((): Card => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    
    let numericValue: number;
    if (value === 'A') {
      numericValue = 11; // Will be adjusted for aces later
    } else if (['J', 'Q', 'K'].includes(value)) {
      numericValue = 10;
    } else {
      numericValue = parseInt(value);
    }
    
    return { suit, value, numericValue };
  }, []);

  const calculateHandValue = useCallback((cards: Card[]): number => {
    let value = 0;
    let aces = 0;
    
    for (let card of cards) {
      if (card.value === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.numericValue;
      }
    }
    
    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  }, []);

  // Enhanced blackjack detection
  const detectBlackjack = useCallback((cards: Card[]): boolean => {
    return cards.length === 2 && calculateHandValue(cards) === 21;
  }, [calculateHandValue]);

  // Enhanced split logic for any pair (same rank or same value cards like 10-J, Q-K)
  const canSplit = useCallback((cards: Card[]): boolean => {
    if (cards.length !== 2) return false;
    
    const card1 = cards[0];
    const card2 = cards[1];
    
    // Can split if same rank or same value (10-J, Q-K, etc.)
    return card1.value === card2.value || 
           (card1.numericValue === 10 && card2.numericValue === 10);
  }, []);

  const startNewGame = useCallback(async () => {
    setHasError(false);
    setIsDealing(true);
    setShowResultOverlay(false);
    onGameStart?.();
    
    try {
      // Initialize secure game session
      const response = await axios.post("/unified-secure-games/initialize", {
        gameType: 'blackjack',
        tokenType: 'eth',
        betAmount: gameState.betAmount.toString()
      });
      
      const { sessionId, signedGameState, gameState: serverGameState } = response.data.data;
      
      // Use server-provided game state
      const playerHand = serverGameState.playerHand;
      const dealerHand = serverGameState.dealerHand;
      const playerValue = serverGameState.playerScore;
      const dealerValue = serverGameState.dealerScore;
      
      const hasPlayerBlackjack = detectBlackjack(playerHand);
      const hasDealerBlackjack = detectBlackjack(dealerHand);
      
      // Mark all initial cards as needing animation
      setAnimatingCards({
        dealer: new Set([0, 1]), // Both dealer cards animate in
        player: new Set([0, 1]), // Both player cards animate in
        dealerRevealing: new Set(),
        splitShifting: false
      });
      
      let newGameState: BlackjackGameState = {
        playerHand,
        dealerHand,
        playerValue,
        dealerValue: dealerHand[0].numericValue, // Only show first dealer card initially
        gameStatus: 'playing',
        canHit: !hasPlayerBlackjack,
        canStand: !hasPlayerBlackjack,
        canDouble: !hasPlayerBlackjack && playerHand.length === 2,
        canSplit: !hasPlayerBlackjack && canSplit(playerHand),
        betAmount: gameState.betAmount,
        showStartOverlay: false,
        hasPlayerBlackjack,
        hasDealerBlackjack
      };
      
      // Enhanced blackjack detection and immediate resolution
      if (hasPlayerBlackjack) {
        // Trigger blackjack celebration
        triggerBlackjackCelebration();
        
        // Player has blackjack - reveal dealer hole card
        newGameState.dealerValue = fullDealerValue;
        newGameState.gameStatus = 'blackjack_resolution';
        
        if (hasDealerBlackjack) {
          // Both have blackjack - push
          newGameState.result = 'push';
          newGameState.resultMessage = 'Both have blackjack - Push!';
        } else {
          // Player wins with blackjack
          newGameState.result = 'player_blackjack';
          newGameState.resultMessage = 'Blackjack! You win!';
        }
        
        // Reveal dealer hole card animation
        setTimeout(() => {
          setAnimatingCards(prev => ({
            ...prev,
            dealerRevealing: new Set([1])
          }));
        }, 1000);
        
      } else if (hasDealerBlackjack) {
        // Dealer has blackjack - reveal and end game
        newGameState.dealerValue = fullDealerValue;
        newGameState.gameStatus = 'blackjack_resolution';
        newGameState.result = 'dealer_blackjack';
        newGameState.resultMessage = 'Dealer Blackjack! House wins!';
        
        // Reveal dealer hole card animation
        setTimeout(() => {
          setAnimatingCards(prev => ({
            ...prev,
            dealerRevealing: new Set([1])
          }));
        }, 1000);
      }
      
      setGameState(newGameState);
      
      // Clear animations after they complete
      setTimeout(() => {
        setAnimatingCards(prev => ({
          ...prev,
          dealer: new Set(),
          player: new Set(),
          dealerRevealing: new Set()
        }));
      }, 1500);
      
      // Auto-end game if blackjack detected
      if (hasPlayerBlackjack || hasDealerBlackjack) {
        setTimeout(() => {
          const result = newGameState.result === 'player_blackjack' ? 'win' : 
                        newGameState.result === 'dealer_blackjack' ? 'lose' : 'push';
          endGame(result, newGameState.resultMessage || '');
        }, 2000);
      }
      
    } catch (error: any) {
      setHasError(true);
      if (error.response?.data?.statusCode === 429) {
        onLimitReached();
        alert(error.response.data.message);
      } else {
        alert("An error occurred while starting Blackjack");
      }
    } finally {
      setIsDealing(false);
    }
  }, [gameState.betAmount, onGameStart, onLimitReached, generateRandomCard, calculateHandValue, detectBlackjack, canSplit]);

  const handleStartGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'starting',
      showStartOverlay: false
    }));
    startNewGame();
  }, [startNewGame]);

  const playerAction = useCallback(async (action: 'hit' | 'stand' | 'double' | 'split') => {
    if (gameState.gameStatus !== 'playing') return;
    
    try {
      if (action === 'hit') {
        // Add a card to player's hand
        const newCard = generateRandomCard();
        const newPlayerHand = [...gameState.playerHand, newCard];
        const newPlayerValue = calculateHandValue(newPlayerHand);
        const newCardIndex = newPlayerHand.length - 1;
        
        // Mark only the new card for animation
        setAnimatingCards(prev => ({
          ...prev,
          player: new Set([newCardIndex])
        }));
        
        setGameState(prev => ({
          ...prev,
          playerHand: newPlayerHand,
          playerValue: newPlayerValue,
          canHit: newPlayerValue < 21,
          canDouble: false // Can't double after hitting
        }));
        
        // Clear animation after it completes
        setTimeout(() => {
          setAnimatingCards(prev => ({
            ...prev,
            player: new Set()
          }));
        }, 800);
        
        // Check for bust
        if (newPlayerValue > 21) {
          setTimeout(() => endGame('lose', 'Player busts!'), 500);
          return;
        }
        
        // Check for 21
        if (newPlayerValue === 21) {
          trigger21Celebration();
          setTimeout(() => playerAction('stand'), 500);
          return;
        }
        
      } else if (action === 'stand' || action === 'double') {
        let finalPlayerHand = gameState.playerHand;
        let finalPlayerValue = gameState.playerValue;
        
        if (action === 'double') {
          // Add one more card for double down
          const newCard = generateRandomCard();
          finalPlayerHand = [...gameState.playerHand, newCard];
          finalPlayerValue = calculateHandValue(finalPlayerHand);
          const newCardIndex = finalPlayerHand.length - 1;
          
          // Mark only the new card for animation
          setAnimatingCards(prev => ({
            ...prev,
            player: new Set([newCardIndex])
          }));
          
          setGameState(prev => ({
            ...prev,
            playerHand: finalPlayerHand,
            playerValue: finalPlayerValue
          }));
          
          // Clear animation after it completes
          setTimeout(() => {
            setAnimatingCards(prev => ({
              ...prev,
              player: new Set()
            }));
          }, 800);
          
          if (finalPlayerValue > 21) {
            setTimeout(() => endGame('lose', 'Player busts after double down!'), 500);
            return;
          }
        }
        
        // Reveal dealer's hidden card first
        setAnimatingCards(prev => ({
          ...prev,
          dealerRevealing: new Set([1]) // Second dealer card reveals
        }));
        
        // Dealer plays
        setGameState(prev => ({ ...prev, gameStatus: 'finished', canHit: false, canStand: false, canDouble: false, canSplit: false }));
        
        // Clear reveal animation
        setTimeout(() => {
          setAnimatingCards(prev => ({
            ...prev,
            dealerRevealing: new Set()
          }));
        }, 600);
        
        // Dealer hits until 17 or higher
        let dealerHand = [...gameState.dealerHand];
        let dealerValue = calculateHandValue(dealerHand);
        let dealerCardIndex = dealerHand.length;
        
        while (dealerValue < 17) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newCard = generateRandomCard();
          dealerHand = [...dealerHand, newCard];
          dealerValue = calculateHandValue(dealerHand);
          
          // Mark only the new dealer card for animation
          setAnimatingCards(prev => ({
            ...prev,
            dealer: new Set([dealerCardIndex])
          }));
          
          setGameState(prev => ({
            ...prev,
            dealerHand,
            dealerValue
          }));
          
          // Clear animation after it completes
          setTimeout(() => {
            setAnimatingCards(prev => ({
              ...prev,
              dealer: new Set()
            }));
          }, 800);
          
          dealerCardIndex++;
        }
        
        // Determine winner
        setTimeout(() => {
          if (dealerValue > 21) {
            endGame('win', 'Dealer busts!');
          } else if (finalPlayerValue > dealerValue) {
            endGame('win', `${finalPlayerValue} beats ${dealerValue}`);
          } else if (finalPlayerValue < dealerValue) {
            endGame('lose', `${dealerValue} beats ${finalPlayerValue}`);
          } else {
            endGame('push', `Both have ${finalPlayerValue} - Push!`);
          }
        }, 1000);
      } else if (action === 'split') {
        // Proper casino split functionality
        const originalHand = gameState.playerHand;
        const isAceSplit = originalHand[0].value === 'A';
        
        // Create two hands from the split - each gets one card from original pair
        const splitHands = [
          [originalHand[0]], // First hand with first card only
          [originalHand[1]]  // Second hand with second card only
        ];
        
        // Deal second card ONLY to first hand initially
        // Second hand remains with one card until first hand is completed
        splitHands[0].push(generateRandomCard());
        
        // Animate split repositioning
        setAnimatingCards(prev => ({
          ...prev,
          splitShifting: true,
          player: new Set([1]) // New card for first split hand
        }));
        
        setGameState(prev => ({
          ...prev,
          splitHands,
          currentSplitHand: 0,
          canDouble: !isAceSplit, // Can't double on split Aces
          canSplit: false, // No re-splitting
          isAceSplit,
          playerHand: splitHands[0], // Show first hand as active
          playerValue: calculateHandValue(splitHands[0])
        }));
        
        // Clear animations after they complete
        setTimeout(() => {
          setAnimatingCards(prev => ({
            ...prev,
            splitShifting: false,
            player: new Set()
          }));
        }, 1000);
        
        // Special handling for split Aces - they get only one card each and are automatically completed
        if (isAceSplit) {
          // Deal second card to second hand as well for Aces
          splitHands[1].push(generateRandomCard());
          
          setTimeout(() => {
            // Both hands are complete with split Aces - no further actions allowed
            setGameState(prev => ({
              ...prev,
              gameStatus: 'finished',
              canHit: false,
              canStand: false,
              canDouble: false,
              splitHands
            }));
            
            // Start dealer play
            setTimeout(() => dealerPlay(splitHands), 500);
          }, 1000);
        } else {
          // For non-Ace splits, continue with first hand
          const firstHandValue = calculateHandValue(splitHands[0]);
          if (firstHandValue === 21) {
            // First hand has 21, move to second hand and deal its second card
            setTimeout(() => {
              splitHands[1].push(generateRandomCard());
              
              setGameState(prev => ({
                ...prev,
                currentSplitHand: 1,
                playerHand: splitHands[1],
                playerValue: calculateHandValue(splitHands[1]),
                splitHands
              }));
              
              const secondHandValue = calculateHandValue(splitHands[1]);
              if (secondHandValue === 21) {
                // Both hands have 21, move to dealer
                setTimeout(() => {
                  setGameState(prev => ({
                    ...prev,
                    gameStatus: 'finished',
                    canHit: false,
                    canStand: false,
                    canDouble: false
                  }));
                  dealerPlay(splitHands);
                }, 500);
              }
            }, 500);
          }
          // If first hand doesn't have 21, continue playing it normally
        }
      }
      
    } catch (error: any) {
      setHasError(true);
      alert("An error occurred during the game");
    }
  }, [gameState, generateRandomCard, calculateHandValue]);

  const dealerPlay = useCallback(async (splitHands?: Card[][]) => {
    // Reveal dealer's hidden card first and update score immediately
    const fullDealerValue = calculateHandValue(gameState.dealerHand);
    
    setGameState(prev => ({
      ...prev,
      dealerValue: fullDealerValue
    }));
    
    setAnimatingCards(prev => ({
      ...prev,
      dealerRevealing: new Set([1]) // Second dealer card reveals
    }));
    
    // Clear reveal animation
    setTimeout(() => {
      setAnimatingCards(prev => ({
        ...prev,
        dealerRevealing: new Set()
      }));
    }, 600);
    
    // Dealer hits until 17 or higher
    let dealerHand = [...gameState.dealerHand];
    let dealerValue = calculateHandValue(dealerHand);
    let dealerCardIndex = dealerHand.length;
    
    while (dealerValue < 17) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCard = generateRandomCard();
      dealerHand = [...dealerHand, newCard];
      dealerValue = calculateHandValue(dealerHand);
      
      // Mark only the new dealer card for animation
      setAnimatingCards(prev => ({
        ...prev,
        dealer: new Set([dealerCardIndex])
      }));
      
      setGameState(prev => ({
        ...prev,
        dealerHand,
        dealerValue
      }));
      
      // Clear animation after it completes
      setTimeout(() => {
        setAnimatingCards(prev => ({
          ...prev,
          dealer: new Set()
        }));
      }, 800);
      
      dealerCardIndex++;
    }
    
    // Determine winner(s)
    setTimeout(() => {
      if (splitHands) {
        // Handle split hands results
        const results = splitHands.map(hand => {
          const handValue = calculateHandValue(hand);
          if (handValue > 21) return 'lose';
          if (dealerValue > 21) return 'win';
          if (handValue > dealerValue) return 'win';
          if (handValue < dealerValue) return 'lose';
          return 'push';
        });
        
        const wins = results.filter(r => r === 'win').length;
        const losses = results.filter(r => r === 'lose').length;
        const pushes = results.filter(r => r === 'push').length;
        
        let overallResult: 'win' | 'lose' | 'push';
        let details: string;
        
        if (wins > losses) {
          overallResult = 'win';
          details = `Split hands: ${wins} wins, ${losses} losses, ${pushes} pushes`;
        } else if (losses > wins) {
          overallResult = 'lose';
          details = `Split hands: ${wins} wins, ${losses} losses, ${pushes} pushes`;
        } else {
          overallResult = 'push';
          details = `Split hands: ${wins} wins, ${losses} losses, ${pushes} pushes`;
        }
        
        endGame(overallResult, details);
      } else {
        // Regular hand result
        const finalPlayerValue = gameState.playerValue;
        if (dealerValue > 21) {
          endGame('win', 'Dealer busts!');
        } else if (finalPlayerValue > dealerValue) {
          endGame('win', `${finalPlayerValue} beats ${dealerValue}`);
        } else if (finalPlayerValue < dealerValue) {
          endGame('lose', `${dealerValue} beats ${finalPlayerValue}`);
        } else {
          endGame('push', `Both have ${finalPlayerValue} - Push!`);
        }
      }
    }, 1000);
  }, [gameState, generateRandomCard, calculateHandValue]);

  const endGame = useCallback((result: 'win' | 'lose' | 'push', details: string) => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'finished',
      result,
      canHit: false,
      canStand: false,
      canDouble: false,
      canSplit: false
    }));
    
    // Calculate score
    const score = result === 'win' ? Math.floor(Math.random() * 100) + 50 : 
                 result === 'push' ? 25 : Math.floor(Math.random() * 20);
    setDisplayPoints(score);
    
    // Wait 0.5 seconds before showing overlay
    setTimeout(() => {
      setGameResult({ result, details });
      setShowResultOverlay(true);
      
      // Call the result modal callback
      callGameResultModal(result);
    }, 500);
  }, [callGameResultModal]);

  const endGameSession = useCallback(() => {
    setShowResultOverlay(false);
    setGameState({
      playerHand: [],
      dealerHand: [],
      playerValue: 0,
      dealerValue: 0,
      gameStatus: 'waiting',
      canHit: false,
      canStand: false,
      canDouble: false,
      canSplit: false,
      betAmount: 10,
      showStartOverlay: true
    });
    setAnimatingCards({
      dealer: new Set(),
      player: new Set(),
      dealerRevealing: new Set(),
      splitShifting: false
    });
    onGameReset?.();
  }, [onGameReset]);

  const triggerBlackjackCelebration = useCallback(() => {
    setShowBlackjackCelebration(true);
    setTimeout(() => {
      setShowBlackjackCelebration(false);
    }, 1000);
  }, []);

  const trigger21Celebration = useCallback(() => {
    setShow21Celebration(true);
    setTimeout(() => {
      setShow21Celebration(false);
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      playerHand: [],
      dealerHand: [],
      playerValue: 0,
      dealerValue: 0,
      gameStatus: 'waiting',
      canHit: false,
      canStand: false,
      canDouble: false,
      canSplit: false,
      betAmount: gameState.betAmount, // Keep the same bet amount
      showStartOverlay: true,
      splitHands: undefined,
      currentSplitHand: undefined,
      isAceSplit: undefined,
      hasPlayerBlackjack: undefined,
      hasDealerBlackjack: undefined,
      result: undefined,
      resultMessage: undefined
    });
    setShowResultOverlay(false);
    setAnimatingCards({
      dealer: new Set(),
      player: new Set(),
      dealerRevealing: new Set(),
      splitShifting: false
    });
    onGameReset?.();
  }, [gameState.betAmount, onGameReset]);

  const getCardDisplay = (card: Card) => {
    const suitSymbols = {
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣',
      'spades': '♠'
    };
    
    return {
      value: card.value,
      suit: suitSymbols[card.suit as keyof typeof suitSymbols] || card.suit,
      color: ['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-black'
    };
  };

  const getHandValueDisplay = (value: number, hand: Card[]) => {
    const hasAce = hand.some(card => card.value === 'A');
    const isSoft = hasAce && value <= 11;
    return isSoft ? `${value} (soft)` : value.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      {/* Crypto-themed Blackjack Table */}
      <div className="relative w-full h-[600px] bg-gradient-to-br from-nafl-grey-800 via-nafl-grey-700 to-nafl-grey-900 rounded-3xl overflow-hidden border-4 border-nafl-aqua-500 shadow-2xl">
        
        {/* Table Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2302B1B1' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Dealer Section */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-nafl-white text-lg font-bold mb-2">
            Dealer: {gameState.gameStatus === 'waiting' ? 'Ready to deal' : 
                    gameState.gameStatus === 'playing' || gameState.gameStatus === 'starting' ? 
                      `${gameState.dealerHand[0]?.numericValue || '?'}` :
                    getHandValueDisplay(gameState.dealerValue, gameState.dealerHand)}
            {gameState.hasDealerBlackjack && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500 ml-2 font-bold"
              >
                BLACKJACK!
              </motion.span>
            )}
          </div>
          
          <div className="relative min-h-[96px] flex items-center justify-center">
            <AnimatePresence>
              {gameState.dealerHand.map((card, index) => {
                const cardDisplay = getCardDisplay(card);
                const isHidden = index === 1 && gameState.gameStatus === 'playing';
                const isAnimating = animatingCards.dealer.has(index);
                const isRevealing = animatingCards.dealerRevealing.has(index);
                
                // Enhanced overlapping positioning (60% overlap)
                const cardWidth = 64; // 16 * 4 (w-16 = 64px)
                const overlapAmount = cardWidth * 0.6; // 60% overlap
                const xPosition = index * (cardWidth - overlapAmount);
                const rotation = index * 2 - 1; // Slight rotation for natural look
                const zIndex = index + 1; // Newest card on top
                
                // Different animations for different scenarios
                let animationProps = {};
                
                if (isAnimating) {
                  // New card being dealt - only animate new cards
                  animationProps = {
                    initial: { x: -200, y: -100, rotate: -45, opacity: 0 },
                    animate: { 
                      x: xPosition, 
                      y: 0, 
                      rotate: rotation, 
                      opacity: 1 
                    },
                    transition: { 
                      duration: 0.8, 
                      delay: index * 0.3,
                      type: "spring",
                      stiffness: 100
                    }
                  };
                } else if (isRevealing) {
                  // Card being revealed (flip animation) - existing cards stay put
                  animationProps = {
                    animate: { 
                      rotateY: [0, 90, 0],
                      x: xPosition, 
                      y: 0, 
                      rotate: rotation
                    },
                    transition: { 
                      duration: 0.6,
                      ease: "easeInOut"
                    }
                  };
                } else {
                  // Existing card - maintain position, no movement
                  animationProps = {
                    animate: { 
                      x: xPosition, 
                      y: 0, 
                      rotate: rotation, 
                      opacity: 1 
                    },
                    transition: { 
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  };
                }
                
                return (
                  <motion.div
                    key={`dealer-${index}`}
                    {...animationProps}
                    className="absolute"
                    style={{ zIndex }}
                  >
                    {isHidden ? (
                      <div className="w-16 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg border-2 border-blue-700 shadow-lg flex items-center justify-center">
                        <div className="text-white text-2xl">?</div>
                      </div>
                    ) : (
                      <div className="w-16 h-24 bg-white rounded-lg border-2 border-nafl-grey-400 shadow-lg relative">
                        {/* Top-left corner */}
                        <div className={`absolute top-1 left-1 text-xs font-bold ${cardDisplay.color} leading-none`}>
                          {cardDisplay.value}
                          <br />
                          <span className="text-sm">{cardDisplay.suit}</span>
                        </div>
                        
                        {/* Bottom-right corner (rotated) */}
                        <div className={`absolute bottom-1 right-1 text-xs font-bold ${cardDisplay.color} transform rotate-180 leading-none`}>
                          {cardDisplay.value}
                          <br />
                          <span className="text-sm">{cardDisplay.suit}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Player Section */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          {gameState.splitHands ? (
            /* Split Hands Display */
            <div className="flex gap-48 mb-4">
              {gameState.splitHands.map((hand, handIndex) => (
                <div key={`split-hand-${handIndex}`} className="flex flex-col items-center">
                  <div className="relative mb-2 min-h-[96px] flex items-center justify-center">
                    <AnimatePresence>
                      {hand.map((card, cardIndex) => {
                        const cardDisplay = getCardDisplay(card);
                        const isAnimating = animatingCards.player.has(cardIndex) && handIndex === gameState.currentSplitHand;
                        
                        // Enhanced overlapping positioning (60% overlap)
                        const cardWidth = 64;
                        const overlapAmount = cardWidth * 0.6;
                        const xPosition = cardIndex * (cardWidth - overlapAmount);
                        const rotation = cardIndex * -2 + 1;
                        const zIndex = cardIndex + 1;
                        
                        let animationProps = {};
                        
                        if (isAnimating) {
                          animationProps = {
                            initial: { x: 200, y: 100, rotate: 45, opacity: 0 },
                            animate: { 
                              x: xPosition, 
                              y: 0, 
                              rotate: rotation, 
                              opacity: 1 
                            },
                            transition: { 
                              duration: 0.8, 
                              delay: cardIndex * 0.3 + 0.5,
                              type: "spring",
                              stiffness: 100
                            }
                          };
                        } else {
                          animationProps = {
                            animate: { 
                              x: xPosition, 
                              y: 0, 
                              rotate: rotation, 
                              opacity: 1 
                            },
                            transition: { 
                              duration: 0.3,
                              ease: "easeOut"
                            }
                          };
                        }
                        
                        return (
                          <motion.div
                            key={`split-${handIndex}-card-${cardIndex}`}
                            {...animationProps}
                            className="absolute"
                            style={{ zIndex }}
                          >
                            <div className="w-16 h-24 bg-white rounded-lg border-2 border-nafl-grey-400 shadow-lg relative">
                              <div className={`absolute top-1 left-1 text-xs font-bold ${cardDisplay.color} leading-none`}>
                                {cardDisplay.value}
                                <br />
                                <span className="text-sm">{cardDisplay.suit}</span>
                              </div>
                              <div className={`absolute bottom-1 right-1 text-xs font-bold ${cardDisplay.color} transform rotate-180 leading-none`}>
                                {cardDisplay.value}
                                <br />
                                <span className="text-sm">{cardDisplay.suit}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                  <div className={`text-nafl-white text-sm font-bold ${handIndex === gameState.currentSplitHand ? 'text-nafl-aqua-500' : ''}`}>
                    Hand {handIndex + 1}: {getHandValueDisplay(calculateHandValue(hand), hand)}
                    {calculateHandValue(hand) > 21 && (
                      <span className="text-red-500 ml-1">BUST!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Regular Hand Display */
            <>
              <div className="relative mb-4 min-h-[96px] flex items-center justify-center">
                <AnimatePresence>
                  {gameState.playerHand.map((card, index) => {
                    const cardDisplay = getCardDisplay(card);
                    const isAnimating = animatingCards.player.has(index);
                    
                    const cardWidth = 64;
                    const overlapAmount = cardWidth * 0.6;
                    const xPosition = index * (cardWidth - overlapAmount);
                    const rotation = index * -2 + 1;
                    const zIndex = index + 1;
                    
                    let animationProps = {};
                    
                    if (isAnimating) {
                      animationProps = {
                        initial: { x: 200, y: 100, rotate: 45, opacity: 0 },
                        animate: { 
                          x: xPosition, 
                          y: 0, 
                          rotate: rotation, 
                          opacity: 1 
                        },
                        transition: { 
                          duration: 0.8, 
                          delay: index * 0.3 + 0.5,
                          type: "spring",
                          stiffness: 100
                        }
                      };
                    } else {
                      animationProps = {
                        animate: { 
                          x: xPosition, 
                          y: 0, 
                          rotate: rotation, 
                          opacity: 1 
                        },
                        transition: { 
                          duration: 0.3,
                          ease: "easeOut"
                        }
                      };
                    }
                    
                    return (
                      <motion.div
                        key={`player-${index}`}
                        {...animationProps}
                        className="absolute"
                        style={{ zIndex }}
                      >
                        <div className="w-16 h-24 bg-white rounded-lg border-2 border-nafl-grey-400 shadow-lg relative">
                          <div className={`absolute top-1 left-1 text-xs font-bold ${cardDisplay.color} leading-none`}>
                            {cardDisplay.value}
                            <br />
                            <span className="text-sm">{cardDisplay.suit}</span>
                          </div>
                          <div className={`absolute bottom-1 right-1 text-xs font-bold ${cardDisplay.color} transform rotate-180 leading-none`}>
                            {cardDisplay.value}
                            <br />
                            <span className="text-sm">{cardDisplay.suit}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              <div className="text-nafl-white text-lg font-bold mb-4">
                You: {gameState.gameStatus === 'waiting' ? 'Ready to play' : getHandValueDisplay(gameState.playerValue, gameState.playerHand)}
                {gameState.playerValue > 21 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-red-500 ml-2 font-bold"
                  >
                    BUST!
                  </motion.span>
                )}
                {gameState.hasPlayerBlackjack && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-nafl-sponge-500 ml-2 font-bold"
                  >
                    BLACKJACK!
                  </motion.span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Start Game Overlay */}
        <AnimatePresence>
          {gameState.showStartOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🃏</div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {gameState.gameStatus === 'waiting' ? 'Ready to Play Blackjack?' : 'Start New Round?'}
                </h3>
                <button
                  onClick={handleStartGame}
                  disabled={isPaused || isDealing}
                  className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 border-nafl-aqua-500 text-lg px-8 py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDealing ? 'Dealing...' : gameState.gameStatus === 'waiting' ? '🎮 Start Game' : '🃏 Start New Round'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4">
          {gameState.gameStatus === 'playing' && (
            <>
              <button
                onClick={() => playerAction('hit')}
                disabled={!gameState.canHit || isPaused}
                className="bg-nafl-sponge-500 hover:bg-nafl-sponge-600 text-black font-bold px-4 py-2 rounded disabled:opacity-50"
              >
                Hit
              </button>
              
              <Button
                size="md"
                variant="primary-outline"
                onClick={() => playerAction('stand')}
                disabled={!gameState.canStand || isPaused}
                className="bg-nafl-purple hover:bg-opacity-80 text-white font-bold"
              >
                Stand
              </Button>
              
              {gameState.canDouble && (
                <Button
                  size="md"
                  variant="secondary-outline"
                  onClick={() => playerAction('double')}
                  disabled={isPaused}
                  className="bg-nafl-grey-600 hover:bg-nafl-grey-500 text-white font-bold"
                >
                  Double
                </Button>
              )}
              
              {gameState.canSplit && (
                <Button
                  size="md"
                  variant="secondary-outline"
                  onClick={() => playerAction('split')}
                  disabled={isPaused}
                  className="bg-nafl-grey-600 hover:bg-nafl-grey-500 text-white font-bold"
                >
                  Split
                </Button>
              )}
            </>
          )}
        </div>

        {/* Crypto-themed Chips */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {[10, 25, 50, 100].map((amount) => (
            <motion.div
              key={amount}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xs font-bold cursor-pointer ${
                gameState.betAmount === amount 
                  ? 'bg-nafl-sponge-500 border-nafl-sponge-600 text-black' 
                  : 'bg-nafl-grey-700 border-nafl-grey-500 text-white hover:bg-nafl-grey-600'
              }`}
              onClick={() => setGameState(prev => ({ ...prev, betAmount: amount }))}
            >
              ${amount}
            </motion.div>
          ))}
        </div>

        {/* Game Result Overlay */}
        <AnimatePresence>
          {showResultOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              style={{ backdropFilter: 'blur(5px)' }}
            >
              <div className="text-center">
                <div className={`text-6xl font-bold mb-4 ${
                  gameResult.result === 'win' ? 'text-green-500' : 
                  gameResult.result === 'lose' ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>
                  {gameResult.result === 'win' ? 'YOU WIN!' : 
                   gameResult.result === 'lose' ? 'YOU LOSE!' : 
                   'PUSH!'}
                </div>
                <div className="text-xl text-white mb-6">
                  {gameResult.details}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowResultOverlay(false);
                      setGameState(prev => ({
                        ...prev,
                        showStartOverlay: true,
                        gameStatus: 'waiting'
                      }));
                    }}
                    className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    Start New Round
                  </button>
                  <button
                    onClick={endGameSession}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    End Game
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blackjack Celebration Overlay */}
        <AnimatePresence>
          {showBlackjackCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    textShadow: [
                      "0 0 20px #ffd700",
                      "0 0 40px #ffd700, 0 0 60px #ffd700",
                      "0 0 20px #ffd700"
                    ]
                  }}
                  transition={{ 
                    duration: 0.6,
                    repeat: 1,
                    ease: "easeInOut"
                  }}
                  className="text-6xl font-bold text-yellow-400 mb-4"
                  style={{ textShadow: "0 0 20px #ffd700" }}
                >
                  BLACKJACK!
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: 1
                  }}
                  className="text-4xl"
                >
                  🎉✨🎊
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 21 Celebration Overlay */}
        <AnimatePresence>
          {show21Celebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    textShadow: [
                      "0 0 20px #00ff00",
                      "0 0 40px #00ff00, 0 0 60px #00ff00",
                      "0 0 20px #00ff00"
                    ]
                  }}
                  transition={{ 
                    duration: 0.6,
                    repeat: 1,
                    ease: "easeInOut"
                  }}
                  className="text-8xl font-bold text-green-400 mb-4"
                  style={{ textShadow: "0 0 20px #00ff00" }}
                >
                  21!
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: 1
                  }}
                  className="text-4xl"
                >
                  🎯🔥⭐
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Action Buttons */}
      <div className="flex lg:hidden mt-4 gap-2 flex-wrap justify-center">
        {gameState.gameStatus === 'waiting' && (
          <Button
            size="sm"
            variant="primary-outline"
            onClick={startNewGame}
            disabled={isPaused || isDealing}
            className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600"
          >
            {isDealing ? 'Dealing...' : 'Deal Cards'}
          </Button>
        )}
        
        {gameState.gameStatus === 'playing' && (
          <>
            <Button
              size="sm"
              variant="primary-outline"
              onClick={() => playerAction('hit')}
              disabled={!gameState.canHit || isPaused}
              className="bg-nafl-sponge-500 hover:bg-nafl-sponge-600 text-black"
            >
              Hit
            </Button>
            
            <Button
              size="sm"
              variant="primary-outline"
              onClick={() => playerAction('stand')}
              disabled={!gameState.canStand || isPaused}
              className="bg-nafl-purple hover:bg-opacity-80"
            >
              Stand
            </Button>
            
            {gameState.canDouble && (
              <Button
                size="sm"
                variant="secondary-outline"
                onClick={() => playerAction('double')}
                disabled={isPaused}
              >
                Double
              </Button>
            )}
            
            {gameState.canSplit && (
              <Button
                size="sm"
                variant="secondary-outline"
                onClick={() => playerAction('split')}
                disabled={isPaused}
              >
                Split
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
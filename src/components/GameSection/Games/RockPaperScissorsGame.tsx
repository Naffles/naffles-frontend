import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/shared/Button";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import { GameHistoryDisplay, useGameHistory } from "./GameHistoryDisplay";

type RPSChoice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw';

interface RPSGameState {
  gameStatus: 'waiting' | 'countdown' | 'reveal' | 'finished';
  playerChoice?: RPSChoice;
  houseChoice?: RPSChoice;
  result?: GameResult;
  countdown: number;
  timeLeft: number;
}

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const {
    onGameStart,
    onGameReset,
    isPaused,
    resetToInitial,
    onLimitReached,
    callGameResultModal,
  } = props;
  
  const { setPoints } = useBasicUser();
  const [gameState, setGameState] = useState<RPSGameState>({
    gameStatus: 'waiting',
    countdown: 3,
    timeLeft: 30
  });
  const [displayPoints, setDisplayPoints] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Game history hook
  const { addResult } = useGameHistory('rock-paper-scissors');

  const choiceIcons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const choiceNames = {
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors'
  };

  const getResultExplanation = (playerChoice: RPSChoice, houseChoice: RPSChoice, result: GameResult) => {
    if (result === 'draw') return `Both played ${choiceNames[playerChoice]}. It's a tie!`;
    if (result === 'win') {
      if (playerChoice === 'rock' && houseChoice === 'scissors') return 'Rock crushes scissors. You win!';
      if (playerChoice === 'paper' && houseChoice === 'rock') return 'Paper covers rock. You win!';
      if (playerChoice === 'scissors' && houseChoice === 'paper') return 'Scissors cuts paper. You win!';
    }
    if (result === 'lose') {
      if (houseChoice === 'rock' && playerChoice === 'scissors') return 'Rock crushes scissors. House wins!';
      if (houseChoice === 'paper' && playerChoice === 'rock') return 'Paper covers rock. House wins!';
      if (houseChoice === 'scissors' && playerChoice === 'paper') return 'Scissors cuts paper. House wins!';
    }
    return '';
  };

  const makeChoice = useCallback((choice: RPSChoice) => {
    if (gameState.gameStatus !== 'waiting') return;
    
    setGameState(prev => ({
      ...prev,
      playerChoice: choice,
      gameStatus: 'countdown',
      countdown: 3
    }));
    onGameStart?.(choice);
  }, [gameState.gameStatus, onGameStart]);

  const playGame = useCallback(async () => {
    if (!gameState.playerChoice) return;
    
    setHasError(false);
    
    try {
      // Initialize secure game session
      const initResponse = await axios.post("/unified-secure-games/initialize", {
        gameType: 'rock-paper-scissors',
        tokenType: 'eth',
        betAmount: '0.01',
        gameConfig: { playerChoice: gameState.playerChoice }
      });
      
      const { sessionId, signedGameState } = initResponse.data.data;
      
      // Process RPS result
      const response = await axios.post(`/unified-secure-games/${sessionId}/action`, {
        gameType: 'rock-paper-scissors',
        action: 'play',
        signedGameState
      });
      
      const { data } = response.data;
      setDisplayPoints(data?.score || 0);
      
      // Determine house choice and result
      const houseChoice: RPSChoice = data.houseChoice || ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as RPSChoice;
      const result: GameResult = data.result || 'draw';
      
      // Record house choice in history
      addResult(houseChoice);
      
      setGameState(prev => ({
        ...prev,
        gameStatus: 'reveal',
        houseChoice,
        result
      }));
      
      // Show final result after reveal animation
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'finished' }));
        callGameResultModal(result);
        
        // Reset after 4 seconds
        setTimeout(() => {
          resetGame();
        }, 4000);
      }, 2000);
      
    } catch (error: any) {
      setHasError(true);
      if (error.response?.data?.statusCode === 429) {
        onLimitReached();
        alert(error.response.data.message);
      } else {
        alert("An error occurred while playing RPS");
      }
      resetGame();
    }
  }, [gameState.playerChoice, onLimitReached, callGameResultModal]);

  const resetGame = () => {
    setGameState({
      gameStatus: 'waiting',
      countdown: 3,
      timeLeft: 30
    });
    onGameReset?.();
  };

  const autoSelectChoice = () => {
    const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    makeChoice(randomChoice);
  };

  // Countdown effect
  useEffect(() => {
    if (gameState.gameStatus === 'countdown' && gameState.countdown > 0) {
      const timer = setTimeout(() => {
        if (gameState.countdown === 1) {
          playGame();
        } else {
          setGameState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.countdown, playGame]);

  // Selection timer
  useEffect(() => {
    if (gameState.gameStatus === 'waiting' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        if (gameState.timeLeft === 1) {
          autoSelectChoice();
        } else {
          setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.timeLeft]);

  // Hand animation component
  const AnimatedHand = ({ choice, isPlayer = false }: { choice?: RPSChoice, isPlayer?: boolean }) => (
    <motion.div
      className="relative"
      initial={{ scale: 1 }}
      animate={
        gameState.gameStatus === 'countdown' ? {
          y: [0, -20, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}
      }
    >
      <div className={`w-32 h-32 rounded-full border-4 ${
        isPlayer ? 'border-nafl-aqua-500 bg-nafl-aqua-100' : 'border-nafl-purple bg-purple-100'
      } flex items-center justify-center text-6xl shadow-lg`}>
        {choice ? choiceIcons[choice] : '✊'}
      </div>
      
      {/* Winner/Loser glow effect */}
      {gameState.gameStatus === 'finished' && gameState.result && (
        <motion.div
          className={`absolute inset-0 rounded-full border-4 ${
            (gameState.result === 'win' && isPlayer) || (gameState.result === 'lose' && !isPlayer)
              ? 'border-green-400'
              : gameState.result === 'draw'
              ? 'border-yellow-400'
              : 'border-red-400 opacity-50'
          }`}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(34, 197, 94, 0.7)',
              '0 0 0 20px rgba(34, 197, 94, 0)',
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );

  // Circular countdown timer
  const CircularTimer = () => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (gameState.timeLeft / 30) * circumference;
    
    return (
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-nafl-grey-600"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${
              gameState.timeLeft <= 10 ? 'text-red-500' : 'text-nafl-aqua-500'
            }`}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${
          gameState.timeLeft <= 10 ? 'text-red-500' : 'text-nafl-white'
        }`}>
          {gameState.timeLeft}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      {/* Game Arena */}
      <div className="relative w-full h-[600px] bg-gradient-to-br from-nafl-grey-800 via-nafl-grey-700 to-nafl-grey-900 rounded-3xl overflow-hidden border-4 border-nafl-aqua-500 shadow-2xl">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2302B1B1' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Game History Display */}
        <GameHistoryDisplay gameType="rock-paper-scissors" maxResults={8} />

        {/* Timer (top center) */}
        {gameState.gameStatus === 'waiting' && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <CircularTimer />
          </div>
        )}

        {/* Countdown Display */}
        {gameState.gameStatus === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={gameState.countdown}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-8xl font-bold text-nafl-sponge-500"
            >
              {gameState.countdown}
            </motion.div>
          </div>
        )}

        {/* Game Hands */}
        {(gameState.gameStatus === 'reveal' || gameState.gameStatus === 'finished') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-16">
              {/* Player Hand */}
              <div className="flex flex-col items-center">
                <div className="text-nafl-white text-lg font-bold mb-4">You</div>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <AnimatedHand choice={gameState.playerChoice} isPlayer={true} />
                </motion.div>
              </div>

              {/* VS */}
              <div className="text-nafl-white text-4xl font-bold">VS</div>

              {/* House Hand */}
              <div className="flex flex-col items-center">
                <div className="text-nafl-white text-lg font-bold mb-4">House</div>
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <AnimatedHand choice={gameState.houseChoice} isPlayer={false} />
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Choice Buttons */}
        {gameState.gameStatus === 'waiting' && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6">
            {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
              <Button
                key={choice}
                size="lg"
                variant="primary-outline"
                onClick={() => makeChoice(choice)}
                disabled={isPaused}
                className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 text-white font-bold px-6 py-4 text-lg flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{choiceIcons[choice]}</span>
                <span>{choiceNames[choice]}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Result Display */}
        {gameState.gameStatus === 'finished' && gameState.result && gameState.playerChoice && gameState.houseChoice && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black bg-opacity-70 rounded-lg p-4"
            >
              <div className={`text-3xl font-bold mb-2 ${
                gameState.result === 'win' ? 'text-green-500' : 
                gameState.result === 'lose' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {gameState.result === 'win' ? 'YOU WIN!' : 
                 gameState.result === 'lose' ? 'YOU LOSE!' : 
                 'IT\'S A TIE!'}
              </div>
              <div className="text-nafl-white text-sm">
                {getResultExplanation(gameState.playerChoice, gameState.houseChoice, gameState.result)}
              </div>
            </motion.div>
          </div>
        )}

        {/* Selected Choice Display */}
        {gameState.playerChoice && gameState.gameStatus === 'countdown' && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-nafl-white text-xl font-bold">
              You chose: {choiceIcons[gameState.playerChoice]} {choiceNames[gameState.playerChoice]}
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-nafl-aqua-500 bg-opacity-90 p-3">
          <div className="flex justify-between items-center text-nafl-white text-sm">
            <div>
              {gameState.gameStatus === 'waiting' && 'Choose your move!'}
              {gameState.gameStatus === 'countdown' && 'Get ready...'}
              {gameState.gameStatus === 'reveal' && 'Revealing choices...'}
              {gameState.gameStatus === 'finished' && 'Game complete!'}
            </div>
            <div>Points: {displayPoints}</div>
          </div>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="flex lg:hidden mt-4 gap-2 flex-wrap justify-center">
        {gameState.gameStatus === 'waiting' && (
          <>
            {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
              <Button
                key={choice}
                size="sm"
                variant="primary-outline"
                onClick={() => makeChoice(choice)}
                disabled={isPaused}
                className="bg-nafl-aqua-500 hover:bg-nafl-aqua-600 flex flex-col items-center gap-1 px-3 py-2"
              >
                <span className="text-lg">{choiceIcons[choice]}</span>
                <span className="text-xs">{choiceNames[choice]}</span>
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

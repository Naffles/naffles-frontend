import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

enum GameState {
  WAITING = "waiting",
  COUNTDOWN = "countdown",
  START = "start",
  RESTDOWN = "restdown",
}

const DEFAULT_TIMER = 60;
const REST_TIMER = 3;

const randomFromArray = (arr: any[]): any =>
  arr[Math.floor(Math.random() * arr.length)];

export const BaseGame = (props: BaseGameProps) => {
  const {
    results,
    choices,
    variants,
    basePath,
    extension,
    barColor,
    gameCall = (choice?: string) => {},
    onWinNotify = () => {},
    onCountdownFinish = () => {},
    onVideoFinish = () => {},
    onChoiceClicked = () => {},
    onGameReset = () => {},
    isPaused,
    resetToInitial,
    hasError,
    initialTime,
    gameType,
  } = props;
  const [waitTimeLeft, setWaitTimeLeft] = useState(initialTime);
  const [timeLeft, setTimeLeft] = useState(REST_TIMER);
  const [restTimeLeft, setRestTimeLeft] = useState(REST_TIMER);
  const [result, setResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [displayChoice, setDisplayChoice] = useState("");
  const [displayVideo, setDisplayVideo] = useState<GameVideo | null>(null);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [prevGameState, setPrevGameState] = useState<GameState | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [gameText, setGameText] = useState(false);

  const router = useRouter()

  const videoArray = choices
    .map((choice) =>
      results
        .map((result) =>
          variants.map((variant) => ({ choice, result, variant })).flat()
        )
        .flat()
    )
    .flat();

  const switchGameState = useCallback(
    (targetState: GameState) => {
      switch (targetState) {
        case GameState.WAITING:
          if (resetToInitial) {
            setWaitTimeLeft(initialTime);
          } else {
            setWaitTimeLeft(DEFAULT_TIMER);
          }
          break;
        case GameState.COUNTDOWN:
          setTimeLeft(REST_TIMER);
          break;
        case GameState.START:
          break;
        case GameState.RESTDOWN:
          setRestTimeLeft(REST_TIMER);
          break;
      }
      setGameState(targetState);
    },
    [initialTime, resetToInitial]
  );

  const triggerGame = useCallback(async () => {
    let result;
    if (selectedChoice && !hasError) {
      const data = (await gameCall(selectedChoice)) || {};
      result = data?.result;
      if (result) {
        setResult(result);
        switchGameState(GameState.START);
      }
    } else {
      const randomResult = randomFromArray(results);
      setResult(randomResult);
      switchGameState(GameState.START);
    }
  }, [selectedChoice, hasError, gameCall, switchGameState, results]);

  if (
    gameState === GameState.COUNTDOWN &&
    hasError &&
    !isPaused &&
    timeLeft === 0
  ) {
    triggerGame();
  }

  if (prevGameState !== gameState) {
    setPrevGameState(gameState);
    switch (gameState) {
      case GameState.WAITING:
        if (prevGameState !== null) {onGameReset(); setGameText(!gameText)};
        break;
      case GameState.COUNTDOWN:
        break;
      case GameState.START:
        {
          const variant = randomFromArray(variants);
          const randomChoice = randomFromArray(choices);
          const isChosen = (choiceVid: string) =>
            selectedChoice
              ? choiceVid === selectedChoice
              : choiceVid === randomChoice;

          const refIndex = videoArray.findIndex(
            (item) =>
              item.variant === variant &&
              item.result === result &&
              isChosen(item.choice)
          );
          if (!selectedChoice) {
            setDisplayChoice(randomChoice);
          }
          setDisplayVideo({
            variant,
            result,
            choice: selectedChoice || randomChoice,
          });
          videosRef?.current[refIndex]?.play();
          onCountdownFinish();
        }
        break;
      case GameState.RESTDOWN:
        break;
    }
  }

  useEffect(() => {
    let waitInterval: NodeJS.Timeout;
    if (gameState === GameState.WAITING && !isPaused && waitTimeLeft > 0) {
      waitInterval = setInterval(() => {
        if (waitTimeLeft <= 1) {
          clearInterval(waitInterval);
          switchGameState(GameState.COUNTDOWN);
        }
        setWaitTimeLeft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(waitInterval);
  }, [gameState, waitTimeLeft, isPaused, switchGameState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === GameState.COUNTDOWN && !isPaused && timeLeft > 0) {
      interval = setInterval(async () => {
        if (timeLeft <= 1) {
          triggerGame();
          clearInterval(interval);
        }
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, timeLeft, isPaused, triggerGame]);

  useEffect(() => {
    let restInterval: NodeJS.Timeout;
    if (gameState === GameState.RESTDOWN && !isPaused && restTimeLeft > 0) {
      restInterval = setInterval(() => {
        if (restTimeLeft <= 1) {
          clearInterval(restInterval);
          switchGameState(GameState.WAITING);
        }
        setRestTimeLeft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(restInterval);
  }, [gameState, restTimeLeft, isPaused, switchGameState]);

  const isVideoHidden = (
    variantVid: string | number,
    choiceVid: string,
    resultVid: string
  ) => {
    const { variant = 1, result = "", choice = "" } = displayVideo ?? {};
    if (
      variantVid === variant &&
      resultVid === result &&
      choiceVid === choice
    ) {
      return "";
    }
    return "hidden";
  };

  const buttonColor = useCallback(
    (choice: string) => {
      if (displayChoice === choice) return "secondary-outline";
      if (displayChoice) return "primary-outline";
      if (isPaused || gameState === GameState.RESTDOWN)
        return "tertiary-outline";
      return "primary-outline";
    },
    [isPaused, displayChoice, gameState]
  );

  const handleChoiceClick = (choiceClicked: string) => {
    if (
      [GameState.WAITING, GameState.COUNTDOWN].includes(gameState) &&
      !isPaused
    ) {
      setSelectedChoice(choiceClicked);
      setDisplayChoice(choiceClicked);
      onChoiceClicked();
      if (gameState === GameState.WAITING) {
        switchGameState(GameState.COUNTDOWN);
      }
    }
  };

  const handleVideoEnd = () => {
    if (result === "win" && selectedChoice) {
      onWinNotify();
    }
    setResult("");
    setTimeout(() => {
      setDisplayVideo(null);
    }, 1700);
    setSelectedChoice("");
    setDisplayChoice("");
    onVideoFinish(!!selectedChoice);
    switchGameState(GameState.RESTDOWN);
  };

  const navigaToGameZone = () => {
    router.push('/gamezone')
  }

  const getGameText = (type: string) => {
    const text = ['Ready to win real crypto?', 'Go to the game zone!']
    if (type == 'rps') {
      return text[gameText ? 1 : 0]
    } else {
      return text[gameText ? 0 : 1]
    }
  }
  
  let seconds = timeLeft;
  if (gameState === GameState.RESTDOWN) seconds = restTimeLeft;
  if (gameState === GameState.WAITING) seconds = waitTimeLeft;
  return (
    <>
      <div className="flex-row flex items-center justify-center">
        <div className="flex-col gap-2 -mr-4 z-10 pt-4 w-[155px] hidden lg:flex">
          {choices.map((choice) => (
            <Button
              size="lg"
              variant={buttonColor(choice)}
              label={choice}
              onClick={() => handleChoiceClick(choice)}
              width="span"
              key={choice}
            >
              {choice}
            </Button>
          ))}
        </div>
        <div className="flex-col flex items-center justify-start bg-nafl-grey-700 lg:w-[530px] w-full rounded-3xl overflow-hidden h-[269px] relative">
          {gameState === GameState.COUNTDOWN && (
            <AnimatePresence>
              <div className="w-full h-full flex items-center justify-center text-[8rem]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, display: "block" }}
                  key={seconds}
                >
                  {seconds}
                </motion.div>
              </div>
            </AnimatePresence>
          )}
          <div
            className={`lg:w-[600px] w-[180%] h-[240px] ${gameState === GameState.COUNTDOWN ? "hidden" : ""}`}
          >
            {videoArray.map(({ choice, result: vidResult, variant }, idx) => (
              <video
                playsInline={true}
                preload={selectedChoice === choice ? "auto" : "metadata"}
                className={isVideoHidden(variant, choice, vidResult)}
                key={choice + vidResult + variant}
                ref={(ref) => {
                  videosRef.current[idx] = ref;
                }}
                onEnded={handleVideoEnd}
              >
                <source
                  src={`${basePath}${choice}/${vidResult}${variant}.${extension}`}
                  type={`video/${extension}`}
                />
              </video>
            ))}
            <video
              playsInline={true}
              preload="auto"
              autoPlay
              loop
              muted
              className={gameState !== GameState.START ? "" : "hidden"}
            >
              <source
                src={`${basePath}waiting.${extension}`}
                type={`video/${extension}`}
              />
            </video>
          </div>
          <div
            className={`${barColor} flex items-center bg-nafl-aqua-500 h-[50px] px-[20px] flex-row justify-between absolute bottom-0 w-full ${gameState === GameState.COUNTDOWN ? "hidden" : ""}`}
          >
            <div className="flex flex-col items-start justify-center mt-[5px]">
              <p className="text-[12px] leading-[100%] font-face-bebas">
                {gameState === GameState.RESTDOWN
                  ? "Game restarts in"
                  : "Starting in"}
              </p>
              <div className="text-[25px] leading-[100%]">
                {seconds}{" "}
                <span className="text-[16px] cursor-text font-face-bebas">
                  seconds
                </span>
              </div>
            </div>
            <div 
              className="flex items-center text-[18px] leading-[100%] cursor-pointer"
              onClick={() => navigaToGameZone()}
            >
              {getGameText(gameType)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row sm:flex md:flex xs:flex lg:hidden xl:hidden my-3 gap-[6px]">
        {choices.map((choice) => (
          <Button
            size="sm"
            variant={buttonColor(choice)}
            label={choice}
            onClick={() => handleChoiceClick(choice)}
            width="span"
            key={choice}
          >
            {choice}
          </Button>
        ))}
      </div>
    </>
  );
};

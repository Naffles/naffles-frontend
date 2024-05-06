import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

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
    gameCall = () => {},
    onWinNotify = () => {},
    onCountdownFinish = () => {},
    onVideoFinish = () => {},
    onChoiceClicked = () => {},
    onGameReset = () => {},
    isPaused,
    initialTime,
  } = props;
  const [timeleft, setTimeleft] = useState(initialTime);
  const [restTimeleft, setRestTimeleft] = useState(REST_TIMER);
  const [isRestingDown, setIsRestingDown] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [result, setResult] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [displayChoice, setDisplayChoice] = useState("");
  const [displayVideo, setDisplayVideo] = useState<GameVideo | null>(null);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  const videoArray = useMemo(
    () =>
      choices
        .map((choice) =>
          results
            .map((result) =>
              variants.map((variant) => ({ choice, result, variant })).flat()
            )
            .flat()
        )
        .flat(),
    [choices, results, variants]
  );

  const triggerGame = useCallback(async () => {
    setIsLocked(true);
    let result;
    if (selectedChoice) {
      const data = (await gameCall()) || {};
      result = data?.result;
    }
    const randomResult = randomFromArray(results);
    setResult(result ?? randomResult);
    onCountdownFinish();
  }, [gameCall, onCountdownFinish, results, selectedChoice]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingDown && timeleft > 0) {
      interval = setInterval(() => {
        if (timeleft <= 1) {
          triggerGame();
          clearInterval(interval);
        }
        setTimeleft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCountingDown, timeleft, triggerGame]);

  useEffect(() => {
    let restInterval: NodeJS.Timeout;
    if (isRestingDown && restTimeleft > 0) {
      restInterval = setInterval(() => {
        if (restTimeleft <= 1) {
          setIsRestingDown(false);
          setIsLocked(false);
          if (!isPaused) setIsCountingDown(true);
          setTimeleft(DEFAULT_TIMER);
          clearInterval(restInterval);
          onGameReset();
        }
        setRestTimeleft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(restInterval);
  }, [isRestingDown, onGameReset, restTimeleft, isPaused]);

  useEffect(() => {
    if (result && isLocked && timeleft === 0) {
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
        variant: variant,
        result,
        choice: selectedChoice || randomChoice,
      });
      videosRef?.current[refIndex]?.play();
    }
  }, [
    result,
    isLocked,
    timeleft,
    selectedChoice,
    choices,
    variants,
    videoArray,
  ]);

  useEffect(() => {
    if (!isPaused) {
      setIsCountingDown(true);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isPaused && !selectedChoice) {
      setIsCountingDown(false);
    }
  }, [isPaused, selectedChoice]);

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

  const handleChoiceClick = (choiceClicked: string) => {
    if (!isLocked && !isPaused) {
      setSelectedChoice(choiceClicked);
      setDisplayChoice(choiceClicked);
      onChoiceClicked();
      setTimeleft(3);
    }
  };

  const handleVideoEnd = () => {
    if (result === "win" && selectedChoice) {
      onWinNotify();
    }
    if (isLocked) {
      setResult("");
      setTimeout(() => {
        setDisplayVideo(null);
      }, 1700);
      setSelectedChoice("");
      setDisplayChoice("");
      setIsRestingDown(true);
      setRestTimeleft(REST_TIMER);
      onVideoFinish(!!selectedChoice);
    }
  };

  const buttonColor = useCallback(
    (choice: string) => {
      if (displayChoice === choice) return "secondary-outline";
      if (displayChoice) return "primary-outline";
      if (isPaused || isLocked) return "tertiary-outline";
      return "primary-outline";
    },
    [isPaused, displayChoice, isLocked]
  );

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
          <div className="lg:w-[600px] w-[180%] h-[240px]">
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
              className={result ? "hidden" : ""}
            >
              <source
                src={`${basePath}waiting.${extension}`}
                type={`video/${extension}`}
              />
            </video>
          </div>
          <div
            className={`${barColor} flex items-center bg-nafl-aqua-500 h-[50px] px-[20px] flex-row justify-between absolute bottom-0 w-full`}
          >
            <div className="flex flex-col items-start justify-center mt-[5px]">
              <p className="text-[12px] leading-[100%] font-face-bebas">
                {isRestingDown ? "Game restarts in" : "Starting in"}
              </p>
              <div className="text-[25px] leading-[100%]">
                {isRestingDown ? restTimeleft : timeleft} {""}
                <span className="text-[16px] cursor-text font-face-bebas">
                  seconds
                </span>
              </div>
            </div>
            <div className="flex items-center text-[18px] leading-[100%]">
              PLAY & EARN
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

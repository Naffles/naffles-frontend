import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

const DEFAULT_TIMER = 25;

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
  } = props;
  const [isFirst, setIsFirst] = useState(true);
  const [timeleft, setTimeleft] = useState(DEFAULT_TIMER);
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
    if (!isLocked) {
      setSelectedChoice(choiceClicked);
      setDisplayChoice(choiceClicked);
      onChoiceClicked();
      if (isFirst) {
        setIsCountingDown(false);
        setTimeleft(0);
        setIsFirst(false);
        triggerGame();
      }
    }
  };

  const handleVideoEnd = () => {
    if (result === "win" && selectedChoice) {
      onWinNotify();
    }
    if (isLocked) {
      setTimeout(() => {
        setResult("");
        setDisplayVideo(null);
      }, 1700);
      setSelectedChoice("");
      setDisplayChoice("");
      setIsLocked(false);
      setIsCountingDown(true);
      setTimeleft(DEFAULT_TIMER);
      onVideoFinish();
    }
  };

  return (
    <>
      <div className="flex-row flex mt-5">
        <div className="flex-col gap-2 -mr-4 z-10 pt-4 w-[155px] hidden lg:flex">
          {choices.map((choice) => (
            <Button
              size="lg"
              variant={
                displayChoice === choice
                  ? "secondary-outline"
                  : "primary-outline"
              }
              label={choice}
              onClick={() => handleChoiceClick(choice)}
              width="span"
              key={choice}
            >
              {choice}
            </Button>
          ))}
        </div>
        <div className="flex-col flex bg-nafl-grey-700 w-[500px] rounded-3xl overflow-hidden">
          <div className="lg:h-[188px] sm:h-[135px] xs:h-[135px] md:h-[135px]">
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
            className={`${barColor} h-50 pb-1 px-4 flex-row flex justify-between`}
          >
            <div className="text-md leading-tight">
              Starting in
              <br />
              <div className="text-xl leading-tight">{timeleft} sec</div>
            </div>
            <div className="flex items-center text-lg">PLAY & EARN</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row sm:flex md:flex xs:flex lg:hidden xl:hidden my-3">
        {choices.map((choice) => (
          <Button
            size="sm"
            variant={
              displayChoice === choice ? "secondary-outline" : "primary-outline"
            }
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

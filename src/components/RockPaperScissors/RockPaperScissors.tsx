import { useEffect, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { GameContainer } from "@type/GameSection";
import toast from "react-hot-toast";

const rpsVideoArray = ["rock", "paper", "scissors"]
  .map((hand) =>
    ["win", "lose", "draw"]
      .map((result) =>
        [1, 2, 3].map((variant) => ({ hand, result, variant })).flat()
      )
      .flat()
  )
  .flat();

export const RockPaperScissors = (props: GameContainer) => {
  const {
    timeleft,
    result,
    isLocked,
    onChoice,
    choices,
    triggerUnlock = () => {},
  } = props;
  const [selectedChoice, setSelectedChoice] = useState("");
  const [displayChoice, setDisplayChoice] = useState("");
  const [variant, setVariant] = useState(1);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (result && isLocked && timeleft === 0) {
      const variantNumber = Math.floor(Math.random() * 3) + 1;
      setVariant(variantNumber);
      const refIndex = rpsVideoArray.findIndex(
        (item) =>
          item.variant === variantNumber &&
          item.hand === selectedChoice &&
          item.result === result
      );
      videosRef?.current[refIndex]?.play();
    }
  }, [result, isLocked, timeleft, selectedChoice]);

  const isVideoHidden = (
    variantVid: number,
    handVid: string,
    resultVid: string
  ) => {
    if (
      variantVid === variant &&
      handVid === selectedChoice &&
      resultVid === result
    )
      return "";
    return "hidden";
  };
  const handleChoiceClick = (choiceClicked: string) => {
    if (!isLocked) {
      setSelectedChoice(choiceClicked);
      setDisplayChoice(choiceClicked);
      onChoice();
    }
  };

  return (
    <>
      <div className="flex-row flex items-center justify-center">
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
        <div className="flex-col flex items-center justify-start bg-nafl-grey-700 lg:w-[530px] w-full rounded-3xl overflow-hidden h-[269px] relative">
          <div className="lg:w-[600px] w-[180%] h-[240px]">
            {rpsVideoArray.map(({ hand, result: vidResult, variant }, idx) => (
              <video
                playsInline={true}
                preload={selectedChoice === hand ? "auto" : "metadata"}
                className={isVideoHidden(variant, hand, vidResult)}
                key={hand + vidResult + variant}
                ref={(ref) => {
                  videosRef.current[idx] = ref;
                }}
                onEnded={() => {
                  if (result === "win") {
                    toast.success("You won RPS");
                  }
                  if (isLocked) {
                    setDisplayChoice("");
                    triggerUnlock();
                  }
                }}
              >
                <source
                  src={`/static/rps/${hand}/${vidResult}${variant}.mp4`}
                  type="video/mp4"
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
              <source src="/static/rps/waiting.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="flex items-center bg-nafl-aqua-500 h-[50px] px-[20px] flex-row justify-between absolute bottom-0 w-full">
            <div className="flex flex-col items-start justify-center mt-[5px]">
              <p className="text-[12px] leading-[100%] font-face-bebas">
                Starting in
              </p>
              <div className="text-[25px] leading-[100%]">
                {timeleft} {""}
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

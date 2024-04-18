import { useEffect, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { GameContainer } from "@type/GameSection";

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
      <div className="flex-row flex mt-5">
        <div className="flex-col flex gap-2 -mr-4 z-10 pt-4 w-[155px] xs:hidden sm:hidden md:hidden lg:flex">
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
                    alert("You won RPS");
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
          <div className="bg-nafl-aqua-500 h-50 pb-1 px-4 flex-row flex justify-between">
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

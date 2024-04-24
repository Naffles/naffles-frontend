import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { GameContainer } from "@type/GameSection";
import toast from "react-hot-toast";
import { MdOpacity } from "react-icons/md";

const coinTossArray = [
  { number: 0, face: "heads", fileName: "doge" },
  { number: 1, face: "heads", fileName: "pepe" },
  { number: 2, face: "heads", fileName: "shib" },
  { number: 3, face: "heads", fileName: "wif" },
  { number: 0, face: "tails", fileName: "btc" },
  { number: 1, face: "tails", fileName: "degen" },
  { number: 2, face: "tails", fileName: "eth" },
  { number: 3, face: "tails", fileName: "sol" },
];

export const CoinToss = (props: GameContainer) => {
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
  const [coin, setCoin] = useState(0);
  const [hideVid, setHideVid] = useState(true);

  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const winningChoice = useCallback(
    (result: string) =>
      selectedChoice && result
        ? choices.find((value) =>
            result === "win"
              ? value === selectedChoice
              : value !== selectedChoice
          )
        : null,
    [choices, selectedChoice, result]
  );

  useEffect(() => {
    if (result && isLocked && timeleft === 0) {
      setHideVid(false);
      const coinNumber = Math.floor(Math.random() * 4);
      setCoin(coinNumber);
      const refIndex = coinTossArray.findIndex(
        (item) =>
          item.number === coinNumber && item.face === winningChoice(result)
      );
      videosRef?.current[refIndex]?.play();
    }
  }, [result, isLocked, timeleft, winningChoice]);

  const isVideoHidden = (coinVid: number, faceVid: string) => {
    if (coinVid === coin && faceVid === winningChoice(result)) return "";
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
      <div className="flex-row flex mt-[45px]">
        <div className="flex-col gap-2 -mr-4 z-10 pt-[52px] w-[155px] hidden lg:flex">
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
          <div className="lg:w-[600px] w-[180%] h-[240px] relative flex items-center justify-center">
            {coinTossArray.map(({ number, face, fileName }, idx) => (
              <video
                playsInline={true}
                preload="auto"
                muted
                className={`${isVideoHidden(number, face)} absolute top-0 ${hideVid ? "opacity-0" : "opacity-100"}`}
                key={fileName + number}
                ref={(ref) => {
                  videosRef.current[idx] = ref;
                }}
                onEnded={() => {
                  if (selectedChoice === winningChoice(result)) {
                    toast.success("You won Coin Toss");
                  }
                  if (isLocked) {
                    setDisplayChoice("");
                    triggerUnlock();
                  }
                  setHideVid(true);
                }}
              >
                <source
                  src={`/static/coin-toss/${face}/${fileName}.webm`}
                  type="video/webm"
                />
              </video>
            ))}
            <video
              playsInline={true}
              preload="auto"
              autoPlay
              loop
              className={`absolute top-0`}
            >
              <source src="/static/coin-toss/waiting.webm" type="video/webm" />
            </video>
          </div>
          <div className="flex items-center bg-nafl-purple h-[50px] px-[20px] flex-row justify-between absolute bottom-0 w-full">
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
            size="lg"
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

import { useEffect, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { GameContainer } from "@type/GameSection";

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
  const { timeleft, winningChoice, isLocked, onChoice } = props;
  const [selectedFace, setSelectedFace] = useState("");
  const [coin, setCoin] = useState(0);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (winningChoice && !isLocked) {
      const coinNumber = Math.floor(Math.random() * 4);
      setCoin(coinNumber);
      const refIndex = coinTossArray.findIndex(
        (item) => item.number === coinNumber && item.face === winningChoice
      );
      videosRef?.current[refIndex]?.play();
      console.log(refIndex);
    }
  }, [winningChoice, isLocked]);

  const isVideoHidden = (coinVid: number, faceVid: string) => {
    if (coinVid === coin && faceVid === winningChoice) return "";
    return "hidden";
  };
  const handleChoiceClick = (faceClicked: string) => {
    if (!isLocked) {
      setSelectedFace(faceClicked);
      onChoice();
    }
  };

  return (
    <div className="flex-row flex">
      <div className="flex-col flex gap-4 -mr-4 z-10 pt-4  w-[155px]">
        <Button
          size="lg"
          variant={selectedFace === "heads" ? "secondary" : "primary"}
          label="Heads"
          onClick={() => handleChoiceClick("heads")}
          width="span"
        >
          Heads
        </Button>
        <Button
          size="lg"
          variant={selectedFace === "tails" ? "secondary" : "primary"}
          label="Tails"
          onClick={() => handleChoiceClick("tails")}
          width="span"
        >
          Tails
        </Button>
      </div>
      <div className="flex-col flex bg-nafl-grey-700 w-[500px] rounded-3xl overflow-hidden">
        <div className="h-[188px]">
          {coinTossArray.map(({ number, face, fileName }, idx) => (
            <video
              preload="auto"
              muted
              className={isVideoHidden(number, face)}
              key={fileName + number}
              ref={(ref) => {
                videosRef.current[idx] = ref;
              }}
              onEnded={() => {
                !isLocked && setSelectedFace("");
              }}
            >
              <source
                src={`/static/coin-toss/${face}/${fileName}.webm`}
                type="video/webm"
              />
            </video>
          ))}
          <video
            preload="auto"
            autoPlay
            loop
            className={winningChoice ? "hidden" : ""}
          >
            <source src="/static/coin-toss/waiting.webm" type="video/webm" />
          </video>
        </div>
        <div className="bg-[#DC2ABF] h-50 pb-1 px-4 flex-row flex justify-between">
          <div className="text-md leading-tight">
            Starting in
            <br />
            <div className="text-xl leading-tight">{timeleft} sec</div>
          </div>
          <div className="flex items-center text-lg">PLAY & EARN</div>
        </div>
      </div>
    </div>
  );
};

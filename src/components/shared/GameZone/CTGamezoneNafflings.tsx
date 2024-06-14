import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";
import { CircularProgress, divider } from "@nextui-org/react";
import GameZoneChangeBet from "./GameZoneChangeBet";
import useGame from "@components/utils/gamezone";
import { io } from "socket.io-client";
import { useUser } from "@blockchain/context/UserContext";
import toast from "react-hot-toast";
import { FaBitcoin, FaEthereum, FaVolumeMute } from "react-icons/fa";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { TbCurrencySolana } from "react-icons/tb";
import axios from "@components/utils/axios";

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

const DEFAULT_TIMER = 30;

export const CTGamezoneNafflings = () => {
  const [timeleft, setTimeleft] = useState(DEFAULT_TIMER);
  const [result, setResult] = useState("");
  const [lastResult, setLastResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [stopTimeListen, setStopTimeListen] = useState<boolean>(false);
  const [lastWinningChoice, setLastWinningChoice] = useState<string>("");
  //ADDED

  const { socket, user } = useUser();
  const { reloadProfile } = useBasicUser();
  const currentGameMode = useGame((state) => state.mode);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setChangingBet = useGame((state) => state.setChangingBet);
  const setCurrentBetOdds = useGame((state) => state.setBetOdds);
  const setCurrentCreatorBuyIn = useGame((state) => state.setCreatorBuyIn);
  const setCurrentChallengerBuyIn = useGame(
    (state) => state.setChallengerBuyIn
  );
  const setCurrentPayout = useGame((state) => state.setPayout);

  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showResultUI, setShowResultUI] = useState<boolean>(false);

  const [requestedBetAmount, setRequestedBetAmount] = useState<string | null>();
  const [requestedBetOdds, setRequestedBetOdds] = useState<string | null>();
  const [requestedTokenType, setRequestedTokenType] = useState<string | null>();
  const [showAcceptChangeBet, setShowAcceptChangeBet] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [requestPlayAgain, setRequestPlayAgain] = useState(false);

  const GameResultMessage = ({
    result,
  }: {
    result: string;
  }): React.JSX.Element =>
    result == "win" ? (
      <>
        <div className="flex flex-col items-center justify-center w-full mt-[50px]">
          <p className="font-face-bebas text-nafl-sponge-500 text-[60px] leading-[100%] text-center">
            Victory!
          </p>
          <p className="font-face-bebas text-nafl-sponge-500 text-[24px] leading-[100%] text-center">
            Waiting for opponent to make the call...
          </p>
        </div>

        <div className="flex items-center justify-center w-full mt-[10px]">
          <button className="flex items-center justify-center px-[61px] h-[70px] rounded-[8px] bg-[#DC2ABF]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-nafl-white text-[19px] leading-[100%] font-bold">
                BRAG ON X
              </p>
              <p className="text-nafl-white text-[14px] leading-[100%] font-bold">
                EARN ?? POINTS
              </p>
            </div>
          </button>
        </div>
      </>
    ) : result == "lose" ? (
      <div className="flex flex-col items-center justify-center w-full mt-[50px]">
        <p className="font-face-bebas text-nafl-sponge-500 text-[60px] leading-[100%] text-center">
          NEARLY HAD IT!
        </p>
        <p className="font-face-bebas text-nafl-sponge-500 text-[24px] leading-[100%] text-center">
          It’s your turn to Win. <br />
          Choose <span className="text-nafl-white font-face-bebas">Heads </span>
          or <span className="text-nafl-white font-face-bebas">tails </span>
        </p>
      </div>
    ) : (
      <div></div>
    );

  const handleVideoEnd = () => {
    reloadProfile();
    setShowResultUI(true);
    setShowVideo(false);
    setResult(lastResult);
    setResults((oldData) => [...oldData, lastWinningChoice]);
    setSelectedChoice("");
  };

  const playAgain = () => {
    setResult("");
    setSelectedChoice("");
    setShowResultUI(false);
  };

  const leaveGame = () => {
    setCurrentScreen("main");
  };

  useEffect(() => {
    muteVideo
      ? toast("Video Muted", {
          duration: 3000,
          icon: "🔇",
        })
      : toast("Video Unmuted", {
          duration: 3000,
          icon: "🔊",
        });
  }, [muteVideo]);

  const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const triggerCTGame = async (choice: string) => {
    setSelectedChoice(choice);

    try {
      const response = await axios.post("game/demo/cointoss");

      let responseData = response.data;

      if (responseData.statusCode == 200) {
        // toast.success(responseData.data.message);
        setResult("");
        console.log(responseData.data);
        setLastResult(responseData.data.result);
        setLastWinningChoice(
          responseData.data.result == "win"
            ? choice
            : choice == "heads"
              ? "tails"
              : "heads"
        );
        setShowVideo(true);
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex-row flex items-center justify-center">
        <div className="flex-col flex items-center justify-start bg-nafl-grey-700 lg:w-[530px] w-full rounded-3xl overflow-hidden aspect-[2.5/1] relative">
          <div className="w-[108%] aspect-[2.5/1]">
            {lastResult && showVideo && (
              <video
                playsInline={true}
                autoPlay
                onEnded={handleVideoEnd}
                onClick={() => setMuteVideo(!muteVideo)}
                muted={muteVideo}
              >
                <source
                  src={`https://storage.googleapis.com/naffles-public-videos/coin-toss/${selectedChoice}/${lastResult}${randomIntFromInterval(1, 4)}.webm`}
                  type={`video/webm`}
                />
              </video>
            )}
            <video
              className={`${showVideo ? "hidden" : "flex"}`}
              playsInline={true}
              preload="auto"
              autoPlay
              loop
              onClick={() => setMuteVideo(!muteVideo)}
              muted={showVideo || muteVideo}
            >
              <source
                src={`https://storage.googleapis.com/naffles-public-videos/coin-toss/waiting.webm`}
                type={`video/webm`}
              />
            </video>
          </div>

          <div
            className={`flex items-center justify-center w-[30px] h-[30px] rounded-[10px] bg-black/50 duration-500 ${muteVideo ? "opacity-100" : "opacity-0"}`}
          >
            <FaVolumeMute className="text-[20px] text-nafl-sponge-500" />
          </div>
        </div>
      </div>

      {/* MIDDLE PART */}

      <div className="flex w-full flex-col items-between justify-center duration-500 gap-[6px]">
        <div className="flex flex-row items-center justify-between">
          <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
            HEAD OR TAILS?
          </p>
          {results && (
            <div className="flex flex-row items-center justify-end gap-[5px]">
              <p className="text-[14px] text-nafl-white">Results:</p>
              {results?.map((item, index) => (
                <img
                  key={index}
                  src={`/static/${item}-coin.png`}
                  alt="Coin Side Image"
                  className="w-[30px] object-contain"
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
      </div>

      {result && (
        <div
          className={`w-full flex flex-col items-between justify-center duration-500 ${showResultUI ? "opacity-100" : "opacity-0"}`}
        >
          <GameResultMessage result={result} />
        </div>
      )}

      {!selectedChoice && (
        <div className={`flex flex-row items-center justify-center gap-[14px]`}>
          <button
            onClick={() => leaveGame()}
            className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
          >
            <p className="text-[#fff] text-[18px] font-bold">LEAVE GAME</p>
          </button>

          <>
            <button
              onClick={() => triggerCTGame("heads")}
              className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
            >
              <p className="text-[#fff] text-[18px] font-bold">HEADS</p>
            </button>
            <button
              onClick={() => triggerCTGame("tails")}
              className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
            >
              <p className="text-[#fff] text-[18px] font-bold">TAILS</p>
            </button>
          </>
        </div>
      )}
    </>
  );
};

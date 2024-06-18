import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";
import { CircularProgress, divider } from "@nextui-org/react";
import GameZoneChangeBet from "./GameZoneChangeBet";
import useGame from "@components/utils/gamezone";
import { io } from "socket.io-client";
import { useUser } from "@blockchain/context/UserContext";
import toast from "react-hot-toast";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { TbCurrencySolana } from "react-icons/tb";
import axios from "@components/utils/axios";
import { TwitterShareButton } from "react-share";

const DEFAULT_TIMER = 30;

export const RPSGamezoneNafflings = () => {
  const [timeleft, setTimeleft] = useState(DEFAULT_TIMER);
  const [result, setResult] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");

  //ADDED

  const { socket, user } = useUser();
  const { reloadProfile } = useBasicUser();
  const currentGameMode = useGame((state) => state.mode);
  const currentCoinType = useGame((state) => state.coinType);
  const currentCreatorBuyIn = useGame((state) => state.creatorBuyIn);
  const currentChallengerBuyIn = useGame((state) => state.challengerBuyIn);
  const currentOdds = useGame((state) => state.betOdds);
  const currentGameId = useGame((state) => state.gameId);
  // const currentDefaultChosen = useGame((state) => state.defaultChosen);
  const changingBet = useGame((state) => state.changingBet);
  const currentPayout = useGame((state) => state.payout);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setChangingBet = useGame((state) => state.setChangingBet);
  const setCurrentCreatorBuyIn = useGame((state) => state.setCreatorBuyIn);
  const setCurrentChallengerBuyIn = useGame(
    (state) => state.setChallengerBuyIn
  );
  const setCurrentBetOdds = useGame((state) => state.setBetOdds);
  const setCurrentPayout = useGame((state) => state.setPayout);

  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showResultUI, setShowResultUI] = useState<boolean>(false);
  const [showWaitingReplayUI, setshowWaitingReplayUI] = useState(false);

  const [requestedBetAmount, setRequestedBetAmount] = useState<string | null>();
  const [requestedBetOdds, setRequestedBetOdds] = useState<string | null>();
  const [requestedTokenType, setRequestedTokenType] = useState<string | null>();
  const [showAcceptChangeBet, setShowAcceptChangeBet] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);

  const GameResultMessage = ({
    result,
  }: {
    result: string;
  }): React.JSX.Element =>
    result == "win" ? (
      <>
        <p className="font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
          YOU WON! PLAY AGAIN?
        </p>
        <div className="flex items-center justify-center h-[70px] w-[200px] rounded-[8px] bg-[#DC2ABF]">
          <TwitterShareButton
            url="naffles.com"
            via="naffles"
            title="I won a Naffles Game"
            hashtags={["nafflesWin"]}
            style={{ width: "100%", height: "100%" }}
          >
            <div className="flex flex-col items-center justify-center">
              <p className="text-nafl-white text-[19px] leading-[100%] font-bold">
                BRAG ON X
              </p>
              <p className="text-nafl-white text-[14px] leading-[100%] font-bold">
                EARN ?? POINTS
              </p>
            </div>
          </TwitterShareButton>
        </div>
      </>
    ) : result == "lose" ? (
      <p className="font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
        YOU GOT CRUSHED! <br /> REMATCH?
      </p>
    ) : (
      <div></div>
    );

  const handleVideoEnd = () => {
    if (result == "draw") {
      setResult("");
      toast("Match Draw! Restarting match", {
        duration: 5000,
        icon: "🔥",
      });
      setSelectedChoice("");
    } else {
      reloadProfile();
      setShowResultUI(true);
    }
    setShowVideo(false);
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

  const triggerRPSGame = async (choice: string) => {
    setSelectedChoice(choice);

    try {
      const response = await axios.post("game/demo/rock-paper-scissors");

      let responseData = response.data;

      if (responseData.statusCode == 200) {
        // toast.success(responseData.data.message);
        console.log(responseData.data);
        setResult(responseData.data.result);
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
            {result && showVideo && (
              <video
                playsInline={true}
                autoPlay
                onEnded={handleVideoEnd}
                onClick={() => setMuteVideo(!muteVideo)}
                muted={muteVideo}
              >
                <source
                  src={`https://storage.googleapis.com/naffles-public-videos/rps/${selectedChoice}/${result}${randomIntFromInterval(1, 3)}.webm`}
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
                src={`https://storage.googleapis.com/naffles-public-videos/rps/waiting.webm`}
                type={`video/webm`}
              />
            </video>
          </div>
        </div>
      </div>

      <div
        className={`w-full flex flex-col items-center justify-center duration-500 ${showResultUI ? "opacity-100" : "opacity-0"}`}
      >
        <GameResultMessage result={result} />
      </div>

      {!result ? (
        <>
          {" "}
          <div className="flex flex-col w-full gap-[4px]">
            <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
              CHOOSE YOUR WEAPON!
            </p>
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            <div className="flex flex-row flex-wrap items-center justify-center gap-[23px] mt-[10px]">
              <button
                onClick={() => triggerRPSGame("rock")}
                disabled={timeleft <= 0}
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 uppercase ${
                  selectedChoice == "rock"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">ROCK</p>
              </button>

              <p className="text-[#fff] text-[18px]">OR</p>

              <button
                onClick={() => triggerRPSGame("paper")}
                disabled={timeleft <= 0}
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 uppercase ${
                  selectedChoice == "paper"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">PAPER</p>
              </button>

              <p className="text-[#fff] text-[18px]">OR</p>

              <button
                onClick={() => triggerRPSGame("scissors")}
                disabled={timeleft <= 0}
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 uppercase ${
                  selectedChoice == "scissors"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">SCISSORS</p>
              </button>
            </div>
          </div>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        </>
      ) : (
        <div className="flex flex-col w-full ">
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          {result != "draw" && (
            <div
              className={`flex flex-row flex-wrap items-center justify-center gap-[14px] ${showResultUI ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => leaveGame()}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px] font-bold">LEAVE GAME</p>
              </button>
              <button
                onClick={() => playAgain()}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] text-[18px] font-bold">PLAY AGAIN</p>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

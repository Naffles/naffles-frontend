import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@components/shared/Button";
import { BaseGameProps } from "@type/GameSection";
import { CircularProgress, divider } from "@nextui-org/react";
import GameZoneChangeBet from "./GameZoneChangeBet";
import useGame from "@components/utils/gamezone";
import { io } from "socket.io-client";
import { useUser } from "@blockchain/context/UserContext";
import toast from "react-hot-toast";

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

const DEFAULT_TIMER = 10;

export const RPSGamezone = () => {
  const [timeleft, setTimeleft] = useState(DEFAULT_TIMER);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [result, setResult] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [displayChoice, setDisplayChoice] = useState("");
  const [displayVideo, setDisplayVideo] = useState<GameVideo | null>(null);

  //ADDED

  const { socket, user } = useUser();
  const currentGameMode = useGame((state) => state.mode);
  const currentCoinType = useGame((state) => state.coinType);
  const currentBetAmount = useGame((state) => state.betAmount);
  const currentOdds = useGame((state) => state.betOdds);
  const currentGameId = useGame((state) => state.gameId);
  const currentDefaultChosen = useGame((state) => state.defaultChosen);
  const changingBet = useGame((state) => state.changingBet);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setChangingBet = useGame((state) => state.setChangingBet);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showResultUI, setShowResultUI] = useState<boolean>(false);
  const [showWaitingReplayUI, setshowWaitingReplayUI] = useState(false);

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
      </>
    ) : result == "lose" ? (
      <p className="font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
        YOU GOT CRUSHED! <br /> REMATCH?
      </p>
    ) : (
      <div></div>
    );

  const setPayOut = (betAmount: string | null, betOdds: string | null) => {
    let betAmountValue = 0;
    let betOddsValue = 0;

    if (betAmount) betAmountValue = parseFloat(betAmount);
    if (betOdds) betOddsValue = parseFloat(betOdds);

    return betAmountValue * betOddsValue;
  };

  useEffect(() => {
    socket?.on("timerUpdate", (data) => {
      setTimeleft(data.timeLeft);
    });

    socket?.on("gameResult", (data) => {
      console.log("gameResult socket data:", data);

      if (data.challengerChoice == data.creatorChoice) {
        setResult("draw");
      } else {
        data.winner == user?.id ? setResult("win") : setResult("lose");
      }

      setShowVideo(true);
    });

    socket?.on("error", (data) => {
      console.log("error data:", data);
    });

    socket?.on("gameStarted", (data: any) => {
      console.log("gameStarted data: ", data);
      setResult("");
      setShowResultUI(false);
      setshowWaitingReplayUI(false);
      if (data.initialChoices) {
        currentGameMode == "host"
          ? setSelectedChoice(data.initialChoices.creator)
          : setSelectedChoice(data.initialChoices.challenger);
      }
    });
  }, [socket]);

  useEffect(() => {
    currentDefaultChosen && setSelectedChoice(currentDefaultChosen);
  }, [currentDefaultChosen]);

  const handleChoiceClick = (choiceClicked: string) => {
    setSelectedChoice(choiceClicked);
    console.log("Change Choice currentGameId: ", currentGameId);
    console.log("Change Choice userId: ", user?.id);
    if (currentGameId && user?.id) {
      socket?.emit("playerChoice", {
        gameId: currentGameId,
        userId: user?.id,
        choice: choiceClicked,
      });
      console.log("choiceSelected: ", choiceClicked);
    }
  };

  const handleVideoEnd = () => {
    if (result == "draw") {
      socket?.emit("rematch", {
        gameId: currentGameId,
        userId: user?.id,
      });
      setResult("");
      toast("Match Draw! Restarting match", {
        duration: 5000,
        icon: "🔥",
      });
    } else {
      setShowResultUI(true);
    }
    setShowVideo(false);
  };

  const playAgain = () => {
    socket?.emit("rematch", {
      gameId: currentGameId,
      userId: user?.id,
    });
    setResult("");
    setshowWaitingReplayUI(true);
  };

  const leaveGame = () => {
    // socket?.emit("rematch", {
    //   gameId: currentGameId,
    //   userId: user?.id,
    // });

    setCurrentScreen("main");
  };

  return (
    <>
      <div className="flex-row flex items-center justify-center">
        <div className="flex-col flex items-center justify-start bg-nafl-grey-700 lg:w-[530px] w-full rounded-3xl overflow-hidden h-full relative">
          <div className="lg:w-[600px] w-[180%] h-full">
            {result && showVideo && (
              <video
                playsInline={true}
                // preload={selectedChoice === choice ? "auto" : "metadata"}
                // key={choice + vidResult + variant}
                // ref={(ref) => {
                //   videosRef.current[idx] = ref;
                // }}
                autoPlay
                onEnded={handleVideoEnd}
                muted={true}
              >
                <source
                  // src={`${basePath}${selectedChoice}/${result}1.${extension}`}
                  src={`/static/rps/${selectedChoice}/${result}1.mp4`}
                  type={`video/mp4`}
                />
              </video>
            )}
            <video
              className={`${showVideo ? "hidden" : "flex"}`}
              playsInline={true}
              preload="auto"
              autoPlay
              loop
              muted
            >
              <source src={`/static/rps/waiting.mp4`} type={`video/mp4`} />
            </video>
          </div>
        </div>
      </div>

      <div
        className={`w-full flex flex-col items-center justify-center duration-500 ${showResultUI ? "opacity-100" : "opacity-0"}`}
      >
        <GameResultMessage result={result} />
      </div>
      {showWaitingReplayUI && (
        <div className="w-full flex flex-col items-center justify-center mb-[40px]">
          <p className="text-[24px] text-nafl-white">
            Waiting for Challenger ...
          </p>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          <div className="flex flex-row items-center justify-center gap-[14px]">
            <button
              onClick={() => leaveGame()}
              className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
            >
              <p className="text-[#fff] text-[18px] font-bold">LEAVE GAME</p>
            </button>
          </div>
        </div>
      )}
      {changingBet && <GameZoneChangeBet />}
      {result && !changingBet && (
        <div className="flex flex-row items-center justify-center gap-[20px] mt-[20px]">
          <p className="text-[#989898] text-[12px]">
            Payout:{" "}
            <a href="" className="font-bold text-[#fff] font-face-roboto">
              {currentBetAmount} {currentCoinType}
            </a>
          </p>
          <p className="text-[#989898] text-[12px]">
            Buy-in:{" "}
            <a href="" className="font-bold text-[#fff] font-face-roboto">
              {setPayOut(currentBetAmount, currentOdds)} {currentCoinType}
            </a>
          </p>
        </div>
      )}

      {!showWaitingReplayUI &&
        (!result ? (
          <>
            {" "}
            <div className="flex flex-col w-full gap-[4px]">
              <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                CHOOSE YOUR WEAPON!
              </p>
              <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
              <div className="flex flex-row items-center justify-center gap-[23px] mt-[10px]">
                {/* {choices.map((choice, index) => (
                <>
                  <button
                    key={index}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={timeleft <= 0}
                    className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 uppercase ${
                      selectedChoice == choice
                        ? "border-nafl-purple bg-nafl-purple"
                        : "border-nafl-sponge-500 bg-transparent"
                    }`}
                  >
                    <p className="text-[#fff] text-[18px]">{choice}</p>
                  </button>
                  {choices.length - 1 != index && (
                    <p className="text-[#fff] text-[18px]">OR</p>
                  )}
                </>
              ))} */}

                <button
                  onClick={() => handleChoiceClick("rock")}
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
                  onClick={() => handleChoiceClick("paper")}
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
                  onClick={() => handleChoiceClick("scissors")}
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
            <div className="flex flex-col py-[30px] items-center relative w-full">
              <div className="flex items-center justify-center scale-x-[-1] relative">
                <CircularProgress
                  aria-label="Gamezone countdown progress"
                  classNames={{
                    svg: "w-[160px] h-[160px] drop-shadow-md",
                    indicator: "stroke-[#00e0df]",
                    track: "stroke-[#ee26ff]",
                    value: "text-3xl font-semibold text-white",
                  }}
                  value={timeleft}
                  minValue={0}
                  maxValue={DEFAULT_TIMER}
                  strokeWidth={4}
                  showValueLabel={false}
                />
                <div
                  // onClick={() => setCountdownTimer(200)}
                  className="flex flex-col items-center justify-center absolute top-[30px] h-[100px] w-[100px] rounded-full bg-[#383838] scale-x-[-1]"
                >
                  <p className="text-[#fff] font-face-bebas text-[50px] leading-[100%]">
                    {timeleft}
                  </p>
                </div>
              </div>
              <p className="text-[#fff] text-center text-[16px] mt-[0px] leading-[100%] font-face-bebas">
                SECONDS
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-[20px]">
              <p className="text-[#989898] text-[12px]">
                Payout:{" "}
                <a href="" className="font-bold text-[#fff] font-face-roboto">
                  {currentBetAmount} {currentCoinType}
                </a>
              </p>
              <p className="text-[#989898] text-[12px]">
                Buy-in:{" "}
                <a href="" className="font-bold text-[#fff] font-face-roboto">
                  {setPayOut(currentBetAmount, currentOdds)} {currentCoinType}
                </a>
              </p>
            </div>
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          </>
        ) : currentGameMode == "host" && !changingBet ? (
          <div className="flex flex-col w-full ">
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            {result != "draw" && (
              <div className="flex flex-row items-center justify-center gap-[14px]">
                <button
                  onClick={() => leaveGame()}
                  className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
                >
                  <p className="text-[#fff] text-[18px] font-bold">
                    LEAVE GAME
                  </p>
                </button>
                <button
                  onClick={() => playAgain()}
                  className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
                >
                  <p className="text-[#000] text-[18px] font-bold">
                    PLAY AGAIN
                  </p>
                </button>
                <a
                  onClick={() => setChangingBet(true)}
                  className="font-face-roboto text-[12px] italic underline cursor-pointer"
                >
                  Change Bets
                </a>
              </div>
            )}
          </div>
        ) : (
          !changingBet && (
            <div className="flex flex-col w-full ">
              <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
              {result != "draw" && (
                <div className="flex flex-row items-center justify-center gap-[14px]">
                  <button
                    onClick={() => leaveGame()}
                    className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
                  >
                    <p className="text-[#fff] text-[18px] font-bold">
                      LEAVE GAME
                    </p>
                  </button>
                  <button
                    onClick={() => playAgain()}
                    className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
                  >
                    <p className="text-[#000] text-[18px] font-bold">
                      PLAY AGAIN
                    </p>
                  </button>
                </div>
              )}
            </div>
          )
        ))}
    </>
  );
};

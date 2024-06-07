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

type GameVideo = {
  variant: number | string;
  result: string;
  choice: string;
};

const DEFAULT_TIMER = 30;

export const CTGamezone = () => {
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
  const currentCoinType = useGame((state) => state.coinType);
  const currentCreatorBuyIn = useGame((state) => state.creatorBuyIn);
  const currentChallengerBuyIn = useGame((state) => state.challengerBuyIn);
  const currentPayout = useGame((state) => state.payout);
  const currentGameId = useGame((state) => state.gameId);
  const currentDefaultChosen = useGame((state) => state.defaultChosen);
  const changingBet = useGame((state) => state.changingBet);

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

  const setPayOut = (betAmount: string | null, betOdds: string | null) => {
    let betAmountValue = 0;
    let betOddsValue = 0;

    if (betAmount) betAmountValue = parseFloat(betAmount);
    if (betOdds) betOddsValue = parseFloat(betOdds);

    return betAmountValue * betOddsValue;
  };

  useEffect(() => {
    const timerUpdater = (data: any) => {
      setTimeleft(data.timeLeft);
    };

    socket?.on("timerUpdate", timerUpdater);

    const gameResult = (data: any) => {
      setResult("");
      setRequestPlayAgain(false);
      console.log("gameResult socket data:", data);
      data.winner == user?.id ? setLastResult("win") : setLastResult("lose");
      data.assignedChoice && setSelectedChoice(data.assignedChoice);
      setLastWinningChoice(data.winnerChoice);
      setShowVideo(true);
      setStopTimeListen(true);
    };

    socket?.on("gameResult", gameResult);

    // socket?.on("error", (data) => {
    //   console.log("error data:", data);
    // });

    const gameZoneStart = (data: any) => {
      console.log("gameStarted data: ", data);
      setResult("");
      setRequestPlayAgain(false);
      setShowResultUI(false);
      if (data.initialChoices) {
        currentGameMode == "host"
          ? setSelectedChoice(data.initialChoices.creator)
          : setSelectedChoice(data.initialChoices.challenger);
      }
    };

    socket?.on("gameStarted", gameZoneStart);

    const playerHasLeft = (data: any) => {
      console.log("player left data:", data);
      setSelectedChoice("");
      setCurrentScreen("main");
    };

    socket?.on("playerLeft", playerHasLeft);

    const betUpdates = (data: any) => {
      console.log("Bet Updated: ", data);
      if (data.status) {
        setCurrentCreatorBuyIn(data.game.betAmount);
        setCurrentChallengerBuyIn(data.game.challengerBuyInAmount);
        setCurrentPayout(data.game.payout);
        setCurrentBetOdds(data.game.odds);
        toast.dismiss();
        toast.success("Bet successfully changed");
      } else {
        toast.dismiss();
        toast.error("Opposing player has rejected the change bet request");
      }
      setShowAcceptChangeBet(false);
    };

    socket?.on("betUpdated", betUpdates);

    const betRequest = (data: any) => {
      console.log("Bet Requested: ", data);
      setRequestedBetAmount(data.game.betAmount);
      setRequestedTokenType(data.game.tokenType);
      setRequestedBetOdds(data.game.odds);
      setShowAcceptChangeBet(true);
    };

    socket?.on("betRequest", betRequest);

    return () => {
      socket?.off("timerUpdate", timerUpdater);
      socket?.off("gameResult", gameResult);
      socket?.off("gameStarted", gameZoneStart);
      socket?.off("playerLeft", playerHasLeft);
      socket?.off("betUpdated", betUpdates);
      socket?.off("betRequest", betRequest);
    };
  }, [socket]);

  useEffect(() => {
    currentDefaultChosen && setSelectedChoice(currentDefaultChosen);
  }, [currentDefaultChosen]);

  useEffect(() => {
    !stopTimeListen && timeleft <= 0 && leaveGame();
    console.log(timeleft);
  }, [timeleft, stopTimeListen]);

  const handleChoiceClick = (choiceClicked: string) => {
    setSelectedChoice(choiceClicked);
    console.log("Change Choice currentGameId: ", currentGameId);
    console.log("Change Choice userId: ", user?.id);
    if (currentGameId && user?.id) {
      socket?.emit("playerChoice", {
        gameId: currentGameId,
        choice: choiceClicked,
      });
      console.log("choiceSelected: ", choiceClicked);
    }
  };

  const handleVideoEnd = () => {
    reloadProfile();
    setResult(lastResult);
    setShowResultUI(true);
    setShowVideo(false);
    setResults((oldData) => [...oldData, lastWinningChoice]);
    setSelectedChoice("");
  };

  const playAgain = () => {
    socket?.emit("rematch", {
      gameId: currentGameId,
    });
    setResult("");
    setRequestPlayAgain(true);
  };

  const leaveGame = () => {
    socket?.emit("leaveGame", { gameId: currentGameId });

    setCurrentScreen("main");
  };

  const acceptBet = (gameId: string) => {
    console.log("Bet Accepted");

    socket?.emit("acceptBetChangeRequest", {
      gameId: gameId,
    });
  };

  const rejectBet = (gameId: string) => {
    console.log("Bet Rejected");
    socket?.emit("rejectBetChangeRequest", {
      gameId: gameId,
    });
  };

  useEffect(() => {
    toast.dismiss();
    muteVideo
      ? toast("Video Muted", {
          duration: 5000,
          icon: "🙊",
          // icon: "🔇",
        })
      : toast("Video Unmuted", {
          duration: 5000,
          icon: "🔊",
        });
  }, [muteVideo]);

  const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const currencyIconReturner = (type: string) => {
    if (type == "eth") {
      return <FaEthereum className="text-[#fff]" />;
    } else if (type == "btc") {
      return <FaBitcoin className="text-[#fff]" />;
    } else if (type == "sol") {
      return <TbCurrencySolana className="text-[#fff]" />;
    } else if (type == "naff") {
      return (
        <img
          src="/static/naff-icon.png"
          alt="Bytes Icon"
          className="w-[22px] object-contain"
        />
      );
    } else if (type == "bytes") {
      return (
        <img
          src="/static/bytes-icon.png"
          alt="Bytes Icon"
          className="w-[22px] object-contain"
        />
      );
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

      {showAcceptChangeBet && (
        <div className="w-full flex flex-col items-center justify-center ">
          <div className="flex items-center justify-start w-full">
            <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
              GAME OWNER HAS CHANGED THE BET
            </p>
          </div>

          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          <div className="flex flex-row items-center justify-center w-full my-[80px] gap-[16px]">
            <p className="text-[11px] text-nafl-white">
              Game owner has change the bet to
            </p>
            <div className="flex flex-row items-center justify-center gap-[3px]">
              <FaEthereum className="text-nafl-white text-[20px]" />
              {currencyIconReturner(requestedTokenType ?? "NA")}
              <p className="text-[22px] text-nafl-white font-face-bebas">
                {requestedBetAmount &&
                  requestedTokenType &&
                  tokenValueConversion(requestedBetAmount, requestedTokenType)}
              </p>
            </div>
            <p className="text-[14px] text-nafl-white font-bold">
              at {requestedBetOdds} : 1 odds
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-[20px] mt-[20px]">
            <p className="text-[#989898] text-[12px]">
              Payout:{" "}
              <span className="font-bold text-[#fff] font-face-roboto">
                {tokenValueConversion(currentPayout, currentCoinType)}{" "}
                {currentCoinType}
              </span>
            </p>
            <p className="text-[#989898] text-[12px]">
              Buy-in:{" "}
              <span className="font-bold text-[#fff] font-face-roboto">
                {currentGameMode == "host"
                  ? tokenValueConversion(currentCreatorBuyIn, currentCoinType)
                  : tokenValueConversion(
                      currentChallengerBuyIn,
                      currentCoinType
                    )}{" "}
                {currentCoinType}
              </span>
            </p>
          </div>
          <div className="flex flex-col w-full ">
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            <div
              className={`flex flex-row items-center justify-center gap-[14px] ${showResultUI ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => leaveGame()}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px] font-bold">LEAVE GAME</p>
              </button>
              <button
                onClick={() => currentGameId && rejectBet(currentGameId)}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] text-[18px] font-bold">REJECT</p>
              </button>
              <button
                onClick={() => currentGameId && acceptBet(currentGameId)}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] text-[18px] font-bold">ACCEPT</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {changingBet && <GameZoneChangeBet />}
      {!showAcceptChangeBet &&
        (result ? (
          !changingBet &&
          !showAcceptChangeBet && (
            <div
              className={`w-full flex flex-col items-between justify-center duration-500 ${showResultUI ? "opacity-100" : "opacity-0"}`}
            >
              <div className="flex flex-row items-center justify-between">
                {currentGameMode == "host" && !lastResult ? (
                  <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                    YOU’ve GOT a CHALLENGER!
                  </p>
                ) : (
                  <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                    HEAD OR TAILS?
                  </p>
                )}
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
              <GameResultMessage result={result} />
            </div>
          )
        ) : selectedChoice ? (
          //"wala pang result tas nka pili na"
          <div className="flex flex-col w-full ">
            <div className="flex flex-row items-center justify-between">
              {currentGameMode == "host" && !lastResult ? (
                <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                  YOU’ve GOT a CHALLENGER!
                </p>
              ) : (
                <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                  HEAD OR TAILS?
                </p>
              )}
              {results && (
                <div className="flex flex-row items-center justify-end gap-[5px]">
                  <p className="text-[14px] text-nafl-white">Results:</p>
                  {results?.map((item) => (
                    <img
                      src={`/static/${item}-coin.png`}
                      alt="Coin Side Image"
                      className="w-[30px] object-contain"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            <div className="flex flex-col items-center justify-center gap-[10px] mt-[55px]">
              <p className="text-[24px] text-nafl-white font-face-bebas">
                YOU PICKED
              </p>
              <p className="text-[100px] text-nafl-purple font-face-bebas">
                {selectedChoice}
              </p>
            </div>
          </div>
        ) : (
          // "walang result tas wala pang napili"
          <div className="flex flex-col w-full ">
            <div className="flex flex-row items-center justify-between">
              {currentGameMode == "host" && !lastResult ? (
                <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                  YOU’ve GOT a CHALLENGER!
                </p>
              ) : (
                <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
                  HEADS OR TAILS?
                </p>
              )}
              {results && (
                <div className="flex flex-row items-center justify-end gap-[5px]">
                  <p className="text-[14px] text-nafl-white">Results:</p>
                  {results?.map((item) => (
                    <img
                      src={`/static/${item}-coin.png`}
                      alt="Coin Side Image"
                      className="w-[30px] object-contain"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* MESSAGE PART */}
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            {lastResult == "lose" ||
            (currentGameMode == "host" && !lastResult) ? (
              <div className="flex flex-col items-center justify-center gap-[6px] mt-[40px]">
                <p className="text-[24px] text-nafl-white font-bold leading-[100%]">
                  Choose Heads or Tails
                </p>
                <p className="text-[20px] text-nafl-white leading-[100%]">
                  before the timer tuns out
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-[6px] mt-[40px]">
                <p className="text-[24px] text-nafl-white font-bold leading-[100%]">
                  Waiting for Opponent to choose
                </p>
                <p className="text-[20px] text-nafl-white leading-[100%]">
                  (Note: You get to choose if you lose)
                </p>
              </div>
            )}

            {/* TIMER PART */}

            {!requestPlayAgain && (
              <div className="flex flex-col py-[30px] items-center relative w-full">
                <div className="flex items-center justify-center scale-x-[-1] relative">
                  <CircularProgress
                    aria-label="Gamezone countdown progress"
                    classNames={{
                      svg: "w-[160px] h-[160px] drop-shadow-md",
                      indicator: "stroke-[#00e0df]",
                      track: "stroke-[#ee26ff]",
                      value: "text-3xl font-semibold text-nafl-white",
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
            )}
          </div>
        ))}

      {!changingBet && !showAcceptChangeBet && (
        <>
          <div className="flex flex-row items-center justify-center gap-[20px] mt-[20px]">
            <p className="text-[#989898] text-[12px]">
              Payout:{" "}
              <span className="font-bold text-[#fff] font-face-roboto">
                {tokenValueConversion(currentPayout, currentCoinType)}{" "}
                {currentCoinType}
              </span>
            </p>
            <p className="text-[#989898] text-[12px]">
              Buy-in:{" "}
              <span className="font-bold text-[#fff] font-face-roboto">
                {currentGameMode == "host"
                  ? tokenValueConversion(currentCreatorBuyIn, currentCoinType)
                  : tokenValueConversion(
                      currentChallengerBuyIn,
                      currentCoinType
                    )}{" "}
                {currentCoinType}
              </span>
            </p>
          </div>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        </>
      )}

      {/* BOTTOM PART */}

      {!changingBet && !showAcceptChangeBet && !selectedChoice && (
        <div className={`flex flex-row items-center justify-center gap-[14px]`}>
          <button
            onClick={() => leaveGame()}
            className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
          >
            <p className="text-[#fff] text-[18px] font-bold">LEAVE GAME</p>
          </button>
          {lastResult == "lose" ||
          (currentGameMode == "host" && !lastResult) ? (
            <>
              <button
                onClick={() => handleChoiceClick("heads")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px] font-bold">HEADS</p>
              </button>
              <button
                onClick={() => handleChoiceClick("tails")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px] font-bold">TAILS</p>
              </button>
            </>
          ) : (
            lastResult &&
            !requestPlayAgain && (
              <button
                onClick={() => playAgain()}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px] font-bold">PLAY AGAIN</p>
              </button>
            )
          )}
          {currentGameMode == "host" && (
            <a
              onClick={() => setChangingBet(true)}
              className="font-face-roboto text-[12px] italic underline cursor-pointer"
            >
              Change Bets
            </a>
          )}
        </div>
      )}
    </>
  );
};

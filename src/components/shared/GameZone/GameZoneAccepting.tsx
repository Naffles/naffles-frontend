"use client";

import { useUser } from "@blockchain/context/UserContext";
import useGame from "@components/utils/gamezone";
import { CircularProgress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GameZoneAccepting = () => {
  const { socket, user } = useUser();
  const [countdownTimer, setCountdownTimer] = useState<number>(200);
  const [hostPayout, setHostPayout] = useState<number>(0);

  const currentGameType = useGame((state) => state.type);
  const currentCoinType = useGame((state) => state.coinType);
  const currentBetAmount = useGame((state) => state.creatorBuyIn);
  const currentOdds = useGame((state) => state.betOdds);
  const currentGameId = useGame((state) => state.gameId);
  const currentChallengerId = useGame((state) => state.challengerId);
  const currentPayout = useGame((state) => state.payout);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setBetAmount = useGame((state) => state.setCreatorBuyIn);
  const setBetOdds = useGame((state) => state.setBetOdds);
  const setDefaultChosen = useGame((state) => state.setDefaultChosen);
  const setCurrentGameId = useGame((state) => state.setGameId);
  const setCurrentGameMode = useGame((state) => state.setMode);
  const setCurrentPayout = useGame((state) => state.setPayout);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownTimer((prevCountdown) => prevCountdown - 1);
    }, 1000);

    window.scrollTo(0, 0);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    countdownTimer <= 0 && rejectGame();
  }, [countdownTimer]);

  useEffect(() => {
    const gameStart = (data: any) => {
      console.log("gameStart", data);
      if (data.gameId) {
        setCurrentScreen("ingame");
        data.initialChoices && setDefaultChosen(data.initialChoices.creator);
        setCurrentGameId(data.gameId);
        setCurrentGameMode("host");
      }
    };

    socket?.on("gameStarted", gameStart);

    const CTgameStart = (data: any) => {
      console.log("coinTossGameStarted", data);
      if (data.gameId) {
        setCurrentScreen("ingame");
        data.initialChoices && setDefaultChosen(data.initialChoices.challenger);
        setCurrentGameId(data.gameId);
        setCurrentGameMode("challenger");
      }
    };

    socket?.on("coinTossGameStarted", CTgameStart);

    const cancelMessage = (data: any) => {
      console.log("cancelMessage", data);
      cancelGame();
      toast.error("Other player cancelled request");
    };

    socket?.on("joinRequestCancelled", cancelMessage);

    return () => {
      // socket?.off("coinTossGameStarted", CTgameStart);
      socket?.off("gameStarted", gameStart);
      socket?.off("joinRequestCancelled", cancelMessage);
    };
  }, [socket]);

  const setBuyIn = (betAmount: string | null, betOdds: string | null) => {
    let betAmountValue = 0;
    let betOddsValue = 0;

    if (betAmount) betAmountValue = parseFloat(betAmount);
    if (betOdds) betOddsValue = parseFloat(betOdds);
    let buyIn = betAmountValue / betOddsValue;
    return buyIn + betAmountValue;
  };

  const setPayOut = (betAmount: string | null, betOdds: string | null) => {
    let betAmountValue = 0;
    let betOddsValue = 0;

    if (betAmount) betAmountValue = parseFloat(betAmount);
    if (betOdds) betOddsValue = parseFloat(betOdds);

    return betAmountValue * betOddsValue;
  };

  const cancelGame = () => {
    setCurrentScreen("main");
    setGameType(null);
    setCoinType(null);
    setBetAmount(null);
    setBetOdds(null);
  };

  const acceptGame = () => {
    console.log("accept game data: ", currentGameId, currentChallengerId);
    // if (currentGameType == "Rock, Paper, Scissors") {
    socket?.emit("acceptJoinRequest", {
      gameId: currentGameId,
      challengerId: currentChallengerId,
    });
    // } else {
    //   socket?.emit("acceptJoinRequestCoinToss", {
    //     gameId: currentGameId,
    //     challengerId: currentChallengerId,
    //   });
    // }
  };

  const rejectGame = () => {
    socket?.emit("rejectJoinRequest", {
      gameId: currentGameId,
      challengerId: currentChallengerId,
    });
    cancelGame();
  };

  return (
    <div className="flex flex-col w-[500px] bg-[#383838] rounded-[16px]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[40px] text-[#fff] font-face-bebas">
          You’ve got a challenger!
        </p>
      </div>
      <div className="flex flex-col items-center justify-start py-[25px] gap-[10px]">
        <p className="text-nafl-sponge-500 text-[20px] leading-[100%] font-face-bebas">
          {currentGameType}
        </p>
        <p className="text-nafl-white text-[12px] leading-[100%]">
          Start the game before the timer runs out!
        </p>
        <div className="flex flex-col items-center">
          <p className=" text-[#989898] text-[14px]">
            Your Buy-in:{" "}
            <span className="text-[#fff] font-face-roboto italic">
              {currentBetAmount} {currentCoinType}
            </span>
          </p>
          <p className=" text-[#989898] text-[14px]">
            Your Payout:{" "}
            <span className="text-[#fff] font-face-roboto italic">
              {currentPayout} {currentCoinType}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center relative w-full gap-[10px]">
          <div className="flex items-center justify-center scale-x-[-1] relative">
            <CircularProgress
              aria-label="Gamezone countdown progress"
              classNames={{
                svg: "w-[160px] h-[160px] drop-shadow-md",
                indicator: "stroke-[#00e0df]",
                track: "stroke-[#ee26ff]",
                value: "text-3xl font-semibold text-nafl-white",
              }}
              value={countdownTimer / 2}
              maxValue={100}
              strokeWidth={4}
              showValueLabel={false}
            />
            <div className="flex flex-col items-center justify-center absolute top-[30px] h-[100px] w-[100px] rounded-full bg-[#383838] scale-x-[-1]">
              <p className="text-[#fff] font-face-bebas text-[60px] leading-[100%]">
                {Math.ceil(countdownTimer)}
              </p>
            </div>
          </div>
          <p className="text-[#fff] text-center font-face-bebas text-[16px] mt-[-6px] leading-[100%]">
            SECONDS
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-[20px]">
          <button
            onClick={() => rejectGame()}
            className="flex items-center justify-center w-[183px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 mb-[17px]"
          >
            <p className="text-[#fff] text-[18px] font-bold">REJECT</p>
          </button>
          <button
            onClick={() => currentChallengerId && acceptGame()}
            className="flex items-center justify-center w-[183px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 mb-[17px]"
          >
            <p className="text-[#000] text-[18px] font-bold">ACCEPT</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameZoneAccepting;

"use client";

import { useUser } from "@blockchain/context/UserContext";
import useGame from "@components/utils/gamezone";
import { CircularProgress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GameZoneJoining = () => {
  const { socket } = useUser();
  const [countdownTimer, setCountdownTimer] = useState<number>(200);

  const currentGameType = useGame((state) => state.type);
  const currentCoinType = useGame((state) => state.coinType);
  const currentBetAmount = useGame((state) => state.betAmount);
  const currentOdds = useGame((state) => state.betOdds);
  const currentGameId = useGame((state) => state.gameId);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setBetAmount = useGame((state) => state.setBetAmount);
  const setBetOdds = useGame((state) => state.setBetOdds);
  const setDefaultChosen = useGame((state) => state.setDefaultChosen);
  const setCurrentGameId = useGame((state) => state.setGameId);
  const setCurrentGameMode = useGame((state) => state.setMode);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownTimer((prevCountdown) => prevCountdown - 0.5);
    }, 1000);

    window.scrollTo(0, 0);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    countdownTimer <= 0 &&
      (currentGameId ? cancelGame(currentGameId) : exitGame());
  }, [countdownTimer]);

  useEffect(() => {
    const gameStart = (data: any) => {
      console.log("gameStart", data);
      if (data.gameId) {
        setCurrentScreen("ingame");
        data.initialChoices && setDefaultChosen(data.initialChoices.challenger);
        setCurrentGameId(data.gameId);
        setCurrentGameMode("challenger");
      }
    };

    socket?.on("gameStarted", gameStart);

    const consoleError = (data: any) => {
      console.log(data);
    };
    socket?.on("error", consoleError);

    const rejectMessage = (data: any) => {
      console.log(data);
      toast.error("Host rejected request");
      exitGame();
    };

    socket?.on("joinRequestRejected", rejectMessage);

    return () => {
      socket?.off("gameStarted", gameStart);
      socket?.off("joinRequestRejected", rejectMessage);
    };
  }, [socket]);
  const setPayOut = (betAmount: string | null, betOdds: string | null) => {
    let betAmountValue = 0;
    let betOddsValue = 0;

    if (betAmount) betAmountValue = parseFloat(betAmount);
    if (betOdds) betOddsValue = parseFloat(betOdds);

    return betAmountValue * betOddsValue;
  };

  const cancelGame = (gameId: string) => {
    console.log("gameId:", gameId);
    socket?.emit("cancelJoinRequest", {
      gameId: gameId,
    });
    exitGame();
  };

  const exitGame = () => {
    setCurrentScreen("main");
    setGameType(null);
    setCoinType(null);
    setBetAmount(null);
    setBetOdds(null);
  };

  return (
    <div className="flex flex-col w-[500px] bg-[#383838] rounded-[16px]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[40px] text-[#fff] font-face-bebas">
          GET READY TO PLAY
        </p>
      </div>
      <div className="flex flex-col items-center justify-start py-[25px] gap-[10px]">
        <p className="text-nafl-sponge-500 text-[20px] leading-[100%] font-face-bebas">
          {currentGameType}
        </p>
        <p className="text-nafl-white text-[12px] leading-[100%]">
          Waiting for players to join
        </p>
        <div className="flex flex-col items-center">
          <p className=" text-[#989898] text-[14px]">
            Buy-in:{" "}
            <span className="text-[#fff] font-face-roboto italic">
              {currentBetAmount} {currentCoinType}
            </span>
          </p>
          <p className=" text-[#989898] text-[14px]">
            Payout:{" "}
            <span className="text-[#fff] font-face-roboto italic">
              {setPayOut(currentBetAmount, currentOdds)} {currentCoinType}
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
        <button
          onClick={() => currentGameId && cancelGame(currentGameId)}
          className="flex items-center justify-center w-[183px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 mb-[17px]"
        >
          <p className="text-nafl-sponge-500 text-[18px] font-bold">
            CANCEL GAME
          </p>
        </button>
      </div>
    </div>
  );
};

export default GameZoneJoining;

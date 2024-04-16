"use client";

import { Card, CardBody, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { setInterval } from "timers";
import useGame from "@components/utils/gamezone";
import GameActions from "./GameZoneActions";
import GameZonePreview from "./GameZonePreview";
import GameZoneChangeBet from "./GameZoneChangeBet";

const GameZoneGame = () => {
  const currentScreen = useGame((state) => state.screen);
  const currentGameMode = useGame((state) => state.mode);
  const currentGameType = useGame((state) => state.type);

  const setCurrentScreen = useGame((state) => state.setScreen);

  const [countdownTimer, setCountdownTimer] = useState<number>(200);
  const [gameStatus, setGameStatus] = useState<
    "waiting" | "playing" | "finished" | "changingbet"
  >("waiting");
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(
    null
  );
  const [selectedAction, setSelectedAction] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownTimer((prevCountdown) => prevCountdown - 0.5);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setGameStatus("waiting");
  }, [currentScreen]);

  useEffect(() => {
    gameStatus == "waiting" ? setCountdownTimer(200) : setCountdownTimer(20);
  }, [gameStatus]);

  useEffect(() => {
    console.log("selectedAction:", selectedAction);
    selectedAction != null && setGameStatus("finished");
    setGameResult("win");
  }, [selectedAction]);

  const gameResultMessage = (
    result: "win" | "lose" | "draw" | null,
    type: string | null
  ) => {
    if (result == "win") {
      return type == "Rock, Paper, Scissors" ? (
        <p className="flex items-center absolute top-0 w-full h-[230px] bg-[#383838] font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
          YOU WON CONGRATULATIONS! <br /> REMATCH?
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[230px] absolute top-0 bg-[#383838] ">
          <p className="flex items-center font-face-bebas text-nafl-sponge-500 text-[60px] leading-[100%] text-center">
            VICTORY!
          </p>
          <p className="flex items-center justify-center w-full font-face-bebas text-nafl-sponge-500 text-[24px] leading-[100%] text-center">
            Waiting for opponent to make the call...
          </p>
        </div>
      );
    } else if (result == "lose") {
      return type == "Rock, Paper, Scissors" ? (
        <p className="flex items-center absolute top-0 w-full h-[230px] bg-[#383838] font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
          YOU GOT CRUSHED! <br /> REMATCH?
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[230px] absolute top-0 bg-[#383838]">
          <p className="flex items-center font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
            Nearly had it!
          </p>
          <p className="flex items-center justify-center w-full font-face-bebas text-nafl-sponge-500 text-[24px] leading-[130%] text-center">
            It’s your turn to Win. <br />
            Choose{" "}
            <a href="" className="cursor-text text-[#fff]">
              Heads
            </a>{" "}
            or{" "}
            <a href="" className="cursor-text text-[#fff]">
              tails
            </a>
          </p>
        </div>
      );
    } else if (result == "draw") {
      return (
        <p className="flex items-center absolute top-0 w-full h-[230px] bg-[#383838] font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
          YOU GOT A DRAW! <br /> REMATCH?
        </p>
      );
    } else {
      return (
        <p className="flex items-center absolute top-0 w-full h-[230px] bg-[#383838] font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
          RESULT ERROR
        </p>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-[966px] rounded-[16px] bg-[#383838]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[#fff] text-[40px] font-face-bebas">
          {currentGameType}
        </p>
      </div>
      <div className="flex flex-col w-[540px] items-center justify-start py-[70px] gap-[20px]">
        <GameZonePreview
          type={currentGameType}
          userAction={null}
          enemyAction={null}
        />

        {gameStatus == "playing" || gameStatus == "finished" ? (
          <GameActions
            type={currentGameType}
            onActionChosen={setSelectedAction}
          />
        ) : (
          <div className="flex flex-col w-full gap-[4px]">
            <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
              Enter the game to start playing.
            </p>
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          </div>
        )}

        <div className="flex flex-col py-[30px] items-center relative w-full">
          <p className="text-[#fff] text-[20px]">Waiting for Creator to join</p>
          <div className="flex items-center justify-center scale-x-[-1] relative">
            <CircularProgress
              classNames={{
                svg: "w-[160px] h-[160px] drop-shadow-md",
                indicator: "stroke-[#00e0df]",
                track: "stroke-[#ee26ff]",
                value: "text-3xl font-semibold text-white",
              }}
              value={countdownTimer / 2}
              maxValue={gameStatus == "waiting" ? 100 : 10}
              strokeWidth={4}
              showValueLabel={false}
            />
            <div
              onClick={() => setCountdownTimer(200)}
              className="flex flex-col items-center justify-center absolute top-[30px] h-[100px] w-[100px] rounded-full bg-[#383838] scale-x-[-1]"
            >
              <p className="text-[#fff] font-face-bebas text-[50px] leading-[100%]">
                {Math.ceil(countdownTimer)}
              </p>
              <p className="text-[#fff] text-center font-face-roboto text-[10px] mt-[-6px] leading-[100%]">
                SECONDS
              </p>
            </div>
          </div>

          {gameStatus == "finished" &&
            gameResultMessage(gameResult, currentGameType)}

          {gameStatus == "changingbet" && <GameZoneChangeBet />}
          <div className="flex flex-row items-center justify-center gap-[20px] mt-[20px]">
            <p className="text-[#989898] text-[12px]">
              Payout:{" "}
              <a href="" className="font-bold text-[#fff] font-face-roboto">
                XXX ETH
              </a>
            </p>
            <p className="text-[#989898] text-[12px]">
              Buy-in:{" "}
              <a href="" className="font-bold text-[#fff] font-face-roboto">
                YYY ETH
              </a>
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>

        {gameStatus == "waiting" &&
          (currentGameMode == "host" ? (
            <div className="flex flex-row items-center justify-center gap-[14px]">
              <button
                onClick={() => setCurrentScreen("main")}
                className="w-[110px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px]">BACK</p>
              </button>
              <button
                onClick={() => setGameStatus("playing")}
                className="w-[165px] h-[54px] rounded-[8px] bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] font-bold text-[18px]">START GAME</p>
              </button>
              <a
                onClick={() => setGameStatus("changingbet")}
                className="font-face-roboto text-[12px] italic underline cursor-pointer"
              >
                Change Bets
              </a>
            </div>
          ) : (
            <button
              onClick={() => setCurrentScreen("main")}
              className="w-[110px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
            >
              <p className="text-[#fff] text-[18px]">BACK</p>
            </button>
          ))}

        {gameStatus == "finished" &&
          (currentGameMode == "host" ? (
            <div className="flex flex-row items-center justify-center gap-[14px]">
              <button
                onClick={() => setCurrentScreen("main")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px]">LEAVE GAME</p>
              </button>
              <button
                onClick={() => setGameStatus("playing")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] text-[18px]">PLAY AGAIN</p>
              </button>
              <a
                onClick={() => setGameStatus("changingbet")}
                className="font-face-roboto text-[12px] italic underline cursor-pointer"
              >
                Change Bets
              </a>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-[14px]">
              <button
                onClick={() => setCurrentScreen("main")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#fff] text-[18px]">LEAVE GAME</p>
              </button>
              <button
                onClick={() => setGameStatus("waiting")}
                className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
              >
                <p className="text-[#000] text-[18px]">PLAY AGAIN</p>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GameZoneGame;

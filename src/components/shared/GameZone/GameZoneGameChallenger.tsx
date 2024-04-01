"use client";

import { Card, CardBody, CircularProgress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { setInterval } from "timers";

const GameZoneGameChallenger = () => {
  const [countdownTimer, setCountdownTimer] = useState<number>(200);
  const [gameStatus, setGameStatus] = useState<string>("waiting");
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
    gameStatus == "waiting" ? setCountdownTimer(200) : setCountdownTimer(20);
  }, [gameStatus]);

  return (
    <div className="flex flex-col items-center justify-start w-[966px] rounded-[16px] bg-[#383838]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[#fff] text-[40px] font-face-bebas">
          ROCK, PAPER, SCISSORS
        </p>
      </div>
      <div className="flex flex-col w-[540px] items-center justify-start py-[70px] gap-[20px]">
        <div className="flex flex-row items-center w-full justify-between px-[40px] py-[40px]">
          <img
            onClick={() => setGameStatus("playing")}
            src="/static/rock-hand-cyan.png"
            alt="Rock Hand"
            className="w-[100px] object-contain"
          />
          <img
            onClick={() => setGameStatus("finished")}
            src="/static/rock-hand-magenta.png"
            alt="Rock Hand"
            className="w-[100px] object-contain"
          />
        </div>

        {gameStatus == "playing" || gameStatus == "finished" ? (
          <div className="flex flex-col w-full gap-[4px]">
            <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
              CHOOSE YOUR WEAPON!
            </p>
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
            <div className="flex flex-row items-center justify-center gap-[23px] mt-[10px]">
              <button
                onClick={() =>
                  gameStatus == "playing" && setSelectedAction("rock")
                }
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                  selectedAction == "rock"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">ROCK</p>
              </button>
              <p className="text-[#fff] text-[18px]">OR</p>
              <button
                onClick={() =>
                  gameStatus == "playing" && setSelectedAction("paper")
                }
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                  selectedAction == "paper"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">PAPER</p>
              </button>
              <p className="text-[#fff] text-[18px]">OR</p>
              <button
                onClick={() =>
                  gameStatus == "playing" && setSelectedAction("scissors")
                }
                className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                  selectedAction == "scissors"
                    ? "border-nafl-purple bg-nafl-purple"
                    : "border-nafl-sponge-500 bg-transparent"
                }`}
              >
                <p className="text-[#fff] text-[18px]">SCISSORS</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-[4px]">
            <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
              GAME CREATOR HAS BEEN NOTIFIED
            </p>
            <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
          </div>
        )}

        <div className="flex flex-col py-[30px] items-center relative">
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

          {gameStatus == "finished" && (
            <p className="flex items-center absolute top-0 w-[370px] h-[230px] bg-[#383838] font-face-bebas text-nafl-sponge-500 text-[60px] leading-[130%] text-center">
              YOU GOT CRUSHED! <br /> REMATCH?
            </p>
          )}
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

        {gameStatus == "waiting" && (
          <button className="w-[110px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]">
            <p className="text-[#fff] text-[18px]">BACK</p>
          </button>
        )}

        {gameStatus == "finished" && (
          <div className="flex flex-row items-center justify-center gap-[14px]">
            <button className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 my-[20px]">
              <p className="text-[#fff] text-[18px]">LEAVE GAME</p>
            </button>
            <button
              onClick={() => setGameStatus("waiting")}
              className="h-[54px] px-[31px] rounded-[8px] border-[1px] border-nafl-sponge-500 bg-nafl-sponge-500 my-[20px]"
            >
              <p className="text-[#000] text-[18px]">PLAY AGAIN</p>
            </button>
            <a className="font-face-roboto text-[12px] italic underline cursor-pointer">
              Change Bets
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameZoneGameChallenger;

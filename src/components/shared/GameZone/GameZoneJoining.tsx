"use client";

import { CircularProgress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const GameZoneJoining = () => {
  const [countdownTimer, setCountdownTimer] = useState<number>(200);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownTimer((prevCountdown) => prevCountdown - 0.5);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col w-[500px] bg-[#383838] rounded-[16px]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[40px] text-[#fff] font-face-bebas">
          GET READY TO PLAY
        </p>
      </div>
      <div className="flex flex-col items-center justify-start py-[25px] gap-[10px]">
        <p className="text-nafl-sponge-500 text-[20px] leading-[100%] font-face-bebas">
          NAME OF 3RD PARTY GAME
        </p>
        <p className="text-nafl-white text-[12px] leading-[100%]">
          Waiting for players to join
        </p>
        <div className="flex flex-col items-center">
          <p className=" text-[#989898] text-[14px]">
            Buy-in:{" "}
            <a href="" className="text-[#fff] font-face-roboto italic">
              XXX ETH
            </a>
          </p>
          <p className=" text-[#989898] text-[14px]">
            Payout:{" "}
            <a href="" className="text-[#fff] font-face-roboto italic">
              YYY ETH
            </a>
          </p>
        </div>
        <div className="flex flex-col items-center relative w-full gap-[10px]">
          <div className="flex items-center justify-center scale-x-[-1] relative">
            <CircularProgress
              classNames={{
                svg: "w-[160px] h-[160px] drop-shadow-md",
                indicator: "stroke-[#00e0df]",
                track: "stroke-[#ee26ff]",
                value: "text-3xl font-semibold text-white",
              }}
              value={countdownTimer / 2}
              maxValue={100}
              strokeWidth={4}
              showValueLabel={false}
            />
            <div
              onClick={() => setCountdownTimer(200)}
              className="flex flex-col items-center justify-center absolute top-[30px] h-[100px] w-[100px] rounded-full bg-[#383838] scale-x-[-1]"
            >
              <p className="text-[#fff] font-face-bebas text-[60px] leading-[100%]">
                {Math.ceil(countdownTimer)}
              </p>
            </div>
          </div>
          <p className="text-[#fff] text-center font-face-bebas text-[16px] mt-[-6px] leading-[100%]">
            SECONDS
          </p>
        </div>
        <button className="flex items-center justify-center w-[183px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500 mb-[17px]">
          <p className="text-nafl-sponge-500 text-[18px] font-bold">
            CANCEL GAME
          </p>
        </button>
      </div>
    </div>
  );
};

export default GameZoneJoining;

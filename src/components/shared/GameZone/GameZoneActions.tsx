"use client";

import { useEffect, useState } from "react";

const GameActions = ({
  type,
  onActionChosen,
}: {
  type: string | null;
  onActionChosen: (action: string) => void;
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");

  useEffect(() => {
    onActionChosen(selectedAction);
  }, [selectedAction]);

  return (
    <>
      <div className="flex flex-col w-full gap-[4px]">
        <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
          {type == "Rock, Paper, Scissors"
            ? "CHOOSE YOUR WEAPON!"
            : "HEADS OR TAILS?"}
        </p>
        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        {type == "Rock, Paper, Scissors" ? (
          <div className="flex flex-row items-center justify-center gap-[23px] mt-[10px]">
            <button
              onClick={() => setSelectedAction("rock")}
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
              onClick={() => setSelectedAction("paper")}
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
              onClick={() => setSelectedAction("scissors")}
              className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                selectedAction == "scissors"
                  ? "border-nafl-purple bg-nafl-purple"
                  : "border-nafl-sponge-500 bg-transparent"
              }`}
            >
              <p className="text-[#fff] text-[18px]">SCISSORS</p>
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-[23px] mt-[10px]">
            <button
              onClick={() => setSelectedAction("heads")}
              className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                selectedAction == "heads"
                  ? "border-nafl-purple bg-nafl-purple"
                  : "border-nafl-sponge-500 bg-transparent"
              }`}
            >
              <p className="text-[#fff] text-[18px]">HEADS</p>
            </button>
            <p className="text-[#fff] text-[18px]">OR</p>
            <button
              onClick={() => setSelectedAction("tails")}
              className={`rounded-[8px] border-[1px] px-[31px] h-[54px] duration-300 ${
                selectedAction == "tails"
                  ? "border-[#00e0df] bg-[#00e0df]"
                  : "border-nafl-sponge-500 bg-transparent"
              }`}
            >
              <p className="text-[#fff] text-[18px]">TAILS</p>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameActions;

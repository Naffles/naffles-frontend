"use client";

import useGame from "@components/utils/gamezone";
import { RPSGamezone } from "./RPSGamezone";
import { CTGamezone } from "./CTGamezone";
import { RPSGamezoneNafflings } from "./RPSGamezoneNafflings";
import { CTGamezoneNafflings } from "./CTGamezoneNafflings";

const GameZoneGame = () => {
  const currentGameType = useGame((state) => state.type);

  return (
    <div className="flex flex-col items-center justify-start w-[966px] rounded-[16px] bg-[#383838]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[#fff] text-[40px] font-face-bebas">
          {currentGameType}
        </p>
      </div>
      <div className="flex flex-col w-[540px] items-center justify-start py-[70px] gap-[20px]">
        {currentGameType == "Rock, Paper, Scissors" && <RPSGamezone />}
        {currentGameType == "Coin Toss" && <CTGamezone />}
        {currentGameType == "Nafflings Rock, Paper, Scissors" && (
          <RPSGamezoneNafflings />
        )}
        {currentGameType == "Nafflings Coin Toss" && <CTGamezoneNafflings />}
      </div>
    </div>
  );
};

export default GameZoneGame;

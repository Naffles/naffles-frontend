"use client";

import useGame from "@components/utils/gamezone";
import { RPSGamezone } from "./RPSGamezone";
import { CTGamezone } from "./CTGamezone";
import { RPSGamezoneNafflings } from "./RPSGamezoneNafflings";
import { CTGamezoneNafflings } from "./CTGamezoneNafflings";

const GameZoneGame = () => {
  const currentGameType = useGame((state) => state.type);

  return (
    <div className="flex flex-col items-center justify-start md:w-[966px] w-[95%] rounded-[16px] bg-[#383838]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[#fff] md:text-[40px] text-[32px] font-face-bebas">
          {currentGameType}
        </p>
      </div>
      <div className="flex flex-col max-w-[540px] w-full items-center justify-start md:py-[70px] py-[30px] gap-[20px] md:px-0 px-[0px] lg:scale-100 scale-90">
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

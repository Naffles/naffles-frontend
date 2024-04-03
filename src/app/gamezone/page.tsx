"use client";

import Footer from "@components/shared/Footer/Footer";
import GameZoneComments from "@components/shared/GameZone/GameZoneComments";
import GameZoneCreateGame from "@components/shared/GameZone/GameZoneCreateGame";
import GameZoneGameChallenger from "@components/shared/GameZone/GameZoneGameChallenger";
import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import { useEffect, useState } from "react";

const GameZone = () => {
  const [seletedView, setSeletedView] = useState<string>("main");

  // useEffect(() => {
  //   setTimeout(() => {
  //     setSeletedView("main");
  //   }, 100);
  // }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full absolute top-[-100px]">
        <img
          src={"/static/gamezone-bg.jpeg"}
          alt="Naffle"
          className="w-full object-contain opacity-30 z-10 ml-[-2px]"
        />
        <div className="absolute inset-0 w-full bg-gradient-to-b from-[#ffffff00] to-[#464646] z-10"></div>
      </div>

      <div className="flex flex-col w-full absolute top-[120px] items-center justify-start">
        <div
          className={`flex flex-row items-center justify-start gap-[80px] pl-[25px] w-[1400px] mb-[30px] ${
            seletedView == "main" ? "opacity-100 z-20" : "opacity-0 z-[-50]"
          }`}
        >
          <p className="text-[48px] text-white font-face-bebas">GAME ZONE</p>
          <div className="flex items-center justify-center gap-[32px] ">
            <button
              onClick={() => setSeletedView("create")}
              className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]"
            >
              <p className="text-white text-[18px] font-bold">CREATE GAME</p>
            </button>
            <button
              onClick={() => setSeletedView("challenge")}
              className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]"
            >
              <p className="text-white text-[18px] font-bold">
                PLAY FOR POINTS
              </p>
            </button>
          </div>
        </div>

        <div
          className={` flex-row items-start justify-center gap-[36px] duration-500 ${
            seletedView == "main"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneMain />
          <GameZoneComments />
        </div>

        <div
          className={`duration-500 pb-[300px] ${
            seletedView == "create"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneCreateGame />
        </div>

        <div
          className={`flex-row items-start justify-center gap-[36px] duration-500 pb-[300px] ${
            seletedView == "challenge"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneGameChallenger />
          <GameZoneComments />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GameZone;

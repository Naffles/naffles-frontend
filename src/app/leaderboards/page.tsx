"use client";

import Footer from "@components/shared/Footer/Footer";
import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import { useEffect, useState } from "react";
import useGame from "../../components/utils/gamezone";
import GameZoneGame from "@components/shared/GameZone/GameZoneGame";
import LeaderboardsChat from "@components/shared/Leaderboards/LeaderboardsChat";
import LeaderboardsMain from "@components/shared/Leaderboards/LeaderboardsMain";

const Leaderboards = () => {
  const currentScreen = useGame((state) => state.screen);
  const currentGameMode = useGame((state) => state.mode);
  const currentGameType = useGame((state) => state.type);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setGameMode = useGame((state) => state.setMode);
  const setGameType = useGame((state) => state.setType);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setSeletedView("main");
  //   }, 100);
  // }, []);

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="flex flex-col w-full absolute top-[-100px]">
        <img
          src={"/static/gamezone-bg.jpeg"}
          alt="Naffle"
          className="w-full object-contain opacity-30 z-10 ml-[-2px]"
        />
        <div className="absolute inset-0 w-full bg-gradient-to-b from-[#ffffff00] to-[#464646] z-10"></div>
      </div>

      <div className="flex flex-col w-full absolute top-[50px] items-center justify-start">
        <div className="flex flex-row items-center justify-start gap-[80px] pl-[25px] w-[1400px] mb-[30px] z-20">
          <p className="text-[32px] text-white font-face-bebas">LEADERBOARDS</p>
        </div>

        <div className="flex flex-row items-start justify-center gap-[36px] duration-500 z-20 mb-[100px]">
          <LeaderboardsMain />
          <LeaderboardsChat />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Leaderboards;

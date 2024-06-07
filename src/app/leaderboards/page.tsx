"use client";

import Footer from "@components/shared/Footer/Footer";
import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import { useEffect, useState } from "react";
import useGame from "../../components/utils/gamezone";
import GameZoneGame from "@components/shared/GameZone/GameZoneGame";
import LeaderboardsChat from "@components/shared/Leaderboards/LeaderboardsChat";
import LeaderboardsMain from "@components/shared/Leaderboards/LeaderboardsMain";
import GameZoneGlobalChat from "@components/shared/GameZone/GameZoneGlobalChat";
import GameZoneCreateGame from "@components/shared/GameZone/GameZoneCreateGame";
import GameZoneCreateNafflingsGame from "@components/shared/GameZone/GameZoneCreateNafflingsGame";
import GameZoneJoining from "@components/shared/GameZone/GameZoneJoining";
import GameZoneAccepting from "@components/shared/GameZone/GameZoneAccepting";
import GameZoneChat from "@components/shared/GameZone/GameZoneChat";

const Leaderboards = () => {
  const currentScreen = useGame((state) => state.screen);

  const setCurrentScreen = useGame((state) => state.setScreen);

  return (
    <div className="flex flex-col items-center w-full relative mt-10">
      <div className="flex flex-col w-full absolute top-[-100px]">
        <img
          src={"/static/gamezone-bg.jpeg"}
          alt="Naffle"
          className="w-full object-contain opacity-30 z-10 ml-[-2px]"
        />
        <div className="absolute inset-0 w-full bg-gradient-to-b from-[#ffffff00] to-[#464646] z-10"></div>
      </div>

      <div className="flex flex-col w-full absolute top-[120px] items-center justify-start">
        {/* <div className="flex flex-row items-center justify-start gap-[80px] pl-[25px] w-[1400px] mb-[30px] z-20"> */}
        {currentScreen == "main" ? (
          <div className="flex flex-row flex-wrap items-center xl:justify-start justify-center xl:gap-[80px] gap-[20px] md:pl-[25px] 2xl:w-[1400px] lg:w-[1466px] w-[90%] mb-[30px] z-20">
            <div className="relative">
              <p className="text-[32px] text-nafl-white font-face-bebas">
                LEADERBOARDS
              </p>
              <div className="absolute w-[97px] top-[-12px] left-[5px]">
                <img src="/nafflings/winner.png" alt="" />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[200px]"></div>
        )}

        {currentScreen == "main" && (
          <div className="flex flex-row flex-wrap items-start justify-center gap-[36px] duration-500 z-30 w-full pb-[100px]">
            <LeaderboardsMain />
            <GameZoneGlobalChat />
          </div>
        )}

        {currentScreen == "create" && (
          <div className="flex items-start justify-center duration-500 pb-[300px] z-20 w-full">
            <GameZoneCreateGame />
          </div>
        )}

        {currentScreen == "createNafflings" && (
          <div className="flex items-start justify-center duration-500 pb-[300px] z-20 w-full">
            <GameZoneCreateNafflingsGame />
          </div>
        )}

        {currentScreen == "joining" && (
          <div className="flex duration-500 pb-[300px] z-20">
            <GameZoneJoining />
          </div>
        )}

        {currentScreen == "accepting" && (
          <div className="flex duration-500 pb-[300px] z-20">
            <GameZoneAccepting />
          </div>
        )}

        {currentScreen == "ingame" && (
          <div className="flex flex-row items-start justify-center gap-[36px] duration-500 pb-[300px] z-30">
            <GameZoneGame />
            <GameZoneChat />
            {/* <GameZoneChatMobile /> */}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Leaderboards;

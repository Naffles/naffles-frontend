"use client";

import Footer from "@components/shared/Footer/Footer";
import GameZoneCreateGame from "@components/shared/GameZone/GameZoneCreateGame";
import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import useGame from "../../components/utils/gamezone";
import GameZoneGame from "@components/shared/GameZone/GameZoneGame";
import GameZoneJoining from "@components/shared/GameZone/GameZoneJoining";
import GameZoneChatGlobalMobile from "@components/shared/GameZone/GameZoneChatGlobalMobile";
import GameZoneGlobalChat from "@components/shared/GameZone/GameZoneGlobalChat";
import GameZoneAccepting from "@components/shared/GameZone/GameZoneAccepting";
import GameZoneChat from "@components/shared/GameZone/GameZoneChat";
import GameZoneChatMobile from "@components/shared/GameZone/GameZoneChatMobile";

const GameZone = () => {
  const currentScreen = useGame((state) => state.screen);

  const setCurrentScreen = useGame((state) => state.setScreen);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full absolute top-[-100px]">
        <img
          src={"/static/gamezone-bg.jpeg"}
          alt="Naffle"
          className="w-full h-[1000px] object-cover object-top opacity-30 z-10 ml-[-2px]"
        />
        <div className="absolute inset-0 w-full bg-gradient-to-b from-[#ffffff00] to-[#464646] z-10"></div>
      </div>

      <div className="flex flex-col w-full absolute top-[160px] items-center justify-start">
        <div
          className={`flex flex-row flex-wrap items-center xl:justify-start justify-center xl:gap-[80px] gap-[20px] md:pl-[25px] lg:w-[1400px] w-[90%] mb-[30px] ${
            currentScreen == "main" ? "opacity-100 z-20" : "opacity-0 z-[-50]"
          }`}
        >
          <p className="text-[48px] text-nafl-white font-face-bebas">
            GAME ZONE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[32px] ">
            <button
              onClick={() => setCurrentScreen("create")}
              className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]"
            >
              <p className="text-nafl-white text-[18px] font-bold">
                CREATE GAME
              </p>
            </button>
            <button className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]">
              <p className="text-nafl-white text-[18px] font-bold">
                PLAY FOR POINTS
              </p>
            </button>
          </div>
        </div>

        {currentScreen == "main" && (
          <div className="flex flex-row flex-wrap items-start justify-center gap-[36px] duration-500 z-30 w-full pb-[100px]">
            <GameZoneMain />
            <GameZoneGlobalChat />
            <GameZoneChatGlobalMobile />
          </div>
        )}

        {currentScreen == "create" && (
          <div className="flex items-start justify-center duration-500 pb-[300px] z-20 w-full">
            <GameZoneCreateGame />
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
            <GameZoneChatMobile />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default GameZone;

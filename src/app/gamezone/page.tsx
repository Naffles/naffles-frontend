"use client";

import Footer from "@components/shared/Footer/Footer";
import GameZoneChat from "@components/shared/GameZone/GameZoneChat";
import GameZoneCreateGame from "@components/shared/GameZone/GameZoneCreateGame";
import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import { useEffect, useState } from "react";
import useGame from "../../components/utils/gamezone";
import GameZoneGame from "@components/shared/GameZone/GameZoneGame";

const GameZone = () => {
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
            currentScreen == "main" ? "opacity-100 z-20" : "opacity-0 z-[-50]"
          }`}
        >
          <p className="text-[48px] text-white font-face-bebas">GAME ZONE</p>
          <div className="flex items-center justify-center gap-[32px] ">
            <button
              onClick={() => setCurrentScreen("create")}
              className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]"
            >
              <p className="text-white text-[18px] font-bold">CREATE GAME</p>
            </button>
            <button
              onClick={() => setCurrentScreen("ingame")}
              className="flex items-center justify-center bg-[#DC2ABF] px-[20px] rounded-lg h-[50px] border-[1px] border-[#02B1B1]"
            >
              <p className="text-white text-[18px] font-bold">
                PLAY FOR POINTS
              </p>
            </button>
            <div className="flex flex-row items-center justify-center gap-[10px]">
              <button className="flex flex-col items-center justify-center px-[10px] h-[40px] border-[2px] border-[#fff] rounded-[10px] hover:bg-nafl-white duration-500 hover:text-[#000]">
                <p
                  onClick={() => {
                    setCurrentScreen("ingame");
                    setGameMode("host");
                    setGameType("Rock, Paper, Scissors");
                  }}
                  className="text-[12px] text-center font-face-bebas"
                >
                  rock, paper, scissor demo (Host)
                </p>
                <p className="text-[8px] mt-[-6px]">DEV MODE</p>
              </button>

              <button className="flex flex-col items-center justify-center px-[10px] h-[40px] border-[2px] border-[#fff] rounded-[10px] hover:bg-nafl-white duration-500 hover:text-[#000]">
                {" "}
                <p
                  onClick={() => {
                    setCurrentScreen("ingame");
                    setGameMode("challenger");
                    setGameType("Rock, Paper, Scissors");
                  }}
                  className="text-[12px] text-center font-face-bebas"
                >
                  rock, paper, scissor demo (Challenger)
                </p>
                <p className="text-[8px] mt-[-6px]">DEV MODE</p>
              </button>

              <button className="flex flex-col items-center justify-center px-[10px] h-[40px] border-[2px] border-[#fff] rounded-[10px] hover:bg-nafl-white duration-500 hover:text-[#000]">
                <p
                  onClick={() => {
                    setCurrentScreen("ingame");
                    setGameMode("host");
                    setGameType("Coin Toss");
                  }}
                  className="text-[12px] text-center font-face-bebas"
                >
                  coin toss demo (Host)
                </p>
                <p className="text-[8px] mt-[-6px]">DEV MODE</p>
              </button>

              <button className="flex flex-col items-center justify-center px-[10px] h-[40px] border-[2px] border-[#fff] rounded-[10px] hover:bg-nafl-white duration-500 hover:text-[#000]">
                <p
                  onClick={() => {
                    setCurrentScreen("ingame");
                    setGameMode("challenger");
                    setGameType("Coin Toss");
                  }}
                  className="text-[12px] text-center font-face-bebas"
                >
                  coin toss demo (Challenger)
                </p>
                <p className="text-[8px] mt-[-6px]">DEV MODE</p>
              </button>
            </div>
          </div>
        </div>

        <div
          className={` flex-row items-start justify-center gap-[36px] duration-500 ${
            currentScreen == "main"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneMain />
          <GameZoneChat />
        </div>

        <div
          className={`duration-500 pb-[300px] ${
            currentScreen == "create"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneCreateGame />
        </div>

        <div
          className={`flex-row items-start justify-center gap-[36px] duration-500 pb-[300px] ${
            currentScreen == "ingame"
              ? "opacity-100 z-20 flex"
              : "opacity-0 z-[-50] hidden"
          }`}
        >
          <GameZoneGame />
          <GameZoneChat />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GameZone;

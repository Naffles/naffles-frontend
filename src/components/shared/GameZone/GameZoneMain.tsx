"use client";

import { MdOutlineSearch } from "react-icons/md";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useState } from "react";
import { Slider } from "@nextui-org/react";
import GameZoneGamesTable from "../Tables/GameZoneGamesTable";

const GameZoneMain = () => {
  const [gameType, setGameType] = useState<string>("ALL GAMES");
  const [gameTypeDropdown, setGameTypeDropdown] = useState<boolean>(false);
  const [gameFilter, setGameFilter] = useState<string>("ODDS");
  const [filterMixMaxValue, setFilterMixMaxValue] = useState<number[]>([0, 0]);

  let games_type_filter_options = [
    "ALL GAMES",
    "ROCK, PAPERS, SCISSORS",
    "COIN TOSS",
  ];

  return (
    <>
      <div className="flex flex-col items-center lg:w-[966px] w-[90%] z-20 pb-[27px]">
        <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] w-full p-[13px]">
          <div className="flex flex-col w-full rounded-lg overflow-hidden relative">
            <img
              src={"/static/gamezone-header-bg.png"}
              alt="Naffle"
              className="w-full object-cover object-center absolute top-0 left-0"
            />
            <div className="flex flex-col w-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[33px] py-[10px] z-20">
              <p className="text-[26px] font-face-bebas text-nafl-white underline">
                PLAY OR WAGER AND EARN POINTS
              </p>
              <div className="flex lg:flex-row flex-col items-start justify-between">
                <p className="w-full text-left text-[16px]">
                  Earn points by playing the games or participating in the
                  raffles. <br />
                  <a className="text-[#292929] font-face-roboto">
                    Join a game
                  </a>{" "}
                  to amplify your crypto balance, while you&apos;re amplifying
                  your points too! <br />
                  <b>
                    Your points turn into $NAFF tokens when the air drop season
                    starts.
                  </b>
                </p>
                <img
                  src={"/static/naffles-text-logo-dark.png"}
                  alt="Naffle"
                  className="w-[170px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-wrap lg:items-end items-center md:justify-between justify-center mt-[36px] w-full px-[20px] lg:gap-0 gap-[20px]">
            <div className="flex items-center w-[220px] h-[37px] relative">
              <input
                type="text"
                placeholder="SEARCH"
                className="w-full h-full rounded-[10px] bg-[#4B4B4B] font-face-roboto px-[20px] text-[16px] placeholder:text-[#C1C1C1]"
              />
              <MdOutlineSearch className="absolute right-[12px] text-[20px] text-[#E9E9E9]" />
            </div>

            <div className="flex flex-row flex-wrap items-end justify-center gap-[13px]">
              <div className="flex flex-col gap-[11px]">
                <p className="text-[13px] text-[#FEFF3D] leading-[100%]">
                  FILTER
                </p>

                <div className="flex md:flex-row flex-col items-center gap-[13px]">
                  <div className="w-[154px] relative">
                    <button
                      onClick={() =>
                        setGameTypeDropdown(gameTypeDropdown ? false : true)
                      }
                      className="flex px-[15px] items-center rounded-[10px] w-full h-[37px] bg-[#4B4B4B]"
                    >
                      <p className="text-[16px] text-[#C1C1C1] truncate">
                        {gameType}
                      </p>
                      <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
                    </button>

                    {gameTypeDropdown && (
                      <div className="flex flex-col absolute top-[40px] w-full rounded-[10px] bg-[#4B4B4B] h-[140px] z-[100] pt-[5px]">
                        <div className="flex flex-col w-full gap-[6px] px-[5px]">
                          {games_type_filter_options.map((item) => (
                            <button
                              onClick={() => {
                                setGameType(item);
                                setGameTypeDropdown(false);
                              }}
                              key={item}
                              className={`flex items-center w-full px-[15px] rounded-[10px] hover:bg-[#fff]/30 duration-300 h-[37px] ${
                                gameType == item && "bg-[#fff]/30"
                              }`}
                            >
                              <p className="text-[16px] text-[#fff] truncate">
                                {item}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="flex px-[15px] items-center rounded-[10px] w-[154px] h-[37px] bg-[#4B4B4B] relative">
                    <p className="text-[16px] text-[#C1C1C1]">ODDS</p>
                    <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[11px] md:items-start items-center">
                <p className="text-[13px] text-[#7E7E7E] leading-[100%]">
                  BET AMOUNT
                </p>
                <div className="flex flex-row md:scale-100 scale-75 items-center justify-center gap-[20px]">
                  <input
                    type="text"
                    placeholder="MIN"
                    className="w-[60px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />

                  <div className="flex items-center relative">
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute left-0 top-2 z-10"></div>
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute right-0 top-2 z-10"></div>
                    <Slider
                      aria-label="Min Max Value slider"
                      size="sm"
                      step={50}
                      minValue={0}
                      maxValue={1000}
                      defaultValue={[0, 1000]}
                      classNames={{
                        base: "w-[170px]",
                        track: "bg-[#000]/30 w-full",
                        filler: "bg-nafl-sponge-500",
                      }}
                      renderThumb={({ index, ...props }) => (
                        <div
                          {...props}
                          className="group p-2 top-1/2 bg-nafl-sponge-500 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing z-20"
                        ></div>
                      )}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="MAX"
                    className="w-[67px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <GameZoneGamesTable />
        </div>
      </div>
    </>
  );
};

export default GameZoneMain;

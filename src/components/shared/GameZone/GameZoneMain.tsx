"use client";

import { useEffect } from "react";

import { MdOutlineSearch } from "react-icons/md";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useState } from "react";
import { Slider } from "@nextui-org/react";
import GameZoneGamesTable from "../Tables/GameZoneGamesTable";

const GameZoneMain = () => {
  const [gameType, setGameType] = useState<string>("ALL GAMES");
  const [gameTypeDropdown, setGameTypeDropdown] = useState<boolean>(false);
  const [filterMixMaxValue, setFilterMixMaxValue] = useState<number[]>([0, 0]);
  const [searchText, setSearchText] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [selectedOdds, setSelectedOdds] = useState<string>("1");
  const [oddsDropdown, setOddsDropdown] = useState<boolean>(false);

  const [minBet, setMinBet] = useState<string>("0");
  const [minText, setMinText] = useState<string>("0");
  const [maxBet, setMaxBet] = useState<string>("100");
  const [maxText, setMaxText] = useState<string>("100");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinBet(minText);
    }, 500);

    return () => clearTimeout(timer);
  }, [minText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaxBet(maxText);
    }, 500);

    return () => clearTimeout(timer);
  }, [maxText]);

  let games_type_filter_options = [
    "ALL GAMES",
    "ROCK, PAPERS, SCISSORS",
    "COIN TOSS",
  ];

  let odds_options = ["1", "2", "3", "4", "5", "10"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const containerElement = document.getElementById("game-type-dropdown");
      const clickedElementId = clickedElement.id;

      if (
        !containerElement ||
        !containerElement.contains(clickedElement) ||
        clickedElementId == "game-type-dropdown"
      ) {
        setGameTypeDropdown(false);
      }
    };

    // Add event listener on document for clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center lg:w-[966px] w-[90%] z-20 pb-[27px]">
        <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] w-full p-[13px] relative">
          <div className="absolute top-[-75px] z-40 w-[154px] right-[25px] md:right-[55px]">
            <img src="/nafflings/gamer.png" alt="" />
          </div>
          <div className="flex flex-col w-full rounded-lg overflow-hidden relative">
            <img
              src={"/static/gamezone-header-bg.png"}
              alt="Naffle"
              className="w-full object-cover object-center absolute top-0 left-0"
            />
            <div className="flex flex-col w-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[33px] py-[10px] z-20">
              <p className="text-[26px] font-face-bebas text-nafl-white underline">
                PLAY OR WAGER AND EARN NAFFLINGS
              </p>
              <div className="flex lg:flex-row flex-col items-start justify-between">
                <p className="w-full text-left text-[16px]">
                  Earn points by playing the games or participating in the
                  raffles. <br />
                  <span className="text-[#292929] font-bold">
                    Join a game
                  </span>{" "}
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
                  <div id="game-type-dropdown" className="w-[154px] relative">
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

                  <div className="relative">
                    <button
                      onClick={() => setOddsDropdown(!oddsDropdown)}
                      className="flex px-[15px] items-center rounded-[10px] w-[154px] h-[37px] bg-[#4B4B4B] relative"
                    >
                      <p className="text-[16px] text-[#C1C1C1]">ODDS</p>
                      <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
                    </button>
                    {oddsDropdown && (
                      <div className="flex flex-col absolute top-[40px] w-full rounded-[10px] bg-[#4B4B4B] h-[260px] z-[100] pt-[5px]">
                        <div className="flex flex-col w-full gap-[6px] px-[5px]">
                          {odds_options.map((item) => (
                            <button
                              onClick={() => {
                                setSelectedOdds(item);
                                setOddsDropdown(false);
                              }}
                              key={item}
                              className={`flex items-center w-full px-[15px] rounded-[10px] hover:bg-[#fff]/30 duration-300 h-[37px] ${
                                selectedOdds == item && "bg-[#fff]/30"
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
                </div>
              </div>

              <div className="flex flex-col gap-[11px] md:items-start items-center">
                <p className="text-[13px] text-[#7E7E7E] leading-[100%]">
                  BET AMOUNT
                </p>
                <div className="flex flex-row md:scale-100 scale-75 items-center justify-center gap-[20px]">
                  <input
                    type="number"
                    placeholder="MIN"
                    step={1}
                    value={minText}
                    onChange={(e) => setMinText(e.target.value)}
                    className="w-[60px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />

                  <div className="flex items-center relative">
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute left-0 top-2 z-10"></div>
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute right-0 top-2 z-10"></div>
                    <Slider
                      aria-label="Min Max Value slider"
                      size="sm"
                      step={1}
                      onChangeEnd={(e: any) => {
                        setMinText(e[0]);
                        setMaxText(e[1]);
                      }}
                      defaultValue={[0, 100]}
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
                    type="number"
                    placeholder="MAX"
                    step={1}
                    value={maxText}
                    onChange={(e) => setMaxText(e.target.value)}
                    className="w-[67px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <GameZoneGamesTable
            search={search}
            gameType={gameType}
            odds={selectedOdds}
            min={minBet}
            max={maxBet}
          />
        </div>
      </div>
    </>
  );
};

export default GameZoneMain;

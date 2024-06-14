"use client";

import React, { useEffect, useState } from "react";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import CustomGameDropdownComponent from "../Dropdown/CustomGameDropdownComponent";
import useGame from "@components/utils/gamezone";

interface Props {
  show: boolean;
  setShow: Function;
}

const PlayForNafflings = (props: Props) => {
  const [showGameDropdown, setShowGameDropdown] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<string>(
    "Rock, Paper, Scissors"
  );

  let options = ["Rock, Paper, Scissors", "Coin Toss"];

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setCurrentGameType = useGame((state) => state.setType);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const clickedElement = event.target as HTMLElement;
  //     const clickedElementClass = clickedElement.className;

  //     if (
  //       !clickedElementClass ||
  //       typeof clickedElementClass != "string" ||
  //       clickedElementClass.indexOf("game-type-dropdown") < 0
  //     ) {
  //       setShowGameDropdown(false);
  //     }
  //   };

  //   // Add event listener on document for clicks outside the dropdown
  //   document.addEventListener("click", handleClickOutside);

  //   // Cleanup function to remove event listener on unmount
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] backdrop-blur-md w-full h-screen"
            onClick={() => props.setShow(false)}
          />
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[12px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <div className="relative">
                <p className="font-face-bebas text-nafl-white text-[31px]">
                  PLAY FOR NAFFLINGS
                </p>
                <img
                  src="/nafflings/gamer.png"
                  alt="Naffling Gamer"
                  className="w-[50px] object-contain absolute right-[-36px] top-[-2px]"
                />
              </div>

              <RiCloseLine
                onClick={() => props.setShow(!props.show)}
                className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center w-full md:px-[54px] px-[54px] py-[32px] gap-[20px] rounded-b-[20px]">
              <CustomGameDropdownComponent
                label={""}
                options={options}
                selected={selectedGame}
                setSelected={setSelectedGame}
                openState={showGameDropdown}
                openStateFunction={setShowGameDropdown}
                dropDownWidth={272}
                dropDownHeight={140}
              />

              <button
                onClick={() => {
                  setCurrentGameType(
                    selectedGame == "Rock, Paper, Scissors"
                      ? "Nafflings Rock, Paper, Scissors"
                      : "Nafflings Coin Toss"
                  );
                  setCurrentScreen("ingameNafflings");
                  props.setShow(false);
                }}
                className="flex items-center justify-center bg-[#FEFF3D] rounded-[8px] w-[106px] h-[54px] "
              >
                <p className="text-[18px] text-[#000]">PLAY</p>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default PlayForNafflings;

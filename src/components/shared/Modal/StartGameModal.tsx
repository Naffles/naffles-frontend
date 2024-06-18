"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@hook/useLocalStorage";
import { IoMdCheckmark } from "react-icons/io";
import CustomCheckboxComponent from "../Checkbox/CustomCheckboxComponent";

interface IStartGameModal {
  show: boolean;
  hideModal: Function;
}

const StartGameModal = ({ show, hideModal }: IStartGameModal) => {
  const [showModal, setShowModal, removeShowModal] = useLocalStorage(
    "naffles-tutorial-modal",
    "",
    {
      initializeWithValue: false,
    }
  );

  const confirmTutorial = () => {
    setShowModal("neverShow");
  };

  return (
    showModal != "neverShow" &&
    show && (
      <div
        // id="start-game-modal-pop-up"
        className="
          fixed 
          inset-0
          z-50 
          flex 
          flex-col 
          items-center 
          justify-center 
          animate-fade-in
          w-full h-screen
        "
        onBlur={() => confirmTutorial()}
      >
        <div
          onClick={() => confirmTutorial()}
          className="w-full h-screen absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
        ></div>
        <div
          className="
            modal-container 
            rounded-[10px]
            bg-[#383838] 
            max-w-[400px] 
            w-full
            relative
            z-20
            py-[20px]
            px-[30px]
            gap-[20px]
            flex flex-col items-center justify-center 
          "
        >
          <img
            src="/static/tutorial-image.png"
            alt=" tutorial image"
            className="md:w-[400px] w-[90%] object-contain border-[2px] border-nafl-purple rounded-2xl "
          />
          <button
            onClick={() => confirmTutorial()}
            className="flex items-center justify-center bg-nafl-sponge-500 rounded-[10px] h-[50px] px-[30px]"
          >
            <p className="text-[24px] text-[#000] font-bold"> GOT IT!</p>
          </button>
          <div className="flex flex-row items-center justify-center">
            {/* <CustomCheckboxComponent
              label="Never show again?"
              checked={neverShow}
              checkSetter={setNeverShow}
            /> */}
            <p>Don't worry, This will never show again</p>
          </div>
        </div>
      </div>
    )
  );
};

export default StartGameModal;

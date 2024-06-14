"use client";

import { RiExpandUpDownLine } from "react-icons/ri";

interface Dropdown {
  label: string | null;
  options: any[];
  selected: string;
  setSelected: Function;
  openState: boolean;
  openStateFunction: Function;
  dropDownHeight: number;
  dropDownWidth: number;
}

const CustomGameDropdownComponent = ({
  label,
  options,
  selected,
  setSelected,
  openState,
  openStateFunction,
  dropDownHeight,
  dropDownWidth,
}: Dropdown) => {
  return (
    <div className="flex flex-col gap-[11px]">
      {label && (
        <p className="text-[13px] text-[#FEFF3D] leading-[100%]">{label}</p>
      )}

      <div className="flex md:flex-row flex-col items-center gap-[13px]">
        <div className="relative" style={{ width: dropDownWidth }}>
          <button
            onClick={() => openStateFunction(openState ? false : true)}
            className="flex px-[15px] items-center rounded-[10px] w-full h-[54px] bg-[#4B4B4B] border-[#FEFF3D] border-[1px] gap-[10px]"
          >
            <img
              src={
                selected == "COIN TOSS"
                  ? "/static/naffles-jackpot-token.png"
                  : "/static/rock-hand-magenta.png"
              }
              alt="Game Image"
              className="w-[16px] object-contain"
            />
            <p className="text-[16px] text-[#fff] truncate font-face-bebas">
              {selected}
            </p>
            <RiExpandUpDownLine className="absolute text-[20px] text-[#FEFF3D] right-[10px]" />
          </button>

          {openState && (
            <div
              className="flex flex-col absolute top-[60px] w-full rounded-[10px] bg-[#4B4B4B] z-[50] pt-[5px]"
              style={{ height: dropDownHeight }}
            >
              <div className="flex flex-col w-full gap-[6px] px-[5px]">
                {options.map((item) => (
                  <button
                    onClick={() => {
                      setSelected(item);
                      openStateFunction(false);
                    }}
                    key={item}
                    className={`flex items-center w-full px-[15px] rounded-[10px] hover:bg-[#fff]/30 duration-300 h-[54px] ${
                      selected == item && "bg-[#fff]/30"
                    }`}
                  >
                    <p className="text-[16px] text-[#fff] truncate">{item}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomGameDropdownComponent;

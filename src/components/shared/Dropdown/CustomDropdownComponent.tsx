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
}

const CustomDropdownComponent = ({
  label,
  options,
  selected,
  setSelected,
  openState,
  openStateFunction,
  dropDownHeight,
}: Dropdown) => {
  return (
    <div className="flex flex-col gap-[11px]">
      {label && (
        <p className="text-[13px] text-[#FEFF3D] leading-[100%]">{label}</p>
      )}

      <div className="flex md:flex-row flex-col items-center gap-[13px]">
        <div id="game-type-dropdown" className="w-[154px] relative">
          <button
            onClick={() => openStateFunction(openState ? false : true)}
            className="flex px-[15px] items-center rounded-[10px] w-full h-[37px] bg-[#4B4B4B]"
          >
            <p className="text-[16px] text-[#C1C1C1] truncate">{selected}</p>
            <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
          </button>

          {openState && (
            <div
              className="flex flex-col absolute top-[40px] w-full rounded-[10px] bg-[#4B4B4B] z-[100] pt-[5px]"
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
                    className={`flex items-center w-full px-[15px] rounded-[10px] hover:bg-[#fff]/30 duration-300 h-[37px] ${
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

export default CustomDropdownComponent;

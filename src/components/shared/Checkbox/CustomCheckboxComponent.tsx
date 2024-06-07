"use client";

import { IoMdCheckmark } from "react-icons/io";

interface Checkbox {
  label: string;
  checked: boolean;
  checkSetter: Function;
}

const CustomCheckboxComponent = ({ label, checked, checkSetter }: Checkbox) => {
  return (
    <div>
      <input type="checkbox" className="hidden" />
      <label
        htmlFor="checkbox"
        className="inline-flex items-center cursor-pointer"
        onClick={() => checkSetter((checked: boolean) => !checked)}
      >
        <span
          className={`relative duration-500 rounded-[6px] h-[20px] w-[20px] flex items-center justify-center ${checked ? "bg-nafl-sponge-500" : "bg-[#212121]"}`}
        >
          <IoMdCheckmark className={`text-[#212121]`} />
        </span>
        <span className="ml-3 text-[#fff] font-face-roboto uppercase">
          {label}
        </span>
      </label>
    </div>
  );
};

export default CustomCheckboxComponent;

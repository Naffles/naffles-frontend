"use client";
import { ButtonProps } from "@type/Buttons";
import useStore from "../utils/store";

const DepositButton = ({ active }: ButtonProps) => {
  const setIsDepositOpen = useStore((state) => state.setIsDepositOpen);

  // Render the button component with the click event handler
  return (
    <button
      className={`${
        active ? "bg-nafl-yellow-500 text-nafl-white" : "text-gray-900"
      } group flex w-full items-center rounded-md px-2 py-2 text-sm w-auto text-color`}
      onClick={() => setIsDepositOpen(true)}
    >
      On-ramp
    </button>
  );
};

export default DepositButton;

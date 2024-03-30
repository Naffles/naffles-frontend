"use client";
import useStore from "../utils/store";

const ConnectButton = () => {
  const setIsOpen = useStore((state) => state.setIsOpen);

  // Render the button component with the click event handler
  return (
    <button
      type="button"
      className="w-auto border border-white text-color font-bold p-2 rounded-md"
      onClick={() => setIsOpen(true)}
    >
      Connect
    </button>
  );
};

export default ConnectButton;

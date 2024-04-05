import { useMagic } from "@blockchain/context/MagicProvider";
import { ButtonProps } from "@type/Buttons";

const ShowUIButton = ({ active }: ButtonProps) => {
  const { magic } = useMagic();

  // Define the event handler for the button click
  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      await magic?.wallet.showUI();
    } catch (error) {
      // Log any errors that occur during the process
      console.error("handleShowUI:", error);
    }
  };

  // Render the button component if showButton is true, otherwise render nothing
  return (
    <button
      className={`${
        active ? "bg-nafl-yellow-500 text-white" : "text-gray-900"
      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-color`}
      onClick={handleShowUI}
    >
      Account Details
    </button>
  );
};

export default ShowUIButton;

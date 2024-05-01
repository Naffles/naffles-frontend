import { useState } from "react";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import { ButtonProps } from "@type/Buttons";

const DisconnectButton = ({ active }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  // Define the event handler for the button click
  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      // Try to disconnect the user's wallet using Magic's logout method
      await magic?.user.logout();
      await fetchUser();

      setIsLoading(false);
    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log("handleDisconnect:", error);
    }
  };

  // Render the button component with the click event handler
  return (
    <button
      className={`${
        active ? "bg-nafl-yellow-500 text-nafl-white" : "text-gray-900"
      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-color`}
      onClick={handleDisconnect}
    >
      {isLoading ? "Disconnecting..." : "Disconnect"}
    </button>
  );
};

export default DisconnectButton;

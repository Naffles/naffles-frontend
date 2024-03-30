"use client";

import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";

const ConnectButton = () => {
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  // Define the event handler for the button click
  const handleConnect = async () => {
    try {
      // Try to connect to the wallet using Magic's user interface
      if (!magic) return;
      // await magic.wallet.connectWithUI();
      const did = await magic.auth.loginWithEmailOTP({ email: 'iamtherealblackfish@gmail.com' });
      console.log(did);

      const userInfo = await magic.user.getInfo();
      console.log(userInfo);
      await fetchUser();
    } catch (error) {
      // Log any errors that occur during the connection process
      console.error("handleConnect:", error);
    }
  };

  // Render the button component with the click event handler
  return (
    <button
      type="button"
      className="w-auto border border-white text-color font-bold p-2 rounded-md"
      onClick={handleConnect}
    >
      Connect
    </button>
  );
};

export default ConnectButton;

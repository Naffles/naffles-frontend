"use client";
import useStore from "../utils/store";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdLogOut } from "react-icons/io";
import WalletIcon from "@components/icons/walletIcon";

const ConnectButton = () => {
  const { magic } = useMagic();
  const { user, setJWT, setId, fetchUser } = useUser();
  const [walletLoggedIn, setWalletLoggedIn] = useState(false);

  useEffect(() => {
    user?.address ? setWalletLoggedIn(true) : setWalletLoggedIn(false);
  }, [user]);

  const handleConnect = async () => {
    try {
      if (!magic) return;
      await magic.wallet.connectWithUI();

      await fetchUser();
    } catch (error) {
      console.error("handleConnect:", error);
    }
  };

  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      await magic?.wallet.showUI();
    } catch (error) {
      // Log any errors that occur during the process
      console.error("handleShowUI:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Try to disconnect the user's wallet using Magic's logout method
      await magic?.user.logout();
      await fetchUser();
      setJWT(null);
      setId(null);
    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log("handleDisconnect:", error);
    }
  };

  // Render the button component with the click event handler
  return (
    <div className="flex flex-row items-center justify-center relative gap-[12px]">
      <button
        className="flex flex-row items-center justify-start"
        onClick={() => {
          // setIsOpen(true);
          walletLoggedIn ? handleShowUI() : handleConnect();
        }}
      >
        <WalletIcon colour="black" size="lg" className="cursor-pointer" />
      </button>
      {walletLoggedIn && (
        <button
          onClick={() => handleDisconnect()}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-md bg-[#ff4747] shadow-xl"
        >
          <IoMdLogOut className="text-[#fff]" />
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

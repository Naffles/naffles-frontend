"use client";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdLogOut } from "react-icons/io";
import WalletIcon from "@components/icons/walletIcon";
import WalletSelectModal from "@components/shared/Modal/WalletSelectModal";

const ConnectButton = () => {
  const { user, setJWT, setId, setWalletAddress } = useUser();
  const [walletLoggedIn, setWalletLoggedIn] = useState(false);
  const [showWalletSelectModal, setShowWalletSelectModal] =
    useState<boolean>(false);

  useEffect(() => {
    user?.address ? setWalletLoggedIn(true) : setWalletLoggedIn(false);
  }, [user]);

  const handleDisconnect = () => {
    setJWT(null);
    setId(null);
    setWalletAddress(null);
  };

  // Render the button component with the click event handler
  return (
    <div className="flex flex-row items-center justify-center relative gap-[12px]">
      <button
        className="flex flex-row items-center justify-start"
        onClick={() => {
          setShowWalletSelectModal(true);
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

      <WalletSelectModal
        show={showWalletSelectModal}
        setShow={setShowWalletSelectModal}
      />
    </div>
  );
};

export default ConnectButton;

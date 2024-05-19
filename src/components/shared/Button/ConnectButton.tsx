"use client";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdLogOut } from "react-icons/io";
import WalletIcon from "@components/icons/walletIcon";
import WalletSelectModal from "@components/shared/Modal/WalletSelectModal";

const ConnectButton = () => {
  const [showWalletSelectModal, setShowWalletSelectModal] =
    useState<boolean>(false);

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

      <WalletSelectModal
        show={showWalletSelectModal}
        setShow={setShowWalletSelectModal}
      />
    </div>
  );
};

export default ConnectButton;

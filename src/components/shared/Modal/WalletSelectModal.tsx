"use client";

import React, { useEffect, useState } from "react";
import { MetamaskButton } from "../WalletButtons/Metamask";
import { RiCloseLine } from "react-icons/ri";
import { PhantomButton } from "../WalletButtons/Phantom";

interface Props {
  show: boolean;
  setShow: Function;
}

const WalletSelectModal = (props: Props) => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletConnection = (address: string) => {
    setWalletAddress(address);
    props.setShow(false);
  };

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] w-full h-screen backdrop-blur-md"
            onClick={() => props.setShow(false)}
          />
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            {walletAddress ? (
              <>
                <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
                  <p className="font-face-bebas text-nafl-white text-[31px]">
                    Wallet Connected
                  </p>
                  <RiCloseLine
                    onClick={() => props.setShow(!props.show)}
                    className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col items-center w-full md:px-[54px] px-[54px] py-[32px] gap-[20px] rounded-b-[20px]">
                  <div className="flex flex-col w-full gap-[10px]">
                    <button
                      className="flex items-center w-full"
                      onClick={() => setWalletAddress("")}
                    >
                      <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
                        Disconnect
                      </p>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
                  <p className="font-face-bebas text-nafl-white text-[31px]">
                    Select Wallet
                  </p>
                  <RiCloseLine
                    onClick={() => props.setShow(!props.show)}
                    className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col items-center w-full md:px-[54px] px-[54px] py-[32px] gap-[20px] rounded-b-[20px]">
                  <div className="flex flex-col w-full gap-[10px]">
                    <div className="w-full relative h-[55px]">
                      <MetamaskButton
                        onConnectionSuccess={handleWalletConnection}
                      />
                    </div>
                    <div className="w-full relative h-[55px]">
                      <PhantomButton
                        onConnectionSuccess={handleWalletConnection}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )
  );
};

export default WalletSelectModal;

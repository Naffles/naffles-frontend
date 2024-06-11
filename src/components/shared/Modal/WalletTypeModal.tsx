"use client";

import Web3 from "web3";
import { RiCloseLine } from "react-icons/ri";
import bs58 from "bs58";
import toast from "react-hot-toast";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

interface Props {
  show: boolean;
  setShow: Function;
}

const WalletTypeModal = (props: Props) => {
  const { reloadProfile } = useBasicUser();

  const signToAddWalletPhantom = async () => {
    props.setShow(false);
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        const timestamp = new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        });
        const message = new TextEncoder().encode(
          `Welcome to Naffles.com!\nPlease confirm your wallet connection.\n\nYour Address: ${response.publicKey.toString()}\nTimestamp: ${timestamp}\n\nThis signature request will expire 5 minutes after the timestamp shown above.`
        );

        const signedMessage = await solana.signMessage(message, "utf8");
        console.log("signed message: ", signedMessage);
        console.log({
          signature: bs58.encode(signedMessage.signature),
          address: response.publicKey.toBase58(),
          timestamp: timestamp,
        });

        // setWalletAddress(response.publicKey.toBase58());
        const validResponse = await axios.post("user/profile/wallet", {
          signature: bs58.encode(signedMessage.signature),
          address: response.publicKey.toBase58(),
          timestamp: timestamp,
          walletType: "phantom",
          network: "sol",
        });
        if (validResponse.status === 201) {
          // onConnectionSuccess(response.publicKey.toString())
          toast.success("wallet added");
          reloadProfile();
        }
        console.log(validResponse);
      } else {
        toast.error("Phantom wallet not found. Please install it.");
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(`${errorData.message}`);
    }
  };

  const signToAddWalletMetamask = async () => {
    props.setShow(false);
    if (window.ethereum) {
      try {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const ethAcc = await window.web3.eth.getAccounts();
        const publicKey = ethAcc[0];
        const timestamp = new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        });
        const message = `Welcome to Naffles.com!\nPlease confirm your wallet connection.\n\nYour Address: ${publicKey}\nTimestamp: ${timestamp}\n\nThis signature request will expire 5 minutes after the timestamp shown above.`;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, publicKey],
        });

        console.log({
          signature: signature,
          address: publicKey,
          timestamp: timestamp,
        });

        // setWalletAddress(publicKey);

        const validResponse = await axios.post("user/profile/wallet", {
          signature: signature,
          address: publicKey,
          timestamp: timestamp,
          walletType: "metamask",
          network: "eth",
        });

        if (validResponse.status === 201) {
          // onConnectionSuccess(publicKey.toString())
          reloadProfile();
          toast.success("wallet added");
        } else toast.error("Your signature has failed to verify");
        console.log(validResponse);
      } catch (error: any) {
        const errorData = error.response?.data;
        toast.error(`${errorData.message}`);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                Select Wallet
              </p>
              <RiCloseLine
                onClick={() => props.setShow(false)}
                className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center w-full md:px-[54px] px-[54px] py-[32px] gap-[20px] rounded-b-[20px]">
              <div className="flex flex-col w-full gap-[10px]">
                <div className="w-full relative h-[55px]">
                  <button
                    className="flex items-center w-full"
                    onClick={signToAddWalletMetamask}
                  >
                    <img
                      src="static/wallets/metamask.png"
                      alt="Metamask Icon"
                      className="w-[40px] object-contain"
                    />
                    <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
                      Metamask
                    </p>
                  </button>
                </div>
                <div className="w-full relative h-[55px]">
                  <button
                    onClick={signToAddWalletPhantom}
                    className="flex items-center w-full"
                  >
                    <img
                      src="static/wallets/phantom.png"
                      alt="Metamask Icon"
                      className="w-[40px] object-contain"
                    />
                    <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
                      Phantom
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default WalletTypeModal;

import { useUser } from "@blockchain/context/UserContext";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import axios from "@components/utils/axios";
import bs58 from "bs58";
import Web3 from "web3";

interface MetamaskButtonProps {
  onConnectionSuccess: (address: string) => void;
}

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export const MetamaskButton: React.FC<MetamaskButtonProps> = ({
  onConnectionSuccess,
}) => {
  const { setWalletAddress } = useUser();
  const { loginWithWallet } = useBasicUser();

  const connectAndSign = async () => {
    if (window.ethereum) {
      try {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const ethAcc = await window.web3.eth.getAccounts();
        const publicKey = ethAcc[0];
        const timestamp = new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        });
        const message = `Welcome to Naffles.com!\nPlease confirm your sign-in request.\n\nYour Address: ${publicKey}\nTimestamp: ${timestamp}\n\nThis signature request will expire 5 minutes after the timestamp shown above.`;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, publicKey],
        });

        console.log({
          signature: signature,
          address: publicKey,
          timestamp: timestamp,
        });

        setWalletAddress(publicKey);

        let body = {
          signature: signature,
          address: publicKey,
          timestamp: timestamp,
          walletType: "metamask",
          network: "eth",
        };
        loginWithWallet(body);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };

  return (
    <button className="flex items-center w-full" onClick={connectAndSign}>
      <img
        src="static/wallets/metamask.png"
        alt="Metamask Icon"
        className="w-[40px] object-contain"
      />
      <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
        Metamask
      </p>
    </button>
  );
};

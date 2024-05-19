import bs58 from "bs58";
import axios from "@components/utils/axios";
import { useUser } from "@blockchain/context/UserContext";
import toast from "react-hot-toast";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

interface PhantomButtonProps {
  onConnectionSuccess: (address: string) => void;
}

declare global {
  interface Window {
    solana: any;
  }
}

export const PhantomButton: React.FC<PhantomButtonProps> = ({
  onConnectionSuccess,
}) => {
  const { setWalletAddress } = useUser();
  const { loginWithWallet } = useBasicUser();

  const connectAndSign = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        const timestamp = new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        });
        const message = new TextEncoder().encode(
          `Welcome to Naffles.com!\nPlease confirm your sign-in request.\n\nYour Address: ${response.publicKey.toString()}\nTimestamp: ${timestamp}\n\nThis signature request will expire 5 minutes after the timestamp shown above.`
        );

        const signedMessage = await solana.signMessage(message, "utf8");
        console.log("signed message: ", signedMessage);
        console.log({
          signature: bs58.encode(signedMessage.signature),
          address: response.publicKey.toBase58(),
          timestamp: timestamp,
        });

        setWalletAddress(response.publicKey.toBase58());

        let body = {
          signature: bs58.encode(signedMessage.signature),
          address: response.publicKey.toBase58(),
          timestamp: timestamp,
          walletType: "metamask",
          network: "eth",
        };
        loginWithWallet(body);
      } else {
        toast.error("Phantom wallet not found. Please install it.");
      }
    } catch (error) {
      console.error("Error connecting to the Phantom wallet:", error);
    }
  };

  return (
    <button onClick={connectAndSign} className="flex items-center w-full">
      <img
        src="static/wallets/phantom.png"
        alt="Metamask Icon"
        className="w-[40px] object-contain"
      />
      <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
        Phantom
      </p>
    </button>
  );
};

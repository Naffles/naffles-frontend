import axios from "@components/utils/axios";
import bs58 from "bs58";
import Web3 from "web3";

interface MetamaskButtonProps {
  onConnectionSuccess: (address: string) => void;
}

export const MetamaskButton: React.FC<MetamaskButtonProps> = ({ onConnectionSuccess }) => {

  const connectAndSign = async () => {
    if (window.ethereum) {
      try {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const ethAcc = await window.web3.eth.getAccounts();

        const publicKey = ethAcc[0]
        const message = `naffles.com wants you to sign in with your address ${publicKey.toString()} Your signature will expire in 5 mins`;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, publicKey],
        });
        const timestamp = Date.now();
        console.log(signature, publicKey, timestamp)
        const validResponse = await axios.post("wallet/validate/metamask", {
          signature: signature,
          publicKey: publicKey,
          timestamp: timestamp
        });
        if (validResponse.status === 200) {
          onConnectionSuccess(publicKey.toString())
        } else (
          console.log("Your signature has failed to verify")
        )
        console.log(validResponse)
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
  }

  return (
    <button className="flex items-center w-full" onClick={connectAndSign}>
      <img src="static/wallets/metamask.png" alt="Metamask Icon"
        className="w-[40px] object-contain" />
      <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
        Metamask
      </p>
    </button>
  )
}
import bs58 from 'bs58';
import axios from '@components/utils/axios';

interface PhantomButtonProps {
  onConnectionSuccess: (address: string) => void;
}

export const PhantomButton: React.FC<PhantomButtonProps> = ({ onConnectionSuccess }) => {
  const connectAndSign = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        const response = await solana.connect();

        const timestamp = Date.now();
        const message = new TextEncoder().encode(`naffles.com wants you to sign in with your address ${response.publicKey.toString()} Your signature will expire in 5 mins`);
        const signedMessage = await solana.signMessage(message, "utf8");

        const validResponse = await axios.post("wallet/validate/phantom", {
          signature: bs58.encode(signedMessage.signature),
          publickey: response.publicKey.toBase58(),
          timestamp: timestamp
        });
        if (validResponse.status === 200) {
          onConnectionSuccess(response.publicKey.toString())
        }
        console.log(validResponse)
      } else {
        alert('Phantom wallet not found. Please install it.');
      }
    } catch (error) {
      console.error('Error connecting to the Phantom wallet:', error);
    }
  };

  return (
    <button onClick={connectAndSign} className="flex items-center w-full">
      <img src="static/wallets/phantom.png" alt="Metamask Icon"
        className="w-[40px] object-contain" />
      <p className="font-face-bebas text-nafl-white text-[31px] mx-auto">
        Phantom
      </p>
    </button>
  )
}
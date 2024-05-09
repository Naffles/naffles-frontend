import React, { useState, useEffect, useCallback } from 'react';
import bs58 from 'bs58';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from '@components/utils/axios';

const AccWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const connectAndSign = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        const response = await solana.connect();

        const message = new TextEncoder().encode("naffles.com wants you to sign in with your wallet");
        const signedMessage = await solana.signMessage(message, "utf8");

        const validResponse = await axios.post("wallet/validate", {
          signature: bs58.encode(signedMessage.signature),
          publickey: response.publicKey.toBase58()
        });
        if (validResponse.status === 200) {
          setWalletAddress(response.publicKey.toString())
        }
        console.log(validResponse)
      } else {
        alert('Phantom wallet not found. Please install it.');
      }
    } catch (error) {
      console.error('Error connecting to the Phantom wallet:', error);
    }
  };

  const disconnect = async () => {
    setWalletAddress(null);
    setSignatureData(null);

  }

  return (
    <div>
      {walletAddress ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={connectAndSign}>Connect</button>
      )}
    </div>
  );
};

export default AccWallet;
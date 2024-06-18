import Web3 from "web3";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const tokenValueConversion = (amount: string, tokenType: string) => {
  if (tokenType == "sol") {
    let solValue = parseFloat(amount) / (LAMPORTS_PER_SOL);
    return solValue.toString();
  } else {
    const web3 = new Web3();
    let weiAmoutBigInt = BigInt(amount);
    return web3.utils.fromWei(weiAmoutBigInt, "ether");
  }
};

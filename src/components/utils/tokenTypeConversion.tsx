import Web3 from "web3";

export const tokenValueConversion = (amount: string, tokenType: string) => {
  if (tokenType == "sol") {
    let solValue = Math.pow(parseFloat(amount) * 10, 9);
    return solValue.toString();
  } else {
    const web3 = new Web3();
    let weiAmoutBigInt = BigInt(amount);
    return web3.utils.fromWei(weiAmoutBigInt, "ether");
  }
};

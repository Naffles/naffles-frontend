"use client";

import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import axios from "@components/utils/axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";
import Web3 from "web3";

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
};

interface Props {
  show: boolean;
  setShow: Function;
  walletBalances: Balance[] | null;
}

const WithdrawModal = (props: Props) => {
  const { reloadProfile } = useBasicUser();
  const [showBalanceDropdown, setShowBalanceDropdown] =
    useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0.0);
  const [balanceType, setBalanceType] = useState<Balance>({
    id: "",
    tokenType: "",
    amount: "",
    conversion: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestWithdraw = async (amount: number, type: Balance) => {
    if (withdrawAmount > 0) {
      const web3 = new Web3();
      let weiAmount = web3.utils.toWei(amount.toString(), "ether");
      console.log("weiAmount: ", weiAmount);
      console.log("type: ", type);
      try {
        const result = await axios.post("user/withdraw", {
          amount: weiAmount,
          coinType: type.tokenType,
          network: type.tokenType,
        });

        console.log(result);
        if (result.status == 200) {
          toast.success("successfully requested withdrawal");
          setWithdrawAmount(0);
          reloadProfile();
        } else {
          toast.success("Requested withdrawal failed, please try again!");
        }
      } catch (error: any) {
        const errorData = error.response?.data;
        toast.error(`Error on Requesting Withdrawal: ${errorData.message}`);
      }
      props.setShow(false);
    } else {
      toast.error("Withdaw amount cannot be 0");
    }
  };

  useEffect(() => {
    props.walletBalances && setBalanceType(props.walletBalances[0]);
  }, [props.walletBalances]);

  let currency_name = [
    { type: "pts", name: "Points" },
    { type: "eth", name: "Ethereum" },
    { type: "btc", name: "Bitcoin" },
    { type: "bytes", name: "Neo Tokyo" },
    { type: "sol", name: "Solana" },
    { type: "naff", name: "Naffles" },
  ];

  const currencyIconReturner = (type: string) => {
    if (type == "eth") {
      return <FaEthereum className="text-[#fff]" />;
    } else if (type == "btc") {
      return <FaBitcoin className="text-[#fff]" />;
    } else if (type == "sol") {
      return <TbCurrencySolana className="text-[#fff]" />;
    } else if (type == "naff") {
      return (
        <img
          src="/static/naff-icon.png"
          alt="Bytes Icon"
          className="w-[12px] object-contain"
        />
      );
    } else if (type == "bytes") {
      return (
        <img
          src="/static/bytes-icon.png"
          alt="Bytes Icon"
          className="w-[12px] object-contain"
        />
      );
    }
  };

  const currencyNameConverter = (type: string) => {
    let currencyName = currency_name?.filter((item) => item?.type == type);
    return currencyName[0]?.name;
  };

  let sampleMaxAmount = 100;

  const setToMax = () => {
    toast.success("Max amount set");
    setWithdrawAmount(parseFloat(weiToEther(balanceType.amount)));
  };

  const weiToEther = (weiAmount: string) => {
    const web3 = new Web3();
    let weiAmoutBigInt = BigInt(weiAmount);
    return web3.utils.fromWei(weiAmoutBigInt, "ether");
  };

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] w-full h-screen"
            onClick={() => props.setShow(false)}
          />
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                WITHDRAW
              </p>
              <RiCloseLine
                onClick={() => props.setShow(!props.show)}
                className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center w-full md:px-[54px] px-[54px] py-[32px] gap-[20px] rounded-b-[20px]">
              <div className="flex flex-col w-full gap-[10px]">
                <div className="w-full relative h-[55px]">
                  <button
                    onClick={() => setShowBalanceDropdown(!showBalanceDropdown)}
                    className="flex items-center w-full h-full rounded-[11px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] gap-[10px]"
                  >
                    {currencyIconReturner(balanceType?.tokenType)}
                    <p className="text-[#fff] text-[16px] font-face-bebas">
                      {currencyNameConverter(balanceType?.tokenType)}
                    </p>
                    <p className="text-[#867878] text-[16px] font-face-bebas">
                      {`${weiToEther(balanceType?.amount)} ${balanceType?.tokenType}`}
                    </p>
                    <RiExpandUpDownLine className="absolute text-[20px] right-[12px] text-nafl-sponge-500" />
                  </button>
                  {showBalanceDropdown && (
                    <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
                      <div className="flex flex-col w-full gap-[6px]">
                        {props.walletBalances?.map((item, index) => (
                          <button
                            onClick={() => {
                              setBalanceType(item);
                              setShowBalanceDropdown(false);
                            }}
                            key={index}
                            className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                              balanceType.tokenType == item?.tokenType &&
                              "bg-[#fff]/30"
                            }`}
                          >
                            {currencyIconReturner(item?.tokenType)}
                            <p className="text-[#fff] text-[16px] font-face-bebas">
                              {currencyNameConverter(item?.tokenType)}
                            </p>
                            <p className="text-[#cfcece] text-[16px] font-face-bebas truncate">
                              BALANCE:{" "}
                              {`${weiToEther(item?.amount)} ${item?.tokenType}`}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center w-full relative overflow-hidden gap-[10px]">
                <input
                  value={withdrawAmount}
                  onChange={(e) =>
                    parseFloat(e.target.value) > 0 &&
                    setWithdrawAmount(parseFloat(e.target.value))
                  }
                  placeholder="Amount"
                  type="number"
                  step={0.01}
                  min={0}
                  max={sampleMaxAmount}
                  className="w-full h-[50px] border-[1px] border-nafl-sponge-500 pl-[36px] pr-[60px] font-face-roboto bg-[#4B4B4B] rounded-[10px]"
                />
                <div className="absolute left-[13px] top-[20px]">
                  {currencyIconReturner(balanceType?.tokenType)}
                </div>
                <div
                  onClick={() => setToMax()}
                  className="absolute right-[19px] top-[18px] font-face-roboto leading-[100%] cursor-pointer"
                >
                  Max
                </div>
                <div className="flex w-full items-center justify-end">
                  <p className="text-[#00E0DF] text-[12px]">
                    Estimated value: ~ $0.00
                  </p>
                </div>
              </div>
              <button
                onClick={() => requestWithdraw(withdrawAmount, balanceType)}
                className="bg-nafl-sponge-500 rounded-[8px] w-[240px] h-[54px] mx-[6px]"
              >
                <p className="text-[#000] text-[18px] font-bold">
                  REQUEST WITHDRAW
                </p>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default WithdrawModal;

"use client";

import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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

const DepositModal = (props: Props) => {
  const [showBalanceDropdown, setShowBalanceDropdown] =
    useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>("0.0");
  const [balanceType, setBalanceType] = useState<Balance>({
    id: "",
    tokenType: "",
    amount: "",
    conversion: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { reloadProfile } = useBasicUser();

  useEffect(() => {
    props.walletBalances && setBalanceType(props.walletBalances[0]);
  }, [props.walletBalances]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const clickedElementClass = clickedElement.className;

      if (
        !clickedElementClass ||
        typeof clickedElementClass != "string" ||
        clickedElementClass.indexOf("balance-type-dropdown") < 0
      ) {
        setShowBalanceDropdown(false);
      }
    };

    // Add event listener on document for clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const createTransaction = async (amount: string, toAddress: string) => {
    if (window.ethereum) {
      setIsLoading(true);
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (err) {
        toast.error("Connecting wallet has failed");
        return;
      }

      const amountInWei = window.web3.utils.toWei(amount, "ether");
      const ethAcc = await window.web3.eth.getAccounts();

      window.web3.eth
        .sendTransaction({
          from: ethAcc[0],
          to: toAddress,
          gas: "21000",
          value: amountInWei,
        })
        .then((receipt: any) => {
          console.log(receipt, "txn receipt");
          toast.success("Transaction Sucessful");
          reloadProfile();
          setIsLoading(false);
          setBalanceType({
            id: "",
            tokenType: "",
            amount: "",
            conversion: "",
          });
          setDepositAmount("0");
          setTimeout(() => {
            props.setShow(false);
          }, 2000);
        })
        .catch((err: any) => {
          console.log(err, "error");
          setIsLoading(false);
        });
    } else {
      toast.error("Please install Ethereum wallet");
    }
  };

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] backdrop-blur-md w-full h-screen"
            onClick={() => props.setShow(false)}
          />
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                DEPOSIT
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
                    className="flex items-center w-full h-full rounded-[11px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] gap-[10px] balance-type-dropdown"
                  >
                    {currencyIconReturner(balanceType?.tokenType)}
                    <p className="text-[#fff] text-[16px] font-face-bebas balance-type-dropdown">
                      {currencyNameConverter(balanceType?.tokenType)}
                    </p>
                    <p className="text-[#867878] text-[16px] font-face-bebas balance-type-dropdown">
                      {`${tokenValueConversion(balanceType?.amount, balanceType.tokenType) == "0." ? 0 : tokenValueConversion(balanceType?.amount, balanceType.tokenType)} ${balanceType?.tokenType}`}
                    </p>
                    <RiExpandUpDownLine className="absolute text-[20px] right-[12px] text-nafl-sponge-500" />
                  </button>
                  {showBalanceDropdown && (
                    <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar balance-type-dropdown">
                      <div className="flex flex-col w-full gap-[6px]">
                        {props?.walletBalances?.map((item, index) => (
                          <button
                            onClick={() => {
                              setBalanceType(item);
                              setShowBalanceDropdown(false);
                            }}
                            key={index}
                            className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] balance-type-dropdown ${
                              balanceType.tokenType == item?.tokenType &&
                              "bg-[#fff]/30"
                            }`}
                          >
                            {currencyIconReturner(item?.tokenType)}
                            <p className="text-[#fff] text-[16px] font-face-bebas balance-type-dropdown">
                              {currencyNameConverter(item?.tokenType)}
                            </p>
                            <p className="text-[#cfcece] text-[16px] font-face-bebas truncate balance-type-dropdown">
                              BALANCE:{" "}
                              {`${tokenValueConversion(item?.amount, item.tokenType) == "0." ? 0 : tokenValueConversion(item?.amount, item.tokenType)} ${item?.tokenType}`}
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
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Amount"
                  type="number"
                  step={0.01}
                  min={0}
                  className="w-full h-[50px] border-[1px] border-nafl-sponge-500 px-[36px] font-face-roboto bg-[#4B4B4B] rounded-[10px] text-nafl-white"
                />
                <div className="absolute left-[13px] top-[20px]">
                  {currencyIconReturner(balanceType?.tokenType)}
                </div>
                <div className="flex w-full items-center justify-end">
                  <p className="text-[#00E0DF] text-[12px]">
                    Estimated value: ~ $0.00
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  createTransaction(
                    depositAmount,
                    "0x829c609b5EED7A5D53C684B5f8b1d3aa6DE46145"
                  )
                }
                disabled={isLoading}
                className="flex flex-row items-center justify-center gap-[8px] bg-nafl-sponge-500 rounded-[8px] px-[40px] h-[54px] mx-[6px]"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="text-[18px] text-[#000] animate-spin" />
                    <p className="text-[#000] text-[18px] font-bold">
                      LOADING...
                    </p>
                  </>
                ) : (
                  <p className="text-[#000] text-[18px] font-bold">DEPOSIT</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default DepositModal;

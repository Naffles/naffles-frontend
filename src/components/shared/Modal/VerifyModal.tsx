"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";

interface Props {
  show: boolean;
  setShow: Function;
  walletBalances: {
    id: number;
    type: string;
    balance: string;
    usd: string;
  }[];
}

const VerifyModal = (props: Props) => {
  const [stakingCount, setStakingCount] = useState<number>(1);
  const [stakingPeriod, setStakingPeriod] = useState<string>("month");
  const [showStakingPeriodDropdown, setShowStakingPeriodDropdown] =
    useState<boolean>(false);
  const [showBalanceDropdown, setShowBalanceDropdown] =
    useState<boolean>(false);
  const [depositAmout, setDepositAmout] = useState<number>(0.0);
  const [balanceType, setBalanceType] = useState<{
    type: string;
    balance: string;
    usd: string;
  }>({
    type: "",
    balance: "",
    usd: "",
  });

  const deposit = () => {
    if (depositAmout > 0) {
      toast.success("You have successfully staked");
      props.setShow(false);
    } else {
      toast.error("Deposit amount cannot be 0");
    }
  };

  useEffect(() => {
    if (balanceType.type == "") {
      setBalanceType(props.walletBalances[0]);
    }
  }, [balanceType, props.walletBalances]);

  let currency_name = [
    { type: "PTS", name: "Points" },
    { type: "ETH", name: "Ethereum" },
    { type: "BTC", name: "Bitcoin" },
    { type: "BYTES", name: "Neo Tokyo" },
    { type: "SOL", name: "Solana" },
    { type: "NAFF", name: "Naffles" },
  ];

  const currencyIconReturner = (type: string) => {
    if (type == "ETH") {
      return <FaEthereum className="text-[#fff]" />;
    } else if (type == "BTC") {
      return <FaBitcoin className="text-[#fff]" />;
    } else if (type == "SOL") {
      return <TbCurrencySolana className="text-[#fff]" />;
    } else if (type == "NAFF") {
      return (
        <img
          src="/static/naff-icon.png"
          alt="Bytes Icon"
          className="w-[12px] object-contain"
        />
      );
    } else if (type == "BYTES") {
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
                    className="flex items-center w-full h-full rounded-[11px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] gap-[10px]"
                  >
                    {currencyIconReturner(balanceType?.type)}
                    <p className="text-[#fff] text-[16px] font-face-bebas">
                      {currencyNameConverter(balanceType?.type)}
                    </p>
                    <p className="text-[#867878] text-[16px] font-face-bebas">
                      {`${balanceType?.balance} ${balanceType?.type}`}
                    </p>
                    <RiExpandUpDownLine className="absolute text-[20px] right-[12px] text-nafl-sponge-500" />
                  </button>
                  {showBalanceDropdown && (
                    <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
                      <div className="flex flex-col w-full gap-[6px]">
                        {props.walletBalances.map((item) => (
                          <button
                            onClick={() => {
                              setBalanceType(item);
                              setShowBalanceDropdown(false);
                            }}
                            key={item.id}
                            className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                              balanceType.type == item?.type && "bg-[#fff]/30"
                            }`}
                          >
                            {currencyIconReturner(item?.type)}
                            <p className="text-[#fff] text-[16px] font-face-bebas">
                              {currencyNameConverter(item?.type)}
                            </p>
                            <p className="text-[#cfcece] text-[16px] font-face-bebas truncate">
                              BALANCE: {`${item?.balance} ${item?.type}`}
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
                  value={depositAmout}
                  onChange={(e) =>
                    parseFloat(e.target.value) > 0 &&
                    setDepositAmout(parseFloat(e.target.value))
                  }
                  placeholder="Amount"
                  type="number"
                  step={0.01}
                  className="w-full h-[50px] border-[1px] border-nafl-sponge-500 px-[36px] font-face-roboto bg-[#4B4B4B] border-0 rounded-[10px]"
                />
                <div className="absolute left-[13px] top-[20px]">
                  {currencyIconReturner(balanceType?.type)}
                </div>
                <div className="flex w-full items-center justify-end">
                  <p className="text-[#00E0DF] text-[12px]">
                    Estimated value: ~ $0.00
                  </p>
                </div>
              </div>
              <button
                onClick={() => deposit()}
                className="bg-nafl-sponge-500 rounded-[8px] w-[136px] h-[54px] mx-[6px]"
              >
                <p className="text-[#000] text-[18px] font-bold">DEPOSIT</p>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default VerifyModal;

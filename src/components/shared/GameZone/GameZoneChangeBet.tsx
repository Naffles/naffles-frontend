"use client";

import { useEffect, useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";
import useGame from "@components/utils/gamezone";
import { useUser } from "@blockchain/context/UserContext";
import toast from "react-hot-toast";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
import Web3 from "web3";

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
  isWalletConnected: boolean;
};

const GameZoneChangeBet = () => {
  const { user, socket } = useUser();
  const currentGameId = useGame((state) => state.gameId);
  const setCurrentScreen = useGame((state) => state.setScreen);
  const setChangingBet = useGame((state) => state.setChangingBet);

  const [balanceType, setBalanceType] = useState<Balance | null>(null);

  const [balanceTypeDropdown, setBalanceTypeDropdown] =
    useState<boolean>(false);
  const [balanceAmount, setBalanceAmount] = useState<string>("0.0001");
  const [betMultiplierChoice, setBetMultiplierChoice] = useState<number>(1);
  const [betMultiplierChoiceDropdown, setBetMultiplierChoiceDropdown] =
    useState<boolean>(false);
  const [totalPayout, setTotalPayout] = useState<number>(0);
  const [balancesOptionData, setBalancesOptionData] = useState<Balance[]>([]);

  let currency_name = [
    { type: "pts", name: "Points" },
    { type: "eth", name: "Ethereum" },
    { type: "btc", name: "Bitcoin" },
    { type: "bytes", name: "Neo Tokyo" },
    { type: "sol", name: "Solana" },
    { type: "naff", name: "Naffles" },
  ];

  let bet_multiplier_options = [1, 2, 3, 4, 5, 10];

  useEffect(() => {
    user?.balances && setBalancesOptionData(user?.balances);
  }, [user?.balances]);

  useEffect(() => {
    if (balancesOptionData.length <= 0) return;
    // console.log("balancesOptionData", balancesOptionData);
    setBalanceType(balancesOptionData[0]);
  }, [balancesOptionData]);

  const currencyNameConverter = (type: string) => {
    let currencyName = currency_name?.filter((item) => item?.type == type);
    return currencyName[0]?.name;
  };

  useEffect(() => {
    let challengerBuyIn = parseFloat(balanceAmount) / betMultiplierChoice;
    setTotalPayout(parseFloat(balanceAmount) + challengerBuyIn);
  }, [balanceAmount, betMultiplierChoice]);

  useEffect(() => {
    const checkBetChangeRequestStatus = (data: any) => {
      // console.log("pa note", data);
      if (data) {
        toast.success("Bet change request succeeded");
        setChangingBet(false);
      } else {
        toast.error("You do not have enough balance");
      }
    };

    socket?.on("changeBetRequestSent", checkBetChangeRequestStatus);

    return () => {
      socket?.off("changeBetRequestSent", checkBetChangeRequestStatus);
    };
  }, [socket]);

  const changeBet = (
    gameId: string,
    betAmount: string,
    odds: string,
    tokenType: string
  ) => {
    const web3 = new Web3();

    let tokenAmount = "0";
    if (tokenType == "sol") {
      let solValue = parseFloat(betAmount) / Math.pow(10, 9);
      tokenAmount = solValue.toString();
    } else {
      tokenAmount = web3.utils.toWei(betAmount, "ether");
    }

    socket?.emit("requestBetUpdate", {
      gameId: gameId,
      betAmount: tokenAmount,
      odds: odds,
    });
    // toast.success("Change bet request sent to opposing player");
  };

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

  return (
    <div className="flex flex-col items-center py-[20px] gap-[20px] w-[540px] z-20 bg-[#383838]">
      <div className="flex flex-col w-full gap-[4px]">
        <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
          1. SET THE BET
        </p>
        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
      </div>

      <div className="flex flex-row items-center gap-[24px]">
        <div className="flex items-center w-[311px] relative">
          <button
            // onClick={() =>
            //   setBalanceTypeDropdown(balanceTypeDropdown ? false : true)
            // }
            className="flex items-center gap-[10px] justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B]"
          >
            {currencyIconReturner(balanceType?.tokenType ?? "NA")}
            <p className="text-[#fff] text-[16px] font-face-bebas">
              {currencyNameConverter(balanceType?.tokenType ?? "NA")}
            </p>
            <p className="text-[#867878] text-[16px] font-face-bebas">
              BALANCE:{" "}
              {`${balanceType && tokenValueConversion(balanceType?.amount, balanceType?.tokenType)} ${balanceType?.tokenType}`}
            </p>
          </button>
          <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />
          {balanceTypeDropdown && (
            <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
              <div className="flex flex-col w-full gap-[6px]">
                {balancesOptionData?.map((item) => (
                  <button
                    onClick={() => {
                      if (parseFloat(item.amount) <= 0) {
                        toast.error("Using 0 balance is not allowed");
                      } else {
                        setBalanceType(item);
                        setBalanceTypeDropdown(false);
                      }
                    }}
                    key={item.id}
                    className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                      balanceType?.tokenType == item?.tokenType &&
                      "bg-[#fff]/30"
                    } ${parseFloat(item.amount) <= 0 ? "opacity-100" : "opacity-30"}`}
                  >
                    {currencyIconReturner(item?.tokenType)}
                    <p className="text-[#fff] text-[16px] font-face-bebas">
                      {currencyNameConverter(item?.tokenType)}
                    </p>
                    <p className="text-[#cfcece] text-[16px] font-face-bebas truncate">
                      BALANCE:{" "}
                      {`${tokenValueConversion(item?.amount, item.tokenType) == "0." ? 0 : tokenValueConversion(item?.amount, item.tokenType)} ${item?.tokenType}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <input
          type="number"
          min={0}
          value={balanceAmount}
          onChange={(e) => setBalanceAmount(e.target.value)}
          max={user?.points}
          className="flex items-center justify-start w-[190px] h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] font-face-bebas text-[16px] text-[#fff]"
        />
      </div>

      <div className="flex flex-col w-full gap-[4px]">
        <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
          2. SET THE ODDS
        </p>
        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
      </div>

      <div className="flex flex-row items-center gap-[24px] justify-start w-full">
        <div className="flex items-center w-[145px] relative">
          <button
            onClick={() =>
              setBetMultiplierChoiceDropdown(
                betMultiplierChoiceDropdown ? false : true
              )
            }
            className="flex items-center gap-[10px] justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B]"
          >
            <p className="text-[#fff] text-[16px] font-face-bebas">
              x {betMultiplierChoice}
            </p>
          </button>
          <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />

          {betMultiplierChoiceDropdown && (
            <div className="flex flex-col w-full rounded-[10px] absolute top-[60px] bg-[#4B4B4B] h-[290px] z-40 p-[10px] gap-[6px]">
              {bet_multiplier_options.map((item) => (
                <button
                  onClick={() => {
                    setBetMultiplierChoice(item);
                    setBetMultiplierChoiceDropdown(false);
                  }}
                  key={item}
                  className={`flex items-center w-full h-[54px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[20px] ${
                    betMultiplierChoice == item && "bg-[#fff]/30"
                  }`}
                >
                  <p className="text-[#fff] text-[16px] font-face-bebas">
                    {item}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-row w-full items-center justify-center gap-[16px]">
          <p className=" text-[#989898] text-[14px]">
            Buy-in:{" "}
            <span className="text-[#fff] font-face-roboto italic uppercase font-bold">
              {balanceAmount}
              {balanceType?.tokenType}
            </span>
          </p>
          <p className=" text-[#989898] text-[14px]">
            Payout:{" "}
            <span className="text-[#fff] font-face-roboto italic uppercase font-bold">
              {totalPayout} {balanceType?.tokenType}
            </span>
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-nafl-sponge-500"></div>

      <div className="flex flex-row items-center justify-center gap-[20px]">
        <button
          onClick={() => setChangingBet(false)}
          className="flex items-center justify-center px-[30px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500"
        >
          <p className="text-[#fff] text-[18px] font-bold">BACK</p>
        </button>
        <button
          onClick={() =>
            currentGameId &&
            balanceType &&
            changeBet(
              currentGameId,
              balanceAmount?.toString(),
              betMultiplierChoice?.toString(),
              balanceType?.tokenType
            )
          }
          className="flex items-center justify-center px-[30px] h-[54px] rounded-[8px] bg-nafl-sponge-500"
        >
          <p className="text-[#000] text-[18px] font-bold">CHANGE BET</p>
        </button>
      </div>
      <div className="flex flex-row items-center justify-center mb-[17px] gap-[20px]">
        <button
          onClick={() => setCurrentScreen("main")}
          className="flex items-center justify-center px-[30px] h-[54px] rounded-[8px] border-[1px] border-nafl-sponge-500"
        >
          <p className="text-[#fff] text-[18px] font-bold">BACK</p>
        </button>
        <button
          disabled
          className="flex items-center justify-center w-[312px] h-[54px] rounded-[8px] bg-transparent border-[1px] border-[#464646]"
        >
          <p className="text-[#fff] text-[18px] font-bold">
            WAITING FOR CHALLENGER ...
          </p>
        </button>
      </div>
    </div>
  );
};

export default GameZoneChangeBet;

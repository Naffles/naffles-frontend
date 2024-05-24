"use client";

import BrandIcon from "@components/icons/brandIcon";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";
import useGame from "@components/utils/gamezone";
import { AiOutlineLoading } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { error } from "console";
import Web3 from "web3";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
};

const GameZoneCreateGame = () => {
  const { user, socket } = useUser();
  const setCurrentScreen = useGame((state) => state.setScreen);

  const [gameChoice, setGameChoice] = useState<string>(
    "ROCK, PAPERS, SCISSORS"
  );
  const [gameChoiceDropdown, setGameChoiceDropdown] = useState<boolean>(false);
  const [balanceType, setBalanceType] = useState<Balance | null>(null);
  const [balanceTypeDropdown, setBalanceTypeDropdown] =
    useState<boolean>(false);
  const [balanceAmount, setBalanceAmount] = useState<string>("0.0001");
  const [betMultiplierChoice, setBetMultiplierChoice] = useState<number>(1);
  const [betMultiplierChoiceDropdown, setBetMultiplierChoiceDropdown] =
    useState<boolean>(false);
  const [totalPayout, setTotalPayout] = useState<number>(0);
  const [challengerBuyIn, setChallengerBuyIn] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balancesOptionData, setBalancesOptionData] = useState<Balance[]>([]);

  let games_choice_options = ["ROCK, PAPERS, SCISSORS", "COIN TOSS"];

  useEffect(() => {
    user?.balances && setBalancesOptionData(user?.balances);
  }, [user?.balances]);

  useEffect(() => {
    if (balancesOptionData.length <= 0) return;
    console.log("balancesOptionData", balancesOptionData);
    setBalanceType(balancesOptionData[0]);
  }, [balancesOptionData]);

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
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const clickedElementClass = clickedElement.className;

      if (
        !clickedElementClass ||
        typeof clickedElementClass != "string" ||
        clickedElementClass.indexOf("game-choice-dropdown") < 0
      ) {
        setGameChoiceDropdown(false);
      }

      if (
        !clickedElementClass ||
        typeof clickedElementClass != "string" ||
        clickedElementClass.indexOf("balance-type-dropdown") < 0
      ) {
        setBalanceTypeDropdown(false);
      }

      if (
        !clickedElementClass ||
        typeof clickedElementClass != "string" ||
        clickedElementClass.indexOf("odds-dropdown") < 0
      ) {
        setBetMultiplierChoiceDropdown(false);
      }
    };

    // Add event listener on document for clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currencyNameConverter = (type: string) => {
    let currencyName = currency_name?.filter((item) => item?.type == type);
    return currencyName[0]?.name;
  };

  useEffect(() => {
    let challengerBuyIn = parseFloat(balanceAmount) / betMultiplierChoice;
    setTotalPayout(parseFloat(balanceAmount) + challengerBuyIn);

    setChallengerBuyIn(challengerBuyIn);
  }, [balanceAmount, betMultiplierChoice]);

  const createGame = async (
    balanceAmount: string,
    betMultiplierChoice: number,
    coinType: string
  ) => {
    setIsLoading(true);
    var jwt = user?.jwt;

    console.log("coinType:", coinType);

    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    const web3 = new Web3();

    let tokenAmount = "0";
    if (coinType == "sol") {
      let solValue = parseFloat(balanceAmount) / Math.pow(10, 9);
      tokenAmount = solValue.toString();
    } else {
      tokenAmount = web3.utils.toWei(balanceAmount, "ether");
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({
          gameType:
            gameChoice == "ROCK, PAPERS, SCISSORS"
              ? "rockPaperScissors"
              : "coinToss",
          coinType: coinType,
          betAmount: tokenAmount,
          odds: betMultiplierChoice.toString(),
        }),
      });

      const result = await response.json();

      console.log("RESULT :", result);

      if (result.statusCode == 201 && response.ok) {
        // console.log("GAME CREATED", result?.data?.game?._id);

        socket?.emit("createNewGame", { gameId: result?.data?.game?._id });
        socket?.emit("emitGlobalMessageForNewGameCreated", {
          gameId: result?.data?.game?._id,
        });
        // result &&
        //   socket.emit("notificationRoom", { id: result?.data?.game?._id });
        setCurrentScreen("main");
        toast.success("Game Created");
      } else {
        console.error("Failed to create game: ", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating game: ", error);
    }
    setIsLoading(false);
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
    <div className="flex flex-col md:w-[500px] max-w-[500px] w-[90%] bg-[#383838] rounded-[16px]">
      <div className="flex items-center justify-center w-full h-[76px] bg-[#202020] rounded-t-[16px]">
        <p className="text-[40px] text-[#fff] font-face-bebas">CREATE GAME</p>
      </div>
      <div className="flex flex-col items-center w-full md:px-[51px] px-[20px] py-[20px] gap-[20px]">
        <div className="flex flex-col w-full gap-[4px]">
          <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
            1. CHOOSE YOUR GAME
          </p>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        </div>

        <div className="flex items-center w-full relative game-choice-dropdown">
          <button
            onClick={() => {
              console.log("clicked");
              setGameChoiceDropdown(gameChoiceDropdown ? false : true);
            }}
            className="flex items-center justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] game-choice-dropdown"
          >
            <p className="text-[#fff] text-[16px] font-face-bebas game-choice-dropdown">
              {gameChoice}
            </p>
          </button>
          <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />
          {gameChoiceDropdown && (
            <div className="flex flex-col w-full rounded-[10px] absolute top-[60px] bg-[#4B4B4B] h-[160px] z-40 p-[10px] gap-[6px]">
              {games_choice_options.map((item) => (
                <button
                  onClick={() => {
                    setGameChoice(item);
                    setGameChoiceDropdown(false);
                  }}
                  key={item}
                  className={`flex items-center w-full h-[54px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[20px] ${
                    gameChoice == item && "bg-[#fff]/30"
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

        <div className="flex flex-col w-full gap-[4px]">
          <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
            2. SET THE BET
          </p>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-[20px]">
          <div className="flex items-center w-[250px] relative balance-type-dropdown">
            <button
              onClick={() =>
                setBalanceTypeDropdown(balanceTypeDropdown ? false : true)
              }
              className="flex items-center gap-[10px] justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] balance-type-dropdown"
            >
              {currencyIconReturner(balanceType?.tokenType ?? "NA")}
              <p className="text-[#fff] text-[16px] font-face-bebas balance-type-dropdown">
                {currencyNameConverter(balanceType?.tokenType ?? "NA")}
              </p>
              <p className="text-[#867878] text-[16px] font-face-bebas balance-type-dropdown">
                BALANCE:{" "}
                {`${(balanceType?.amount && tokenValueConversion(balanceType?.amount, balanceType.tokenType)) == "0." ? 0 : balanceType?.amount && tokenValueConversion(balanceType?.amount, balanceType.tokenType)} ${balanceType?.tokenType ?? "NA"}`}
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
            className="flex items-center justify-start w-[126px] h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] font-face-bebas text-[16px] text-[#fff]"
          />
        </div>

        <div className="flex flex-col w-full gap-[4px]">
          <p className="text-[20px] text-nafl-sponge-500 font-face-bebas">
            3. SET THE ODDS
          </p>
          <div className="w-full h-[1px] bg-nafl-sponge-500"></div>
        </div>

        <div className="flex flex-row items-center gap-[24px] justify-start w-full">
          <div className="flex items-center w-[145px] relative odds-dropdown">
            <button
              onClick={() =>
                setBetMultiplierChoiceDropdown(
                  betMultiplierChoiceDropdown ? false : true
                )
              }
              className="flex items-center gap-[10px] justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B] odds-dropdown"
            >
              <p className="text-[#fff] text-[16px] font-face-bebas odds-dropdown">
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
          <div className="flex flex-col">
            <p className=" text-[#989898] text-[14px]">
              Your Buy-in:{" "}
              <span className="text-[#fff] font-face-roboto italic">
                {parseFloat(balanceAmount).toFixed(4)}{" "}
                {balanceType?.tokenType ?? "N/A"}
              </span>
            </p>
            <p className=" text-[#989898] text-[14px]">
              Challenger Buy-in:{" "}
              <span className="text-[#fff] font-face-roboto italic">
                {challengerBuyIn.toFixed(4)} {balanceType?.tokenType ?? "N/A"}
              </span>
            </p>
            <p className=" text-[#989898] text-[14px]">
              Your Payout:{" "}
              <span className="text-[#fff] font-face-roboto italic">
                {totalPayout.toFixed(4)} {balanceType?.tokenType ?? "N/A"}
              </span>
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>

        <button
          onClick={() =>
            user?.jwt
              ? parseFloat(balanceAmount) <= 0
                ? toast.error("Bet amount should cannot be set to 0.")
                : balanceType &&
                  createGame(
                    balanceAmount,
                    betMultiplierChoice,
                    balanceType?.tokenType
                  )
              : toast.error("Login first before making a game.")
          }
          className="flex items-center justify-center w-[183px] h-[54px] rounded-[8px] bg-nafl-sponge-500 mb-[17px]"
        >
          {isLoading ? (
            <AiOutlineLoading className="text-[#000] text-[20px] animate-spin" />
          ) : (
            <p className="text-[#000] text-[18px] font-bold">CREATE GAME</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameZoneCreateGame;

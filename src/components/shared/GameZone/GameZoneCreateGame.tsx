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

const GameZoneCreateGame = () => {
  const { user, socket } = useUser();
  const setCurrentScreen = useGame((state) => state.setScreen);

  const [gameChoice, setGameChoice] = useState<string>(
    "ROCK, PAPERS, SCISSORS"
  );
  const [gameChoiceDropdown, setGameChoiceDropdown] = useState<boolean>(false);
  const [balanceType, setBalanceType] = useState<{
    type: string;
    balance: string;
    usd: string;
  }>({
    type: "",
    balance: "",
    usd: "",
  });
  const [balanceTypeDropdown, setBalanceTypeDropdown] =
    useState<boolean>(false);
  const [balanceAmount, setBalanceAmount] = useState<number>(0.0001);
  const [betMultiplierChoice, setBetMultiplierChoice] = useState<number>(1);
  const [betMultiplierChoiceDropdown, setBetMultiplierChoiceDropdown] =
    useState<boolean>(false);
  const [totalPayout, setTotalPayout] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let games_choice_options = ["ROCK, PAPERS, SCISSORS", "COIN TOSS"];

  let sample_balances_json = [
    {
      id: 11,
      type: "Points",
      balance: "10000",
      usd: "N/A",
    },
    {
      id: 1,
      type: "ETH",
      balance: "1.2369",
      usd: "3569",
    },
    {
      id: 2,
      type: "BTC",
      balance: "0.2369",
      usd: "3569",
    },
    {
      id: 3,
      type: "BYTES",
      balance: "23.2369",
      usd: "3569",
    },
    {
      id: 4,
      type: "SOL",
      balance: "5.2369",
      usd: "3569",
    },
    {
      id: 5,
      type: "NAFF",
      balance: "1.2369",
      usd: "3569",
    },
    {
      id: 6,
      type: "BTC",
      balance: "0.2369",
      usd: "3569",
    },
  ];

  let currency_name = [
    { type: "PTS", name: "Points" },
    { type: "ETH", name: "Ethereum" },
    { type: "BTC", name: "Bitcoin" },
    { type: "BYTES", name: "Neo Tokyo" },
    { type: "SOL", name: "Solana" },
    { type: "NAFF", name: "Naffles" },
  ];

  let bet_multiplier_options = [1, 2, 3, 4, 5, 10];

  useEffect(() => {
    if (balanceType.type == "") {
      setBalanceType(sample_balances_json[0]);
    }
  }, [balanceType, sample_balances_json]);

  const currencyNameConverter = (type: string) => {
    let currencyName = currency_name?.filter((item) => item?.type == type);
    return currencyName[0]?.name;
  };

  useEffect(() => {
    setTotalPayout(balanceAmount * betMultiplierChoice);
  }, [balanceAmount, betMultiplierChoice]);

  const createGame = async () => {
    setIsLoading(true);
    var jwt = user?.jwt;

    console.log("jwt", jwt);

    if (!socket) {
      console.error("Socket not connected");
      return;
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
          coinType: "points",
          betAmount: balanceAmount,
          odds: betMultiplierChoice,
        }),
      });

      const result = await response.json();

      console.log("RESULT :", result);

      if (result.statusCode == 201 && response.ok) {
        // console.log("GAME CREATED", result?.data?.game?._id);

        socket?.emit("createNewGame", { gameId: result?.data?.game?._id });
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

        <div className="flex items-center w-full relative">
          <button
            onClick={() => {
              console.log("clicked");
              setGameChoiceDropdown(gameChoiceDropdown ? false : true);
            }}
            className="flex items-center justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B]"
          >
            <p className="text-[#fff] text-[16px] font-face-bebas">
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
          <div className="flex items-center w-[250px] relative">
            <button
              onClick={() =>
                setBalanceTypeDropdown(balanceTypeDropdown ? false : true)
              }
              className="flex items-center gap-[10px] justify-start w-full h-[54px] rounded-[10px] border-[1px] border-nafl-sponge-500 px-[12px] bg-[#4B4B4B]"
            >
              {currencyIconReturner(balanceType?.type)}
              <p className="text-[#fff] text-[16px] font-face-bebas">
                {currencyNameConverter(balanceType?.type)}
              </p>
              <p className="text-[#867878] text-[16px] font-face-bebas">
                BALANCE: {`${balanceType?.balance} ${balanceType?.type}`}
              </p>
            </button>
            <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />
            {balanceTypeDropdown && (
              <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
                <div className="flex flex-col w-full gap-[6px]">
                  {sample_balances_json.map((item) => (
                    <button
                      onClick={() => {
                        if (item.type != "Points") {
                          toast.error("Using this balance is not allowed");
                        } else {
                          setBalanceType(item);
                          setBalanceTypeDropdown(false);
                        }
                      }}
                      key={item.id}
                      className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                        balanceType.type == item?.type && "bg-[#fff]/30"
                      } ${item.type == "Points" ? "opacity-100" : "opacity-30"}`}
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
          <input
            type="text"
            value={balanceAmount}
            onChange={(e) =>
              parseFloat(e.target.value) &&
              setBalanceAmount(parseFloat(e.target.value))
            }
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
          <div className="flex flex-col">
            <p className=" text-[#989898] text-[14px]">
              Buy-in:{" "}
              <span className="text-[#fff] font-face-roboto italic">
                {balanceAmount.toFixed(balanceType.type == "Points" ? 2 : 4)}{" "}
                {balanceType.type}
              </span>
            </p>
            <p className=" text-[#989898] text-[14px]">
              Payout:{" "}
              <span className="text-[#fff] font-face-roboto italic">
                {totalPayout.toFixed(balanceType.type == "Points" ? 2 : 4)}{" "}
                {balanceType.type}
              </span>
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-nafl-sponge-500"></div>

        <button
          onClick={() =>
            user?.jwt
              ? createGame()
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

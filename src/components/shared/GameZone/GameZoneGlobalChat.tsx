"use client";

import { useUser } from "@blockchain/context/UserContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { IoIosClose, IoMdAddCircleOutline } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import moment from "moment";
import toast from "react-hot-toast";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import DepositModal from "../Modal/DepositModal";
import WithdrawModal from "../Modal/WithdrawModal";
import useGame from "@components/utils/gamezone";
import Web3 from "web3";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { jackpotAmount } from "@components/utils/jackpotCounter";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

interface GameData {
  _id: string;
  gameType: string;
  creator: { profileImage: string; username: string; _id: string };
  challengerBuyInAmount: string;
  payout: string;
  betAmount: string;
  odds: string;
  coinType: string;
  status: string;
}

interface Message {
  id: string;
  sender: { username: string; profileImage: string; _id: string };
  timestamp: Date;
  message: string | null;
  game: GameData | null;
}

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
  isWalletConnected: boolean;
};

const BalancesListOption = ({
  type,
  balance,
  usd,
  value,
}: {
  type: string;
  balance: string;
  usd: string;
  value: Balance;
}): React.JSX.Element => {
  const y = useMotionValue(0);
  const controls = useDragControls();

  return (
    <Reorder.Item
      id={value.id}
      value={value}
      dragListener={false}
      dragControls={controls}
      style={{ y }}
    >
      <div className="flex flex-row items-center justify-start gap-[19px]">
        <TfiMenu
          className="text-nafl-white text-[12px] cursor-grab"
          onPointerDown={(e) => controls.start(e)}
        />
        <div className="flex flex-row items-center justify-center gap-[6px]">
          <p className="text-[16px] text-nafl-white uppercase">{`${tokenValueConversion(balance, type) == "0." ? 0 : tokenValueConversion(balance, type)} ${type}`}</p>
          <p className="text-[16px] text-[#C1C1C1]">({`${usd} USD`})</p>
        </div>
      </div>
    </Reorder.Item>
  );
};

const GameZoneGlobalChat = () => {
  const { socket, socketId, user, setShowDepositModal, setShowWithdrawModal } =
    useUser();

  const [balances, setBalances] = useState<Balance[]>([]);
  const [chatData, setChatData] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [showBalances, setShowBalances] = useState(false);
  const [jackpotTotalAmount, setJackpotTotalAmount] = useState<any>(0);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setCurrentChallengerBuyIn = useGame(
    (state) => state.setChallengerBuyIn
  );
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setCurrentPayout = useGame((state) => state.setPayout);
  const setGameId = useGame((state) => state.setGameId);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | "">("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [toBottom, setToBottom] = useState<boolean>(false);
  const [scrollBehavior, setScrollBehavior] = useState<string | "">("instant");
  const [currentScrollHeight, setCurrentScrollHeight] = useState<
    number | undefined
  >(0);
  const [currentScrollTop, setCurrentScrollTop] = useState<number | undefined>(
    0
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setToBottom((prev) => !prev);
  //   fetchStart();
  // }, []);

  useEffect(() => {
    if (loading) {
      adjustScrollHeight(currentScrollHeight, currentScrollTop);
      setLoading((prev) => !prev);
    }
    if (toBottom) {
      scrollToBottom(scrollBehavior);
      setToBottom((prev) => !prev);
    }
  }, [showChat, chatData]);

  useEffect(() => {
    scrollToBottom(scrollBehavior);
    setToBottom((prev) => !prev);
  }, [initialLoadComplete]);

  const scrollToBottom = (behavior: any) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  const adjustScrollHeight = (scrollHeight: any, scrollTop: any) => {
    if (chatContainerRef.current) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      if (newScrollHeight !== undefined) {
        const heightDifference = newScrollHeight - scrollHeight;
        chatContainerRef.current.scrollTop = scrollTop + heightDifference;
      }
    }
  };

  const fetchStart = async () => {
    if (loading || !hasMore) return;
    setLoading((prev) => !prev);

    // Calculate the current scroll height and scroll position
    const currentScrollHeight = chatContainerRef.current?.scrollHeight;
    const currentScrollTop = chatContainerRef.current?.scrollTop;
    setCurrentScrollHeight(currentScrollHeight);
    setCurrentScrollTop(currentScrollTop);

    try {
      const response = await axios.get("game/messages/global", {
        params: { cursor: "", limit: 20 },
      });

      let responseData = response.data;

      if (responseData.statusCode == 200) {
        console.log("messages data: ", responseData.data.messages);
        setChatData(responseData.data.messages);
        setCursor(responseData.data.nextCursor);
        setHasMore(!!responseData.data.nextCursor);
        setInitialLoadComplete(true);
      } else {
        toast.error(responseData.messsage);
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(`${errorData.message}`);
    }
  };

  const fetchMore = async (nextCursor = "") => {
    if (loading || !hasMore) return;
    setLoading((prev) => !prev);

    // Calculate the current scroll height and scroll position
    const currentScrollHeight = chatContainerRef.current?.scrollHeight;
    const currentScrollTop = chatContainerRef.current?.scrollTop;
    setCurrentScrollHeight(currentScrollHeight);
    setCurrentScrollTop(currentScrollTop);

    try {
      const response = await axios.get("game/messages/global", {
        params: { cursor: nextCursor, limit: 20 },
      });

      let responseData = response.data;

      if (responseData.statusCode == 200) {
        console.log("more messages data: ", responseData.data.messages);
        setChatData((oldData) => [...responseData.data.messages, ...oldData]);
        setCursor(responseData.data.nextCursor);
        setHasMore(!!responseData.data.nextCursor);
      } else {
        toast.error(responseData.messsage);
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      toast.error(`${errorData.message}`);
    }
  };

  const handleScroll = async () => {
    if (
      chatContainerRef.current?.scrollTop === 0 &&
      hasMore &&
      !loading &&
      cursor
    ) {
      await fetchMore(cursor);
    }
  };

  useEffect(() => {
    user?.balances && setBalances(user?.balances);
  }, [user]);

  useEffect(() => {
    const checkRoomOpen = (data: any) => {
      console.log("roomstatus data:", data);
      if (!data) {
        toast.dismiss();
        toast.error(
          "Sorry room is currently occupied, try requesting again later"
        );
        // setCurrentScreen("main");
      } else {
        setCurrentScreen("joining");
      }
    };

    socket?.on("roomStatus", checkRoomOpen);

    const receiveGlobalChat = (data: any) => {
      setToBottom((prev) => !prev);
      setScrollBehavior("smooth");
      setChatData((oldData) => [...oldData, data]);
    };

    socket?.on("receiveGlobalChatMessage", receiveGlobalChat);

    return () => {
      socket?.off("roomStatus", checkRoomOpen);
      socket?.off("receiveGlobalChatMessage", receiveGlobalChat);
    };
  }, [socket]);

  // useEffect(() => {
  //   const fetchInitialJackpot = async () => {
  //       try {
  //           const initialAmount = await jackpotAmount('nafflings');
  //           setJackpotTotalAmount(initialAmount.jackpotInitial);
  //           const interval = setInterval(() => {
  //             console.log('INTERVAL')
  //               setJackpotTotalAmount((prevAmount: number) => prevAmount + initialAmount.jackpotPointPerSec);
  //           }, 10000);

  //           return () => clearInterval(interval);
  //       } catch (error) {
  //           console.error('Failed to fetch initial jackpot amount:', error);
  //       }
  //   };

  //   fetchInitialJackpot();
  // }, []);

  const intervalSet = useRef(false);

  useEffect(() => {
    const fetchInitialJackpot = async () => {
      try {
        const initialAmount = await jackpotAmount("nafflings");
        setJackpotTotalAmount(initialAmount.jackpotInitial);
        if (!intervalSet.current) {
          intervalSet.current = true;
          const interval = setInterval(() => {
            setJackpotTotalAmount(
              (prevAmount: number) =>
                prevAmount + initialAmount.jackpotPointPerSec
            );
          }, 10000);

          return () => {
            clearInterval(interval);
            intervalSet.current = false;
          };
        }
      } catch (error) {
        console.error("Failed to fetch initial jackpot amount:", error);
      }
    };
    fetchInitialJackpot();

    setToBottom((prev) => !prev);
    fetchStart();
  }, []);

  const joinGame = (gameId: string, gameData: GameData) => {
    console.log("joined a game start");
    var currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 10);

    socket?.emit("joinRequest", {
      gameId: gameId,
    });

    setGameType(
      gameData.gameType == "rockPaperScissors"
        ? "Rock, Paper, Scissors"
        : "Coin Toss"
    );

    setCoinType(gameData.coinType);
    setCurrentChallengerBuyIn(gameData.challengerBuyInAmount);
    // setBetOdds(gameData.odds.toString());
    setCurrentPayout(gameData.payout);
    setGameId(gameId);
  };

  const randomString = (length: number, chars: string) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const sendGlobalChatMessage = (message: string) => {
    console.log("message:", message);
    if (user?.id) {
      socket?.emit("sendGlobalChatMessage", { message: message });
      setMessage("");
    } else {
      toast.error("You must login first to chat");
    }
  };

  const MessageSection = ({
    currentId,
    senderId,
    sender,
    image,
    timestamp,
    message,
    game,
  }: {
    currentId: string | null;
    senderId: string;
    sender: string;
    image: string;
    timestamp: Date;
    message: string | null;
    game: GameData | null;
  }): React.JSX.Element => {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const messageTimeStamp = new Date(timestamp);

    const shortenUsername = (username: string) => {
      if (username?.length > 15) {
        return username.slice(0, 15) + "...";
      } else return username;
    };

    return (
      <>
        {game ? (
          <div className="w-full px-[6px] pt-[13px] pb-[20px] bg-[#000000B2] flex flex-row gap-[12px] rounded-[6px]">
            <img
              src={image == "" ? "/static/default_img.png" : image}
              alt="Account Image"
              className="w-[40px] h-[38px] rounded-full object-contain"
            />
            <div className="flex flex-col gap-[4px] pt-[6px]">
              <p className="w-full text-left text-[10px] font-bold">
                <span className="text-[14px] text-[#02B1B1]">
                  {currentId == senderId ? "You" : shortenUsername(sender)}
                </span>
                {"  "}
                CREATED A GAME OF{" "}
                <span className="text-[14px] text-[#02B1B1]">
                  {game.gameType == "rockPaperScissors" ? "RPS" : "Coin Toss"}
                </span>
              </p>

              <div className="flex flex-row ml-[42px] gap-[42px] items-start">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-center">
                    <p className="text-[12px] text-nafl-white w-[63px] leading-[100%]">
                      Buy-in:
                    </p>
                    <p className="text-[#02B1B1] text-[12px] font-bold uppercase">
                      {tokenValueConversion(
                        game.challengerBuyInAmount,
                        game.coinType
                      )}{" "}
                      {game.coinType != "points" && game.coinType}
                    </p>
                    {game.coinType == "points" && (
                      <img
                        src="/nafflings/three-group.png"
                        alt="Nafflings"
                        className="w-[50px] object-contain"
                      />
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    <p className="text-[12px] text-nafl-white w-[63px] leading-[100%]">
                      Payout:
                    </p>
                    <p className="text-[#02B1B1] text-[12px] font-bold uppercase">
                      {tokenValueConversion(game.payout, game.coinType)}{" "}
                      {game.coinType != "points" && game.coinType}
                    </p>
                    {game.coinType == "points" && (
                      <img
                        src="/nafflings/three-group.png"
                        alt="Nafflings"
                        className="w-[50px] object-contain"
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => joinGame(game._id, game)}
                  disabled={currentId == senderId}
                  className={`flex items-center justify-center rounded-[5px] border-[1px] border-nafl-sponge-500 w-[115px] h-[28px] bg-[#464646] ${currentId != senderId ? "opacity-100" : "opacity-50"}`}
                >
                  <p className="text-nafl-white text-[12px] font-bold">JOIN</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-start justify-start gap-[19px] w-full">
            <img
              src={image == "" ? "/static/default_img.png" : image}
              alt="Account Image"
              className="w-[40px] h-[38px] rounded-full object-contain"
            />
            <div className="flex flex-col w-full items-start justify-start gap-[11px]">
              <div className="flex flex-row items-end justify-start gap-[6px]">
                {currentId == senderId ? (
                  <p className="text-[#DC2ABF] text-[14px] font-bold leading-[100%]">
                    You
                  </p>
                ) : (
                  <p className="text-nafl-sponge-500 text-[14px] font-bold leading-[100%]">
                    {shortenUsername(sender)}
                  </p>
                )}
                <p className="text-[#fff]/50 text-[10px]">
                  {moment(messageTimeStamp).format("MM/DD/YYYY h:mmA")}
                </p>
              </div>
              <p className="w-full text-[#B7B4B4] text-[16px]">{message}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="xl:flex hidden flex-col items-center justify-start bg-[#383838] rounded-[16px] lg:w-[457px] max-w-[457px] w-[90%]">
        <div className="flex flex-col items-center justify-start py-[13px] px-[20px] rounded-t-[16px] border-b-[1px] border-nafl-sponge-500/50 w-full">
          <div className="flex flex-row items-center justify-between py-[7px] px-[20px] rounded-[13px] border-[1px] border-[#DC2ABF] h-[54px] lg:w-[394px] w-full">
            <div className="relative flex flex-row items-center justify-center gap-[50px]">
              <div className="absolute opacity-1 w-[120px] top-[-45px] left-[-30px]">
                <div className="relative flex justify-center">
                  <img
                    src="/static/jackpot-img.png"
                    alt="Jackpot Image"
                    className="z-10"
                  />
                  <img
                    src="/nafflings/chest-group.png"
                    alt=""
                    className="absolute top-[45px] z-20 w-[50px] drop-shadow-nafl-sponge-2xl "
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-col items-center justify-center ml-[76px]">
                  <p className="text-[14px] text-nafl-white font-face-bebas">
                    JACKPOT
                  </p>
                  <div className="flex flex-row items-end justify-center gap-[2px]">
                    <p className="text-[30px] text-nafl-white font-face-bebas leading-[100%]">
                      {jackpotTotalAmount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="/nafflings/three-group.png"
                    alt="Naffles Image"
                    className="w-[61px] h-[34px] object-contain mb-[-8px]"
                  />
                  <p className="text-[14px] text-nafl-white font-face-bebas">
                    NAFFLINGS
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[14px] text-nafl-white font-face-bebas">
              <a href="/win-the-jackpot" target="_blank">
                HOW TO WIN THE JACKPOT?
              </a>
            </p>
          </div>
          <div className="flex flex-col items-nceter justify-center w-full rounded-[10px]">
            <div className="flex flex-row items-center justify-between w-full mt-[26px]">
              <p className="text-[#C4C4C4] text-[20px]">SEASON TOTAL:</p>
              <div className="flex flex-row items-center justify-center gap-[6px]">
                <p className="text-nafl-white text-[20px]">
                  {user?.points?.toLocaleString() ?? 0}
                </p>
                <img
                  src="/nafflings/three-group.png"
                  alt="Naffles Image"
                  className="w-[61px] h-[34px] object-contain mr-[22px]"
                />
              </div>
            </div>

            <div className="flex flex-col items-nceter justify-center w-full border-[1px] border-nafl-sponge-500 rounded-[10px]">
              <div className="flex flex-row items-center justify-center p-[5px] bg-[#292929] rounded-t-[10px] h-[37px] gap-[8px]">
                <p className="text-nafl-white font-bold w-[156px] text-center">
                  BALANCES
                </p>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]"
                >
                  <p className="text-[#000] text-[12px] font-bold">DEPOSIT</p>
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]"
                >
                  <p className="text-[#000] text-[12px] font-bold">WITHDRAW</p>
                </button>
              </div>
              <div className="w-full py-[14px] px-[12px] bg-[#4B4B4B] rounded-b-[10px] ">
                <div className="w-full h-[118px] overflow-hidden overflow-y-scroll balance-scrollbar">
                  <div className="flex flex-col gap-[10px] w-full min-h-[114px] items-start justify-start">
                    <Reorder.Group
                      values={balances}
                      onReorder={setBalances}
                      axis="y"
                    >
                      {balances.map((balance, index) => (
                        <BalancesListOption
                          key={index}
                          value={balance}
                          type={balance.tokenType}
                          balance={balance.amount}
                          usd={balance.conversion}
                        />
                      ))}
                    </Reorder.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col py-[10px] px-[21px] gap-[10px] w-full">
          <div
            className="flex flex-col h-[488px] w-full overflow-hidden overflow-y-scroll pt-[15px] comments-scrollbar"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {loading && (
              <div className="flex justify-center items-center py-2">
                <span>Loading...</span>
              </div>
            )}
            <div className="flex flex-col w-full gap-[19px]">
              {chatData &&
                chatData?.map((item, index) => (
                  <MessageSection
                    key={
                      process.env.NODE_ENV === "development"
                        ? randomString(
                            12,
                            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                          )
                        : item.id
                    }
                    currentId={socketId}
                    senderId={item.sender._id}
                    sender={item.sender.username}
                    image={item.sender.profileImage}
                    timestamp={item.timestamp}
                    message={item.message}
                    game={item.game}
                  />
                ))}
            </div>
            {/* <div ref={bottomChat} /> */}
          </div>
          {/* <div ref={bottomChat} /> */}
          <div className="flex items-center w-full relative">
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key == "Enter" && message && sendGlobalChatMessage(message)
              }
              maxLength={50}
              className="w-full h-[55px] bg-[#4B4B4B] text-[#C4C4C4] rounded-[10px] font-face-roboto text-[16px] px-[53px] placeholder:font-bold placeholder:opacity-30"
            />
            <IoMdAddCircleOutline className="absolute left-[14px] text-[#8C8C8C] text-[26px] cursor-pointer" />
            <BiSend
              onClick={() => message && sendGlobalChatMessage(message)}
              className="absolute right-[14px] text-[#8C8C8C] text-[26px] cursor-pointer"
            />
          </div>

          <a
            href="https://discord.gg/naffles"
            target="_blank"
            className="w-full h-[58px] rounded-[10px] relative overflow-hidden cursor-pointer"
          >
            <img
              src={"/static/gamezone-header-bg.png"}
              alt="Naffle"
              className="w-full h-full object-cover object-center"
            />
            <div className="flex flex-row items-center justify-between absolute inset-0 w-full h-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[18px]">
              <img
                src={"/static/naffles-text-logo-dark.png"}
                alt="Naffle"
                className="w-[95px] object-contain"
              />
              <p className="text-[16px] text-nafl-white mr-[20px]">
                <b>JOIN</b> OUR DISCORD!
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* MOBILE VERSION */}

      <div
        className={`flex xl:hidden flex-col md:items-end items-center justify-center fixed bottom-0 right-0 z-50 md:pr-[20px] pr-0 md:pb-[20px] pb-0 ${showChat ? "w-full md:w-[457px] md:pt-[150px] pt-[40px] h-screen md:bg-transparent bg-black/50 md:backdrop-blur-0 backdrop-blur-md" : "w-[70px] h-[70px]"} duration-500`}
      >
        {showChat ? (
          <>
            <button
              onClick={() => setShowChat(false)}
              className="md:flex hidden items-center justify-center w-[50px] rounded-t-[10px] bg-nafl-sponge-500 mr-[50px]"
            >
              <p className="font-face-bebas text-[30px] text-[#ff6647]">
                <IoIosClose />
              </p>
            </button>

            <button
              onClick={() => setShowChat(false)}
              className="md:hidden flex items-center justify-center w-[100px] rounded-[10px] bg-nafl-sponge-500 shadow-xl absolute top-[30px]"
            >
              <p className="font-face-bebas text-[20px] text-[#000]">
                CLOSE CHAT
              </p>
            </button>

            <div className="w-full h-full rounded-[16px] border-[3px] border-nafl-sponge-500 md:scale-100 scale-[80%] shadow-2xl max-w-[457px] animate-fade-in">
              <div className="flex flex-col items-center h-full justify-start bg-[#383838] rounded-[16px] relative overflow-hidden">
                <div
                  className={`flex flex-col items-center justify-start py-[13px] h-[340px] px-[20px] rounded-t-[16px] border-b-[1px] border-nafl-sponge-500/50 w-full absolute shadow-xl ${showBalances ? "top-0" : "top-[-300px]"} duration-300 bg-[#383838]`}
                >
                  <div className="flex flex-row items-center justify-between py-[7px] px-[20px] rounded-[13px] border-[1px] border-[#DC2ABF] h-[54px] lg:w-[394px] w-full">
                    <div className="flex flex-row items-center justify-center gap-[19px]">
                      <img
                        src="/static/naffles-jackpot-token.png"
                        alt="Naffles"
                        className="h-[41px] w-[41px] object-contain"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-[14px] text-nafl-white font-face-bebas">
                          JACKPOT
                        </p>
                        <div className="flex flex-row items-end justify-center gap-[2px]">
                          <p className="text-[30px] text-nafl-white font-face-bebas leading-[100%]">
                            1259.69
                          </p>
                          <p className="text-[14px] text-nafl-white font-face-bebas">
                            POINTS
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[14px] text-nafl-white font-face-bebas">
                      HOW TO WIN THE JACKPOT?
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between w-full mt-[26px]">
                    <p className="text-[#C4C4C4] text-[20px]">SEASON TOTAL:</p>
                    <p className="text-nafl-white text-[20px]">
                      {user?.points} NAFFLINGS
                    </p>
                  </div>

                  <div className="flex flex-col items-nceter justify-center w-full border-[1px] border-nafl-sponge-500 rounded-[10px]">
                    <div className="flex flex-row items-center justify-center p-[5px] bg-[#292929] rounded-t-[10px] h-[37px] gap-[8px]">
                      <p className="text-nafl-white font-bold w-[156px] text-center">
                        BALANCES
                      </p>
                      <button
                        onClick={() => setShowDepositModal(true)}
                        className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]"
                      >
                        <p className="text-[#000] text-[12px] font-bold">
                          DEPOSIT
                        </p>
                      </button>
                      <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]"
                      >
                        <p className="text-[#000] text-[12px] font-bold">
                          WITHDRAW
                        </p>
                      </button>
                    </div>
                    <div className="w-full py-[14px] px-[12px] bg-[#4B4B4B] rounded-b-[10px] ">
                      <div className="w-full h-[118px] overflow-hidden overflow-y-scroll balance-scrollbar">
                        <div className="flex flex-col gap-[10px] w-full min-h-[114px] items-start justify-start">
                          <Reorder.Group
                            values={balances}
                            onReorder={setBalances}
                            axis="y"
                          >
                            {balances.map((balance, index) => (
                              <BalancesListOption
                                key={index}
                                value={balance}
                                type={balance.tokenType}
                                balance={balance.amount}
                                usd={balance.conversion}
                              />
                            ))}
                          </Reorder.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      showBalances
                        ? setShowBalances(false)
                        : setShowBalances(true)
                    }
                    className="flex items-center justify-center w-[70px] h-[30px] rounded-[8px] bg-nafl-sponge-500 absolute bottom-[-20px]"
                  >
                    <p className="font-face-bebas text-[#000]">
                      {showBalances ? (
                        <MdOutlineKeyboardDoubleArrowUp />
                      ) : (
                        <MdOutlineKeyboardDoubleArrowDown />
                      )}
                    </p>
                  </button>
                </div>
                <div className="flex flex-col py-[10px] px-[10px] gap-[10px] w-full h-full pt-[50px]">
                  <div
                    className="flex flex-col h-full w-full overflow-hidden overflow-y-scroll pt-[15px] comments-scrollbar"
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                  >
                    {loading && (
                      <div className="flex justify-center items-center py-2">
                        <span>Loading...</span>
                      </div>
                    )}
                    <div className="flex flex-col w-full gap-[19px]">
                      {chatData &&
                        chatData?.map((item, index) => (
                          <MessageSection
                            key={
                              process.env.NODE_ENV === "development"
                                ? randomString(
                                    12,
                                    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                  )
                                : item.id
                            }
                            currentId={socketId}
                            senderId={item.sender._id}
                            sender={item.sender.username}
                            image={item.sender.profileImage}
                            timestamp={item.timestamp}
                            message={item.message}
                            game={item.game}
                          />
                        ))}
                    </div>
                    {/* <div ref={bottomChat} /> */}
                  </div>

                  <div className="flex items-center w-full relative">
                    <input
                      type="text"
                      placeholder="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key == "Enter" &&
                        message &&
                        sendGlobalChatMessage(message)
                      }
                      maxLength={50}
                      className="w-full h-[55px] bg-[#4B4B4B] text-[#C4C4C4] rounded-[10px] font-face-roboto text-[16px] px-[53px] placeholder:font-bold placeholder:opacity-30"
                    />
                    <IoMdAddCircleOutline className="absolute left-[14px] text-[#8C8C8C] text-[26px] cursor-pointer" />
                    <BiSend
                      onClick={() => message && sendGlobalChatMessage(message)}
                      className="absolute right-[14px] text-[#8C8C8C] text-[26px] cursor-pointer"
                    />
                  </div>

                  <a
                    href="https://discord.gg/naffles"
                    target="_blank"
                    className="w-full h-[58px] rounded-[10px] relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={"/static/gamezone-header-bg.png"}
                      alt="Naffle"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="flex flex-row items-center justify-between absolute inset-0 w-full h-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[18px]">
                      <img
                        src={"/static/naffles-text-logo-dark.png"}
                        alt="Naffle"
                        className="w-[95px] object-contain"
                      />
                      <p className="text-[16px] text-nafl-white mr-[20px]">
                        <b>JOIN</b> OUR DISCORD!
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={() => {
              setShowChat(true);
              setToBottom((prev) => !prev);
              setScrollBehavior("instant");
              setInitialLoadComplete(true);
            }}
            className="flex items-center justify-center w-[60px] h-[60px] rounded-[10px] bg-nafl-sponge-500 "
          >
            <BsFillChatLeftTextFill className="text-[#000] text-[30px]" />
          </button>
        )}
      </div>
    </>
  );
};

export default GameZoneGlobalChat;

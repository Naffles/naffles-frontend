"use client";

import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import { useUser } from "@blockchain/context/UserContext";
import moment from "moment";
import toast from "react-hot-toast";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import Web3 from "web3";
import { jackpotAmount } from "@components/utils/jackpotCounter";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";

interface Message {
  sender: { username: string; profileImage: string; _id: string };
  timestamp: Date;
  message: string | null;
}

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
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

const LeaderboardsChat = () => {
  const { socket, socketId, user, setShowDepositModal, setShowWithdrawModal } =
    useUser();
  const [chatData, setChatData] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [balances, setBalances] = useState<Balance[]>([]);
  const [jackpotTotalAmount, setJackpotTotalAmount] = useState<any>(0);

  const chatContainer = useRef<HTMLDivElement>(null);
  const bottomChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    user?.balances && setBalances(user?.balances);
  }, [user]);

  useEffect(() => {
    socket?.emit("joinGlobalChat");

    const receiveGlobalChat = (data: any) => {
      console.log("receiveGlobalChatMessage", data);
      setChatData((oldData) => [...oldData, data]);
    };

    socket?.on("receiveGlobalChatMessage", receiveGlobalChat);

    return () => {
      socket?.off("receiveGlobalChatMessage", receiveGlobalChat);
    };
  }, [socket]);

  useEffect(() => {
    if (chatData.length > 0) {
      scrollToBottom();
    }
  }, [chatData]);

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
  }, []);

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

  const scrollToBottom = () => {
    if (bottomChat.current) {
      bottomChat.current.scrollTop = bottomChat.current.scrollHeight;
    }
  };

  // const BalancesListOption = ({
  //   type,
  //   balance,
  //   usd,
  // }: {
  //   type: string;
  //   balance: string;
  //   usd: string;
  // }): React.JSX.Element => {
  //   return (
  //     <>
  //       <div className="flex flex-row items-center justify-start gap-[19px]">
  //         <TfiMenu className="text-nafl-white text-[12px]" />
  //         <div className="flex flex-row items-center justify-center gap-[6px]">
  //           <p className="text-[16px] text-nafl-white">{`${balance} ${type}`}</p>
  //           <p className="text-[16px] text-[#C1C1C1]">({`${usd} USD`})</p>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

  const CommentSection = ({
    currentId,
    senderId,
    sender,
    image,
    timestamp,
    message,
  }: {
    currentId: string | null;
    senderId: string;
    sender: string;
    image: string;
    timestamp: Date;
    message: string | null;
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
        <div className="flex flex-row items-start justify-start gap-[19px] w-full">
          <img
            src={image == "" ? "/static/user-circle.png" : image}
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
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] w-[457px] h-[963px]">
      <div className="flex flex-col items-center justify-start py-[13px] px-[20px] rounded-t-[16px] border-b-[1px] border-nafl-sponge-500/50">
        <div className="flex flex-row items-center justify-between py-[7px] px-[20px] rounded-[13px] border-[1px] border-[#DC2ABF] h-[54px] w-[394px]">
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
                  {jackpotTotalAmount}
                </p>
                <p className="text-[14px] text-nafl-white font-face-bebas">
                  POINTS
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
            <div className="w-full h-[118px]  overflow-hidden overflow-y-scroll balance-scrollbar">
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
      <div className="flex flex-col py-[10px] px-[10px] gap-[10px]">
        <div className="flex flex-col h-[488px] w-full overflow-hidden overflow-y-scroll pt-[15px] comments-scrollbar">
          <div className="flex flex-col min-h-[488px] w-full gap-[19px]">
            {chatData.map((item) => (
              <CommentSection
                key={randomString(
                  12,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                )}
                currentId={socketId}
                senderId={item.sender._id}
                sender={item.sender.username}
                image={item.sender.profileImage}
                timestamp={item.timestamp}
                message={item.message}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center w-full relative">
          <input
            type="text"
            placeholder="Message"
            className="w-full h-[55px] bg-[#4B4B4B] text-[#C4C4C4] rounded-[10px] font-face-roboto text-[16px] px-[53px] placeholder:font-bold placeholder:opacity-30"
          />
          <IoMdAddCircleOutline className="absolute left-[14px] text-[#8C8C8C] text-[26px] cursor-pointer" />
          <BiSend className="absolute right-[14px] text-[#8C8C8C] text-[26px] cursor-pointer" />
        </div>

        <div className="w-full h-[58px] rounded-[10px] relative overflow-hidden">
          <img
            src={"/static/gamezone-header-bg.png"}
            alt="Naffle"
            className="w-full h-full object-cover object-center"
          />
          <div
            onClick={() => {
              window.open("https://discord.com/invite/naffles", "_blank");
            }}
            className="flex flex-row items-center justify-between absolute inset-0 w-full h-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[18px] cursor-pointer"
          >
            <img
              src={"/static/naffles-text-logo-dark.png"}
              alt="Naffle"
              className="w-[95px] object-contain"
            />
            <p className="text-[16px] text-nafl-white mr-[20px]">
              <b>JOIN</b> OUR DISCORD!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardsChat;

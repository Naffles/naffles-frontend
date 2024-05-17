"use client";

import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";
import moment from "moment";
import toast from "react-hot-toast";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import DepositModal from "../Modal/DepositModal";
import WithdrawModal from "../Modal/WithdrawModal";
import useGame from "@components/utils/gamezone";

interface GameData {
  _id: string;
  gameType: string;
  creator: { profileImage: string; username: string; _id: string };
  challengerBuyInAmount: { $numberDecimal: number };
  payout: { $numberDecimal: number };
  betAmount: { $numberDecimal: number };
  odds: { $numberDecimal: number };
  coinType: string;
  status: string;
}

interface Message {
  sender: { username: string; profileImage: string; _id: string };
  timestamp: Date;
  message: string | null;
  game: GameData | null;
}

let sample_balances_json = [
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
const BalancesListOption = ({
  type,
  balance,
  usd,
  value,
}: {
  type: string;
  balance: string;
  usd: string;
  value: { type: string; balance: string; usd: string; id: number };
}): React.JSX.Element => {
  const y = useMotionValue(0);
  const controls = useDragControls();
  return (
    <Reorder.Item
      id={value.id.toString()}
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
          <p className="text-[16px] text-nafl-white">{`${balance} ${type}`}</p>
          <p className="text-[16px] text-[#C1C1C1]">({`${usd} USD`})</p>
        </div>
      </div>
    </Reorder.Item>
  );
};
const GameZoneGlobalChat = () => {
  const { socket, socketId, user } = useUser();
  const [balances, setBalances] = useState(sample_balances_json);
  const [chatData, setChatData] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  const setCurrentScreen = useGame((state) => state.setScreen);
  const setCurrentChallengerBuyIn = useGame(
    (state) => state.setChallengerBuyIn
  );
  const setGameType = useGame((state) => state.setType);
  const setCoinType = useGame((state) => state.setCoinType);
  const setCurrentPayout = useGame((state) => state.setPayout);
  const setGameId = useGame((state) => state.setGameId);

  const bottomChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket?.emit("joinGlobalChat");

    const receiveGlobalChat = (data: any) => {
      console.log("receiveGlobalChatMessage", data);
      setChatData((oldData) => [...oldData, data]);
    };

    socket?.on("receiveGlobalChatMessage", receiveGlobalChat);

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

    return () => {
      socket?.off("receiveGlobalChatMessage", receiveGlobalChat);
      socket?.off("roomStatus", checkRoomOpen);
    };
  }, [socket]);

  useEffect(() => {
    if (chatData.length > 0) {
      scrollToBottom();
    }
  }, [chatData]);

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
    setCurrentChallengerBuyIn(gameData.challengerBuyInAmount.toString());
    // setBetOdds(gameData.odds.toString());
    setCurrentPayout(gameData.payout.toString());
    setGameId(gameId);
  };

  const randomString = (length: number, chars: string) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  let sample_comments_json = [
    {
      id: 1,
      name: "You",
      image: "/static/sample-account-image-1.png",
      date: "16/02/2024",
      time: "9:14PM",
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget magna bibendum, vulputate elit in, tincidunt lectus. Morbi et erat non mi cursus fermentum. In placerat commodo justo,",
    },
    {
      id: 2,
      name: "Joe",
      image: "/static/sample-account-image-2.png",
      date: "16/02/2024",
      time: "9:16PM",
      comment:
        "Fusce eget magna bibendum, vulputate elit in, tincidunt lectus. Morbi et erat non mi cursus fermentum. In placerat commodo justo,",
    },
    {
      id: 3,
      name: "PlayerOne",
      image: "/static/sample-account-image-3.png",
      date: "16/02/2024",
      time: "9:17PM",
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget magna bibendum, vulputate elit in, tincidunt lectus. Morbi et erat non mi cursus fermentum.",
    },
  ];

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
              src={image == "" ? "/static/user-circle.png" : image}
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
                    <p className="text-[#02B1B1] text-[12px] font-bold w-[70px] uppercase">
                      {game.challengerBuyInAmount.$numberDecimal}{" "}
                      {game.coinType}
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    <p className="text-[12px] text-nafl-white w-[63px] leading-[100%]">
                      Payout:
                    </p>
                    <p className="text-[#02B1B1] text-[12px] font-bold w-[70px] uppercase">
                      {game.payout.$numberDecimal} {game.coinType}
                    </p>
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
        )}
      </>
    );
  };

  return (
    <div className="xl:flex hidden flex-col items-center justify-start bg-[#383838] rounded-[16px] lg:w-[457px] max-w-[457px] w-[90%]">
      <div className="flex flex-col items-center justify-start py-[13px] px-[20px] rounded-t-[16px] border-b-[1px] border-nafl-sponge-500/50 w-full">
        <div className="flex flex-row items-center justify-between py-[7px] px-[20px] rounded-[13px] border-[1px] border-[#DC2ABF] h-[54px] lg:w-[394px] w-full">
          <div className="relative flex flex-row items-center justify-center gap-[19px]">
            {/* <img
              src="/static/naffles-jackpot-token.png"
              alt="Naffles"
              className="h-[41px] w-[41px] object-contain"
            /> */}
            <div className="absolute opacity-1 w-[120px] top-[-45px] left-[-20px]">
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
            <div className="flex flex-col items-center justify-center ml-[96px]">
              <p className="text-[14px] text-nafl-white font-face-bebas">
                JACKPOT
              </p>
              <div className="flex flex-row items-end justify-center gap-[2px]">
                <p className="text-[30px] text-nafl-white font-face-bebas leading-[100%]">
                  1259.69
                </p>
                <p className="text-[14px] text-nafl-white font-face-bebas">
                  NAFFLINGS
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
                  {balances.map((balance) => (
                    <BalancesListOption
                      key={balance.id}
                      value={balance}
                      type={balance.type}
                      balance={balance.balance}
                      usd={balance.usd}
                    />
                  ))}
                </Reorder.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-[10px] px-[21px] gap-[10px] w-full">
        <div
          className="flex flex-col h-[488px] w-full overflow-hidden overflow-y-scroll pt-[15px] comments-scrollbar"
          ref={bottomChat}
        >
          <div className="flex flex-col w-full gap-[19px]">
            {chatData.map((item) => (
              <MessageSection
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

        <div className="w-full h-[58px] rounded-[10px] relative overflow-hidden">
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
        </div>
      </div>
      <DepositModal
        show={showDepositModal}
        setShow={setShowDepositModal}
        walletBalances={sample_balances_json}
      />
      <WithdrawModal
        show={showWithdrawModal}
        setShow={setShowWithdrawModal}
        walletBalances={sample_balances_json}
      />
    </div>
  );
};

export default GameZoneGlobalChat;

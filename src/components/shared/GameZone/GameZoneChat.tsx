"use client";

import { BiSend } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiMenu } from "react-icons/tfi";

const GameZoneChat = () => {
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

  const BalancesListOption = ({
    type,
    balance,
    usd,
  }: {
    type: string;
    balance: string;
    usd: string;
  }): React.JSX.Element => {
    return (
      <>
        <div className="flex flex-row items-center justify-start gap-[19px]">
          <TfiMenu className="text-white text-[12px]" />
          <div className="flex flex-row items-center justify-center gap-[6px]">
            <p className="text-[16px] text-white">{`${balance} ${type}`}</p>
            <p className="text-[16px] text-[#C1C1C1]">({`${usd} USD`})</p>
          </div>
        </div>
      </>
    );
  };

  const CommentSection = ({
    name,
    image,
    date,
    time,
    comment,
  }: {
    name: string;
    image: string;
    date: string;
    time: string;
    comment: string;
  }): React.JSX.Element => {
    return (
      <>
        <div className="flex flex-row items-start justify-start gap-[19px] w-full">
          <img
            src={image}
            alt="Account Image"
            className="w-[40px] h-[38px] rounded-full object-contain"
          />
          <div className="flex flex-col w-full items-start justify-start gap-[11px]">
            <div className="flex flex-row items-end justify-start gap-[6px]">
              <p className="text-[#DC2ABF] text-[14px] font-bold leading-[100%]">
                {name}
              </p>
              <p className="text-[#fff]/50 text-[10px]">{`${date} ${time}`}</p>
            </div>
            <p className="w-full text-[#B7B4B4] text-[16px]">{comment}</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] lg:w-[457px] max-w-[457px] w-[90%]">
      <div className="flex flex-col items-center justify-start py-[13px] px-[20px] rounded-t-[16px] border-b-[1px] border-nafl-sponge-500/50 w-full">
        <div className="flex flex-row items-center justify-between py-[7px] px-[20px] rounded-[13px] border-[1px] border-[#DC2ABF] h-[54px] lg:w-[394px] w-full">
          <div className="flex flex-row items-center justify-center gap-[19px]">
            <img
              src="/static/naffles-jackpot-token.png"
              alt="Naffles"
              className="h-[41px] w-[41px] object-contain"
            />
            <div className="flex flex-col items-center justify-center">
              <p className="text-[14px] text-white font-face-bebas">JACKPOT</p>
              <div className="flex flex-row items-end justify-center gap-[2px]">
                <p className="text-[30px] text-white font-face-bebas leading-[100%]">
                  1259.69
                </p>
                <p className="text-[14px] text-white font-face-bebas">POINTS</p>
              </div>
            </div>
          </div>
          <p className="text-[14px] text-white font-face-bebas">
            HOW TO WIN THE JACKPOT?
          </p>
        </div>

        <div className="flex flex-row items-center justify-between w-full mt-[26px]">
          <p className="text-[#C4C4C4] text-[20px]">SEASON TOAL:</p>
          <p className="text-white text-[20px]">152,256 POINTS</p>
        </div>

        <div className="flex flex-col items-nceter justify-center w-full border-[1px] border-nafl-sponge-500 rounded-[10px]">
          <div className="flex flex-row items-center justify-center p-[5px] bg-[#292929] rounded-t-[10px] h-[37px] gap-[8px]">
            <p className="text-white font-bold w-[156px] text-center">
              BALANCES
            </p>
            <button className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]">
              <p className="text-[#000] text-[12px] font-bold">DEPOSIT</p>
            </button>
            <button className="flex items-center justify-center w-[115px] h-[28px] bg-nafl-sponge-500 rounded-[5px]">
              <p className="text-[#000] text-[12px] font-bold">WITHDRAW</p>
            </button>
          </div>
          <div className="w-full py-[14px] px-[12px] bg-[#4B4B4B] rounded-b-[10px] ">
            <div className="w-full h-[118px] overflow-hidden overflow-y-scroll balance-scrollbar">
              <div className="flex flex-col gap-[10px] w-full min-h-[114px] items-start justify-start">
                {sample_balances_json.map((item) => (
                  <BalancesListOption
                    key={item.id}
                    type={item.type}
                    balance={item.balance}
                    usd={item.usd}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-[10px] px-[10px] gap-[10px]">
        <div className="flex flex-col h-[488px] w-full overflow-hidden overflow-y-scroll pt-[15px] comments-scrollbar">
          <div className="flex flex-col min-h-[488px] w-full gap-[19px]">
            {sample_comments_json.map((item) => (
              <CommentSection
                key={item.id}
                name={item.name}
                image={item.image}
                date={item.date}
                time={item.time}
                comment={item.comment}
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
          <div className="flex flex-row items-center justify-between absolute inset-0 w-full h-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[18px]">
            <img
              src={"/static/naffles-text-logo-dark.png"}
              alt="Naffle"
              className="w-[95px] object-contain"
            />
            <p className="text-[16px] text-white mr-[20px]">
              <b>JOIN</b> OUR DISCORD!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameZoneChat;

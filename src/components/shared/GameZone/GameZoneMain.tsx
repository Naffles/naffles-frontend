"use client";

import { MdOutlineSearch } from "react-icons/md";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useState } from "react";
import {
  Slider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";

const GameZoneMain = () => {
  const [gameType, setGameType] = useState<string>("ALL GAMES");
  const [gameTypeDropdown, setGameTypeDropdown] = useState<boolean>(false);
  const [gameFilter, setGameFilter] = useState<string>("ODDS");
  const [filterMixMaxValue, setFilterMixMaxValue] = useState<number[]>([0, 0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let sample_games_json = [
    {
      id: 1,
      game: "COIN TOSS",
      player: "You",
      image: "/static/sample-account-image-1.png",
      buyin: "10.00",
      payout: "19.70",
      currency: "USDC",
      allowJoin: false,
    },
    {
      id: 2,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: "1.00",
      payout: "1.97",
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 3,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: "6.00",
      payout: "17.75",
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 4,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-1.png",
      buyin: "6.00",
      payout: "17.75",
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 5,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: "1.00",
      payout: "1.97",
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 6,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: "1.00",
      payout: "1.97",
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 7,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: "1.00",
      payout: "1.97",
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 8,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: "6.00",
      payout: "17.75",
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 9,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: "1.00",
      payout: "1.97",
      currency: "SOL",
      allowJoin: true,
    },
  ];

  let games_type_filter_options = [
    "ALL GAMES",
    "ROCK, PAPERS, SCISSORS",
    "COIN TOSS",
  ];

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 4) + "..." + address.slice(-6, -1);
    } else return address;
  };

  return (
    <>
      <div className="flex flex-col items-center w-[966px] z-20 pb-[27px]">
        <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] w-full p-[13px]">
          <div className="flex flex-col w-full h-[131px] rounded-lg overflow-hidden relative">
            <img
              src={"/static/gamezone-header-bg.png"}
              alt="Naffle"
              className="w-full h-full object-cover object-center"
            />
            <div className="flex flex-col absolute inset-0 w-full h-full bg-gradient-to-r from-[#02B1B1]/90 to-[#ffff3d]/90 px-[33px] py-[10px]">
              <p className="text-[26px] font-face-bebas text-white underline">
                PLAY OR WAGER AND EARN POINTS
              </p>
              <div className="flex flex-row items-start justify-between">
                <p className="w-[650px] text-left text-[16px]">
                  Earn points by playing the games or participating in the
                  raffles. <br />
                  <a className="text-[#292929] font-face-roboto">
                    Join a game
                  </a>{" "}
                  to amplify your crypto balance, while you&apos;re amplifying
                  your points too! <br />
                  <b>
                    Your points turn into $NAFF tokens when the air drop season
                    starts.
                  </b>
                </p>
                <img
                  src={"/static/naffles-text-logo-dark.png"}
                  alt="Naffle"
                  className="w-[170px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-end justify-between mt-[36px] w-full px-[20px]">
            <div className="flex items-center w-[220px] h-[37px] relative">
              <input
                type="text"
                placeholder="SEARCH"
                className="w-full h-full rounded-[10px] bg-[#4B4B4B] font-face-roboto px-[20px] text-[16px] placeholder:text-[#C1C1C1]"
              />
              <MdOutlineSearch className="absolute right-[12px] text-[20px] text-[#E9E9E9]" />
            </div>

            <div className="flex flex-row items-end justify-center gap-[13px]">
              <div className="flex flex-col gap-[11px]">
                <p className="text-[13px] text-[#FEFF3D] leading-[100%]">
                  FILTER
                </p>

                <div className="flex flex-row items-center gap-[13px]">
                  <div className="w-[154px] relative">
                    <button
                      onClick={() =>
                        setGameTypeDropdown(gameTypeDropdown ? false : true)
                      }
                      className="flex px-[15px] items-center rounded-[10px] w-full h-[37px] bg-[#4B4B4B]"
                    >
                      <p className="text-[16px] text-[#C1C1C1] truncate">
                        {gameType}
                      </p>
                      <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
                    </button>

                    {gameTypeDropdown && (
                      <div className="flex flex-col absolute top-[40px] w-full rounded-[10px] bg-[#4B4B4B] h-[140px] z-[100] pt-[5px]">
                        <div className="flex flex-col w-full gap-[6px] px-[5px]">
                          {games_type_filter_options.map((item) => (
                            <button
                              onClick={() => {
                                setGameType(item);
                                setGameTypeDropdown(false);
                              }}
                              key={item}
                              className={`flex items-center w-full px-[15px] rounded-[10px] hover:bg-[#fff]/30 duration-300 h-[37px] ${
                                gameType == item && "bg-[#fff]/30"
                              }`}
                            >
                              <p className="text-[16px] text-[#fff] truncate">
                                {item}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="flex px-[15px] items-center rounded-[10px] w-[154px] h-[37px] bg-[#4B4B4B] relative">
                    <p className="text-[16px] text-[#C1C1C1]">ODDS</p>
                    <RiExpandUpDownLine className="absolute text-[20px] right-[10px]" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[11px]">
                <p className="text-[13px] text-[#7E7E7E] leading-[100%]">
                  BET AMOUNT
                </p>
                <div className="flex items-center justify-center gap-[20px]">
                  <input
                    type="text"
                    placeholder="MIN"
                    className="w-[60px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />

                  <div className="flex items-center relative">
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute left-0 top-2 z-10"></div>
                    <div className="w-[10px] h-[5px] bg-[#383838] absolute right-0 top-2 z-10"></div>
                    <Slider
                      size="sm"
                      step={50}
                      minValue={0}
                      maxValue={1000}
                      defaultValue={[0, 1000]}
                      classNames={{
                        base: "w-[170px]",
                        track: "bg-[#000]/30 w-[500px] w-full",
                        filler: "bg-nafl-sponge-500",
                      }}
                      renderThumb={({ index, ...props }) => (
                        <div
                          {...props}
                          className="group p-2 top-1/2 bg-nafl-sponge-500 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing z-20"
                        ></div>
                      )}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="MAX"
                    className="w-[67px] h-[37px] flex items-center justify-center placeholder:text-[#C1C1C1] bg-[#4B4B4B] rounded-[10px] font-face-roboto px-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-[20px] bg-[#383838] mt-[30px]">
            <Table
              removeWrapper
              classNames={{
                th: "bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] font-face-roboto",
              }}
            >
              <TableHeader>
                <TableColumn>GAME</TableColumn>
                <TableColumn>PLAYER</TableColumn>
                <TableColumn>Buy-in</TableColumn>
                <TableColumn>Payout</TableColumn>
              </TableHeader>
              <TableBody
                items={sample_games_json}
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-row items-center gap-[7px] h-[70px]">
                        <img
                          src=""
                          alt="Game Icon"
                          className="w-[33px] h-[33px] bg-[#D9D9D9] border-[1px] border-[#DC2ABF] rounded-full"
                        />{" "}
                        <p className="text-[16px] font-bold">{item.game}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-[7px]">
                        <img
                          src={item.image}
                          alt="Game Icon"
                          className="w-[33px] h-[33px] bg-[#D9D9D9] rounded-full"
                        />{" "}
                        <p className="text-[16px] font-bold">
                          {shortenWalletAddress(item.player)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-[6px]">
                        <p className="text-[16px] font-bold">{item.buyin}</p>
                        <p className="text-[16px] font-bold">{item.currency}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-row items-center justify-between gap-[7px]">
                        <div className="flex flex-row items-center justify-center gap-[6px]">
                          <p className="text-[16px] font-bold">{item.payout}</p>
                          <p className="text-[16px] font-bold">
                            {item.currency}
                          </p>
                        </div>
                        {item.allowJoin && (
                          <button className="flex items-center justify-center w-[110px] h-[40px] rounded-[8px] border-[#DC2ABF] border-[1px] bg-trasparent">
                            <p className="text-[18px] font-bold">JOIN</p>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameZoneMain;

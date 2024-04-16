"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

interface tableRow {
  id: number;
  game: string;
  player: string;
  image: string;
  buyin: number;
  payout: number;
  currency: string;
  allowJoin: boolean;
}

const GameZoneGamesTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_games_json = [
    {
      id: 1,
      game: "COIN TOSS",
      player: "You",
      image: "/static/sample-account-image-1.png",
      buyin: 10.0,
      payout: 19.7,
      currency: "USDC",
      allowJoin: false,
    },
    {
      id: 2,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 3,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 4,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-1.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 5,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 6,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 7,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
    {
      id: 8,
      game: "ROCK, PAPER, SCISSORS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-2.png",
      buyin: 6.0,
      payout: 17.75,
      currency: "NAFF",
      allowJoin: true,
    },
    {
      id: 9,
      game: "COIN TOSS",
      player: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      image: "/static/sample-account-image-3.png",
      buyin: 1.0,
      payout: 1.97,
      currency: "SOL",
      allowJoin: true,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_games_json);
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 5) + "..." + address.slice(-7, -1);
    } else return address;
  };
  return (
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
          items={tableData}
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
                    <p className="text-[16px] font-bold">{item.currency}</p>
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
  );
};

export default GameZoneGamesTable;

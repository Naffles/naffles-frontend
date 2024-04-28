"use client";

import React, { useEffect, useState } from "react";
import {
  Slider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Checkbox,
} from "@nextui-org/react";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

interface tableRow {
  id: number;
  rank: number;
  profile: string;
  points: number;
}
const sample_demo_leaderboards_json = [
  {
    id: 1,
    rank: 1,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 2,
    rank: 2,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 3,
    rank: 3,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 4,
    rank: 4,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 5,
    rank: 5,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 6,
    rank: 6,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 7,
    rank: 7,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 8,
    rank: 8,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 9,
    rank: 9,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 10,
    rank: 10,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 11,
    rank: 11,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 12,
    rank: 12,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
  {
    id: 13,
    rank: 13,
    profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
    points: 265262.5,
  },
];

const DemoPointsLeaderboards = () => {
  const { points } = useBasicUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  useEffect(() => {
    const fetchTableData = () => {
      setTableData(sample_demo_leaderboards_json);
    };
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_demo_leaderboards_json);
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 5) + "..." + address.slice(-7, -1);
    } else return address;
  };

  return (
    <div className="flex flex-col items-center justify-start w-full lg:h-[560px] h-[580px] rounded-[16px] relative bg-[#383838] pt-[65px] px-[5px] gap-[36px] pb-[8px] lg:mt-[32px] mt-[132px]">
      <div className="flex items-center justify-center w-full absolute top-[-40px]">
        <div className="flex flex-row items-center justify-between w-full bg-[#444444] rounded-[16px] border-[1px] border-[#464646] drop-shadow-nafl-sponge-2xl h-[54px] px-[14px]">
          <div className="flex flex-col gap-[3px]">
            <p className="font-face-bebas text-[14px] text-[#DC2ABF] leading-[100%]">
              YOUR POINTS
            </p>
            <p className="font-face-bebas text-[20px] text-nafl-white leading-[100%]">
              {points}
            </p>
          </div>

          <div className="flex flex-col gap-[3px] items-end">
            <p className="font-face-bebas text-[14px] text-[#DC2ABF] leading-[100%]">
              JACKPOT
            </p>
            <div className="flex flex-row items-end justify-center gap-[3px]">
              <p className="font-face-bebas text-[24px] text-nafl-sponge-500 leading-[100%]">
                1259.69
              </p>
              <p className="font-face-bebas text-[20px] text-nafl-sponge-500 leading-[110%]">
                POINTS
              </p>
            </div>
          </div>
        </div>
        <img
          src="/static/jackpot-img.png"
          alt="Jackpot Image"
          className="w-[180px] object-contain absolute top-[-75px] shake"
        />
      </div>
      <div className="w-full px-[18px]">
        <Table
          isHeaderSticky
          aria-label="Demo Games Leaderboards table"
          removeWrapper
          classNames={{
            base: "max-h-[430px] overflow-hidden overflow-y-scroll balance-scrollbar",
            table: "min-h-[360px]",
            th: "h-[36px] bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
          }}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>PROFILE</TableColumn>
            <TableColumn>POINTS</TableColumn>
          </TableHeader>
          <TableBody
            items={tableData}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-row py-[20px]">
                    <p className="text-[16px] text-[#fff] font-bold">
                      {item.rank}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row">
                    <p className="text-[16px] text-[#fff] font-bold">
                      {shortenWalletAddress(item.profile)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row">
                    <p className="text-[16px] text-[#fff] font-bold">
                      {item.points.toLocaleString()}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <button className="flex items-center justify-center bg-nafl-sponge-500 rounded-[11px] border-[2px] border-[#464646] w-[96%] h-[45px] gap-[30px] relative bottom-[8px]">
        <img
          src="/static/challenge-img.png"
          alt="Challenge Mate Image"
          className="w-[68px] object-contain"
        />
        <p className="text-[#464646] text-[13px] font-bold">
          READY TO CHALLENGE YOUR MATES?
        </p>
      </button>
    </div>
  );
};

export default DemoPointsLeaderboards;

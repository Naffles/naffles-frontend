"use client";

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
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

interface tableRow {
  id: number;
  rank: number;
  profile: string;
  raffles: number;
  games: number;
  points: number;
}

const LeaderboardNafflersTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_nafflers_json = [
    {
      id: 1,
      rank: 6969,
      profile: "You",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 2,
      rank: 2,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 3,
      rank: 3,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 4,
      rank: 4,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 5,
      rank: 5,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 6,
      rank: 6,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 7,
      rank: 7,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 8,
      rank: 8,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 9,
      rank: 9,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 10,
      rank: 10,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 11,
      rank: 11,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 12,
      rank: 12,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
    {
      id: 13,
      rank: 13,
      profile: "0x047eaCd122Bc4f67649e65968dF9Ff1469e11BF5",
      raffles: 175,
      games: 169,
      points: 265262.5,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_nafflers_json);
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 5) + "..." + address.slice(-7, -1);
    } else return address;
  };

  return (
    <div className="w-full lg:px-[20px] px-[10px] bg-[#383838] mb-[50px] mt-[80px] min-h-[800px]">
      {/* <Table
        aria-label="Admin transactions table"
        removeWrapper
        classNames={{
          th: "h-[36px] bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
          base: "h-[800px] w-full overflow-scroll balance-scrollbar",
        }}
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>PROFILE</TableColumn>
          <TableColumn>RAFFLES</TableColumn>
          <TableColumn>GAMES</TableColumn>
          <TableColumn>
            <div className="relative flex">
              <p>NAFFLINGS</p>
              <div className="absolute w-[60px] right-[-5px] lg:right-[35px] top-[-5px] hidden md:block">
                <img src="/nafflings/three-group.png" alt="" />
              </div>
            </div>
          </TableColumn>
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
                    {item.raffles.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-end">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.games.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.points.toLocaleString()}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table> */}
      <div className="flex items-center justify-center h-[200px]">
        <p className="font-mono text-[32px]">Coming Soon</p>
      </div>
    </div>
  );
};

export default LeaderboardNafflersTable;

"use client";

import { fetchLeaderboard } from "@components/utils/leaderboardsApi";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";
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

interface User {
  _id: string;
  username: string;
  profileImage: string;
  temporaryPoints: string;
}

interface tableRow {
  rank: number;
  user: User;
  rafflesEntered: number;
  gamesPlayed: number;
  nafflings: string;
}

const LeaderboardNafflersTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = async () => {
    try {
      const leaderboardData = await fetchLeaderboard("top-nafflers", 1, 100);
      console.log("leaderboardNafflersData", leaderboardData);
      if (leaderboardData.statusCode == 200) {
        setTableData(leaderboardData.data.leaderboard);
      } else {
        console.log(
          `Error fetching recentWinners: ${leaderboardData.data.message}`
        );
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      // toast.error(`Error fetching recentWinners: ${errorData.message}`);
      console.log(`Error fetching recentWinners: ${errorData.message}`);
    }
  };

  const shortenUsername = (address: string) => {
    if (address?.length > 14) {
      return address.slice(0, 14) + "...";
    } else return address;
  };

  return (
    <div className="w-full lg:px-[20px] px-[10px] bg-[#383838] mb-[50px] mt-[80px] min-h-[800px]">
      <Table
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
            <TableRow key={item.user._id}>
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
                    {shortenUsername(item.user.username)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.rafflesEntered.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-end">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.gamesPlayed.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {parseFloat(
                      tokenValueConversion(item.nafflings, "points")
                    ).toLocaleString()}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <div className="flex items-center justify-center h-[200px]">
        <p className="font-mono text-[32px] text-white">Coming Soon</p>
      </div> */}
    </div>
  );
};

export default LeaderboardNafflersTable;

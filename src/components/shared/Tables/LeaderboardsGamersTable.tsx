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
  user,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { fetchLeaderboard } from "@components/utils/leaderboardsApi";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";

interface tableRow {
  id: number;
  rank: number;
  profile: string;
  played: number;
  won: number;
  winnings: number;
  points: number;
}

const LeaderboardGamersTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = async () => {
    // setTableData(sample_gamers_json);
    const leaderboardData = await fetchLeaderboard("top-gamers", 1, 100);
    setTableData(leaderboardData.data.topGamers);
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 5) + "..." + address.slice(-7, address.length);
    } else return address;
  };

  return (
    <div className="flex flex-col w-full lg:px-[20px] px-[10px] bg-[#383838] mb-[50px] gap-[30px] mt-[80px] min-h-[800px]">
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
          <TableColumn>PLAYED</TableColumn>
          <TableColumn>WON</TableColumn>
          <TableColumn>WINNINGS (USD)</TableColumn>
          <TableColumn>NAFFLINGS</TableColumn>
        </TableHeader>
        <TableBody
          items={tableData}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item?.user._id}>
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
                    {shortenWalletAddress(item?.user.username)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.gamesPlayed?.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-end">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.gamesWon?.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.totalWinnings?.toLocaleString()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
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
    </div>
  );
};

export default LeaderboardGamersTable;

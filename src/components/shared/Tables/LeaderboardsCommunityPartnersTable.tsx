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
  rank: number;
  partner: string;
  players: number;
  tickets: number;
  winnings: number;
  points: number;
}

const LeaderboardsCommunityPartnersTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_community_partners_json = [
    {
      id: 1,
      rank: 1,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 2,
      rank: 2,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 3,
      rank: 3,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 4,
      rank: 4,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 5,
      rank: 5,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 6,
      rank: 6,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 7,
      rank: 7,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 8,
      rank: 8,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 9,
      rank: 9,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 10,
      rank: 10,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 11,
      rank: 11,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 12,
      rank: 12,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
    {
      id: 13,
      rank: 13,
      partner: "Partner Name",
      players: 69,
      tickets: 12069,
      winnings: 69069,
      points: 965262,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_community_partners_json);
  };

  return (
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
        <TableColumn>PARTNER</TableColumn>
        <TableColumn>PLAYERS</TableColumn>
        <TableColumn>TICKETS</TableColumn>
        <TableColumn>WINNINGS (USD)</TableColumn>
        <TableColumn>NAFFLINGS</TableColumn>
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
                <p className="text-[16px] text-[#fff] font-bold">{item.rank}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.partner}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.players.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.tickets.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-center">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.winnings.toLocaleString()}
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
  );
};

export default LeaderboardsCommunityPartnersTable;

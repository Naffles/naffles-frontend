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
  collection: string;
  raffles: number;
  ticketsSold: number;
  volume: number;
  points: number;
}

const LeaderboardsCommunityNFTTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_community_collection_json = [
    {
      id: 1,
      rank: 1,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 2,
      rank: 2,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 3,
      rank: 3,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 4,
      rank: 4,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 5,
      rank: 5,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 6,
      rank: 6,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 7,
      rank: 7,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 8,
      rank: 8,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 9,
      rank: 9,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 10,
      rank: 10,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 11,
      rank: 11,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 12,
      rank: 12,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
    {
      id: 13,
      rank: 13,
      collection: "NFT Collection",
      raffles: 69,
      ticketsSold: 12069,
      volume: 69069,
      points: 965262.5,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_community_collection_json);
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
        <TableColumn>NFT COLLECTION</TableColumn>
        <TableColumn>RAFFLES</TableColumn>
        <TableColumn>TICKETS SOLD</TableColumn>
        <TableColumn>VOLUME (USD)</TableColumn>
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
                <p className="text-[16px] text-[#fff] font-bold">{item.rank}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.collection}
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
                  {item.ticketsSold.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-center">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.volume.toLocaleString()}
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

export default LeaderboardsCommunityNFTTable;

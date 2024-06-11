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
  duration: number;
  TVL: number;
  APR: number;
  dailyAPR: number;
}

const StakeTokensRewardsTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_token_staking_rewards_json = [
    {
      id: 1,
      duration: 1,
      TVL: 12156,
      APR: 210.2,
      dailyAPR: 0.58,
    },
    {
      id: 2,
      duration: 3,
      TVL: 232069,
      APR: 446.8,
      dailyAPR: 1.22,
    },
    {
      id: 3,
      duration: 6,
      TVL: 1211156,
      APR: 657.0,
      dailyAPR: 1.8,
    },
    {
      id: 4,
      duration: 12,
      TVL: 2969969,
      APR: 1314.0,
      dailyAPR: 3.6,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_token_staking_rewards_json);
  };

  return (
    <Table
      aria-label="Admin transactions table"
      removeWrapper
      classNames={{
        th: "h-[36px] bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
        tr: "h-[20px]",
        base: "w-full h-[200px] lg:overflow-visible overflow-x-scroll overflow-y-hidden balance-scrollbar",
      }}
    >
      <TableHeader>
        <TableColumn>DURATION</TableColumn>
        <TableColumn>TVL</TableColumn>
        <TableColumn>APR</TableColumn>
        <TableColumn>DAILY APR</TableColumn>
      </TableHeader>
      <TableBody
        items={tableData}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] leading-[100%] text-[#fff] font-bold">
                  {item.duration}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.TVL.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">{item.APR}%</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.dailyAPR}%
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default StakeTokensRewardsTable;

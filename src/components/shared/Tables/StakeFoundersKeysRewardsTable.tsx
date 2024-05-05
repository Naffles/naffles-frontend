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
  keyStaked: number;
  dailyNaff: number;
  naffYr: number;
  openEntry: number;
}

const StakeFoundersKeysRewardsTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_staking_founders_keys = [
    {
      id: 1,
      duration: 1,
      keyStaked: 14,
      dailyNaff: 5,
      naffYr: 1825,
      openEntry: 1,
    },
    {
      id: 2,
      duration: 3,
      keyStaked: 9,
      dailyNaff: 10,
      naffYr: 3650,
      openEntry: 3,
    },
    {
      id: 3,
      duration: 6,
      keyStaked: 18,
      dailyNaff: 18,
      naffYr: 6570,
      openEntry: 10,
    },
    {
      id: 4,
      duration: 12,
      keyStaked: 205,
      dailyNaff: 35,
      naffYr: 12775,
      openEntry: 20,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_staking_founders_keys);
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
        <TableColumn>KEYS STAKED</TableColumn>
        <TableColumn>DAILY $NAFF</TableColumn>
        <TableColumn>$NAFF/YR</TableColumn>
        <TableColumn>OPEN-ENTRY/MO</TableColumn>
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
                  {item.duration} {item.duration > 0 ? "months" : "month"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.keyStaked.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.dailyNaff.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.naffYr.toLocaleString()}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.openEntry.toLocaleString()}
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default StakeFoundersKeysRewardsTable;

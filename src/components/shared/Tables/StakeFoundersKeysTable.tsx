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
import { RiExpandUpDownLine } from "react-icons/ri";

interface tableRow {
  id: number;
  tokenId: number;
  key: string;
  status: string;
  stakeDuration: number;
  lockEnds: string;
  setStakeDuration: number;
  allowUnstake: boolean;
  allowClaim: boolean;
}

const StakeFoundersKeysTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  let sample_staking_founders_keys = [
    {
      id: 1,
      tokenId: 11,
      key: "/static/sample-key-image.png",
      status: "Unstaked",
      stakeDuration: 0,
      lockEnds: "Unlocked",
      setStakeDuration: 12,
      allowUnstake: false,
      allowClaim: true,
    },
    {
      id: 2,
      tokenId: 33,
      key: "/static/sample-key-image.png",
      status: "Staked",
      stakeDuration: 12,
      lockEnds: "30-Mar-2023",
      setStakeDuration: 12,
      allowUnstake: false,
      allowClaim: true,
    },
    {
      id: 3,
      tokenId: 69,
      key: "/static/sample-key-image.png",
      status: "Staked",
      stakeDuration: 12,
      lockEnds: "Unlocked",
      setStakeDuration: 12,
      allowUnstake: true,
      allowClaim: true,
    },
    {
      id: 4,
      tokenId: 111,
      key: "/static/sample-key-image.png",
      status: "Unstaked",
      stakeDuration: 0,
      lockEnds: "Unlocked",
      setStakeDuration: 12,
      allowUnstake: false,
      allowClaim: true,
    },
    {
      id: 5,
      tokenId: 222,
      key: "/static/sample-key-image.png",
      status: "Unstaked",
      stakeDuration: 0,
      lockEnds: "Unlocked",
      setStakeDuration: 12,
      allowUnstake: false,
      allowClaim: true,
    },
    {
      id: 6,
      tokenId: 333,
      key: "/static/sample-key-image.png",
      status: "Staked",
      stakeDuration: 12,
      lockEnds: "Unlocked",
      setStakeDuration: 12,
      allowUnstake: true,
      allowClaim: true,
    },
    {
      id: 7,
      tokenId: 369,
      key: "/static/sample-key-image.png",
      status: "Staked",
      stakeDuration: 12,
      lockEnds: "30-Mar-2023",
      setStakeDuration: 12,
      allowUnstake: false,
      allowClaim: true,
    },
  ];

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = () => {
    setTableData(sample_staking_founders_keys);
  };

  const TableStakeOption = () => {
    let sample_staking_period_options = [
      { id: "qwe1", count: 1, period: "Month" },
      { id: "qwe3", count: 3, period: "Months" },
      { id: "qwe6", count: 6, period: "Months" },
      { id: "qwe12", count: 12, period: "Months" },
    ];

    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const [selectedCount, setSelectedCount] = useState<number>(1);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Month");
    return (
      <div className="flex flex-row items-center justify-center gap-[11px]">
        <div className="w-[170px] h-[50px] relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex flex-row items-center justify-start w-full h-full rounded-[11px] bg-[#4B4B4B] border-[1px] border-nafl-sponge-500 relative px-[23px] font-face-roboto"
          >
            {selectedCount} {selectedPeriod}
            <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />
          </button>
          {openDropdown && (
            <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
              <div className="flex flex-col w-full gap-[6px]">
                {sample_staking_period_options.map((item) => (
                  <button
                    onClick={() => {
                      setSelectedCount(item.count);
                      setSelectedPeriod(item.period);
                      setOpenDropdown(false);
                    }}
                    key={item.id}
                    className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                      selectedCount == item.count && "bg-[#fff]/30"
                    }`}
                  >
                    <p className="text-[#fff] text-[16px]">
                      {item.count} {item.period}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="flex items-center justify-center w-[134px] h-[50px] rounded-[8px] bg-nafl-sponge-500">
          <p className="text-[#000] font-bold">STAKE</p>
        </button>
      </div>
    );
  };

  const TableClaimOption = ({
    allowUnstake,
    allowClaim,
  }: {
    allowUnstake: boolean;
    allowClaim: boolean;
  }) => {
    return (
      <div className="flex flex-row items-center justify-center gap-[11px]">
        <button
          disabled={!allowUnstake}
          className={`flex items-center justify-center w-[137px] h-[50px] rounded-[8px] ${allowUnstake ? "bg-[#02B1B1] text-nafl-white" : "bg-[#4B4B4B] text-[#727272]"}`}
        >
          <p className="font-bold">UNSTAKE</p>
        </button>
        <button
          disabled={!allowClaim}
          className={`flex items-center justify-center w-[166px] h-[50px] rounded-[8px] ${allowClaim ? "bg-nafl-sponge-500 text-[#000]" : "bg-[#4B4B4B] text-[#727272]"}`}
        >
          <p className="font-bold">CLAIM TOKENS</p>
        </button>
      </div>
    );
  };

  return (
    <Table
      aria-label="Founders Keys Table"
      removeWrapper
      classNames={{
        th: "h-[36px] bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
        tr: "h-[20px]",
        base: "w-full h-[520px] overflow-hidden overflow-scroll balance-scrollbar",
      }}
    >
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>KEY</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>LOCK ENDS</TableColumn>
        <TableColumn>ACTION</TableColumn>
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
                <p className="text-[16px] leading-[100%] text-[#fff] font-face-bebas">
                  #{item.tokenId}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <img
                  src={item.key}
                  alt="Image Key"
                  className="h-[50px] object-contain"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row">
                <p className="text-[16px] text-[#fff] font-bold">
                  {`${item.status} ${item.status == "Staked" && `(${item.stakeDuration} months)`}`}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end">
                <p className="text-[16px] text-[#fff] font-bold">
                  {item.lockEnds}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-end gap-[11px]">
                {item.status == "Unstaked" ? (
                  <TableStakeOption />
                ) : (
                  <TableClaimOption
                    allowUnstake={item.allowUnstake}
                    allowClaim={item.allowClaim}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default StakeFoundersKeysTable;

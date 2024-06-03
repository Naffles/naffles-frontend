"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import { jackpotAmount } from "@components/utils/jackpotCounter";
import { fetchLeaderboard } from "@components/utils/leaderboardsApi";
import { tokenValueConversion } from "@components/utils/tokenTypeConversion";

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
  const [previousPoints, setPreviousPoints] = useState(0);
  const [showAddedPoints, setShowAddedPoints] = useState(false);
  const { points } = useBasicUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [jackpotTotalAmount, setJackpotTotalAmount] = useState<any>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchTableData = async () => {
      // setTableData(sample_demo_leaderboards_json);

      const leaderboardData = await fetchLeaderboard("top-gamers", 1, 50);
      setTableData(leaderboardData.data.leaderboard);

      console.log(leaderboardData, "leaderboards Data not from API");
      console.log(tableData, "tableData");
    };
    fetchTableData();
    setIsLoading(false);
  }, []);

  const intervalSet = useRef(false);
  useEffect(() => {
    const fetchInitialJackpot = async () => {
      try {
        const initialAmount = await jackpotAmount("nafflings");
        setJackpotTotalAmount(initialAmount.jackpotInitial);
        if (!intervalSet.current) {
          intervalSet.current = true;
          const interval = setInterval(() => {
            setJackpotTotalAmount(
              (prevAmount: number) =>
                prevAmount + initialAmount.jackpotPointPerSec
            );
          }, 10000);

          return () => {
            clearInterval(interval);
            intervalSet.current = false;
          };
        }
      } catch (error) {
        console.error("Failed to fetch initial jackpot amount:", error);
      }
    };
    fetchInitialJackpot();
  }, []);

  const fetchTableData = () => {
    setTableData(sample_demo_leaderboards_json);
  };

  const shortenWalletAddress = (address: string) => {
    if (address?.length > 10) {
      return address.slice(0, 5) + "..." + address.slice(-7, address.length);
    } else return address;
  };

  const navigaToGameZone = () => {
    router.push("/gamezone");
  };

  useEffect(() => {
    setShowAddedPoints(true);
    setTimeout(() => {
      setPreviousPoints(points);
      setShowAddedPoints(false);
    }, 2000);
  }, [points]);

  const pointsDifference = points - previousPoints;

  return (
    <div className="flex flex-col items-center justify-start w-full lg:h-[560px] h-[580px] rounded-[16px] relative bg-[#383838] pt-[65px] px-[5px] gap-[36px] pb-[8px] lg:mt-[32px] mt-[132px]">
      <div className="flex items-center justify-center w-full absolute top-[-40px]">
        <div className="flex flex-row items-center justify-between w-full bg-[#444444] rounded-[16px] border-[1px] border-[#464646] drop-shadow-nafl-sponge-2xl h-[54px] px-[14px]">
          <div className="flex flex-col gap-[3px]">
            <p className="font-face-bebas text-[14px] text-[#DC2ABF] leading-[100%]">
              YOUR NAFFLINGS
            </p>
            <div className="relative">
              <p className="font-face-bebas text-[20px] text-nafl-white leading-[100%]">
                {points}
              </p>

              {showAddedPoints && !!pointsDifference && (
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: -40 }}
                  transition={{ type: "spring", duration: 3 }}
                  className="absolute w-[52px] top-[-10px] right-[-10px]"
                >
                  <div className="relative flex items-center justify-center text-center">
                    <img src="/nafflings/surprise3.png" alt="" />
                    <p className="font-face-bebas absolute">
                      +{pointsDifference}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[3px] items-end">
            <p className="font-face-bebas text-[14px] text-[#DC2ABF] leading-[100%]">
              JACKPOT
            </p>
            <div className="flex flex-row items-end justify-center gap-[3px]">
              <p className="font-face-bebas text-[24px] text-nafl-sponge-500 leading-[100%]">
                {jackpotTotalAmount}
              </p>
              <p className="font-face-bebas text-[20px] text-nafl-sponge-500 leading-[110%]">
                NAFFLINGS
              </p>
            </div>
          </div>
        </div>
        <div className="w-[180px] object-contain absolute top-[-75px] right-[110px] shake">
          <div className="relative flex justify-center">
            <img
              src="/static/jackpot-img.png"
              alt="Jackpot Image"
              className="z-10"
            />
            <img
              src="/nafflings/wonder.png"
              alt=""
              className="absolute top-[-35px] z-[-1] w-[120px] drop-shadow-nafl-sponge-2xl "
            />
            <img
              src="/nafflings/chest-group.png"
              alt=""
              className="absolute top-[75px] z-20 w-[70px] drop-shadow-nafl-sponge-2xl "
            />
          </div>
        </div>
      </div>
      <div className="w-full px-[18px]">
        <Table
          isHeaderSticky
          aria-label="Demo Games Leaderboards table"
          removeWrapper
          classNames={{
            base: "h-[430px] overflow-hidden overflow-y-scroll balance-scrollbar",
            th: "h-[36px] bg-[#383838] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
          }}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>PROFILE</TableColumn>
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
                  <div className="flex flex-row">
                    <p className="text-[16px] text-[#fff] font-bold">
                      {item.rank}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row">
                    <p className="text-[16px] text-[#fff] font-bold">
                      {shortenWalletAddress(item?.user?.username)}
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

      <button
        className="flex items-center justify-center bg-nafl-sponge-500 rounded-[11px] border-[2px] border-[#464646] w-[96%] h-[45px] gap-[30px] absolute bottom-[10px]"
        onClick={() => navigaToGameZone()}
      >
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

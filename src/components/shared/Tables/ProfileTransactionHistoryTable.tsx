"use client";

import { useEffect, useState } from "react";
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
import axios from "@components/utils/axios";
import moment from "moment";

interface User {
  _id: string;
  username: string;
}

interface tableRow {
  date: string;
  eventType: string;
  priceOrBuyIn: string;
  prizeOrPayout: string;
  sellerOrOpponent: User;
  status: string;
  ticketNumber: string;
  coinType: string;
}

const ProfileTransactionHistory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<tableRow[]>([]);

  useEffect(() => {
    fetchTableData();
    setIsLoading(false);
  }, []);

  const fetchTableData = async () => {
    // `/user/transaction/history/?page=1&limit=${10}`
    try {
      const TransactionHistoryReturn = await axios.get(
        `/user/transaction/history`
      );

      console.log("TransactionHistoryReturn", TransactionHistoryReturn);
      if (TransactionHistoryReturn.data.statusCode == 200) {
        setTableData(TransactionHistoryReturn.data.data.transactions);
      } else {
        console.log(
          `Error fetching recentWinners: ${TransactionHistoryReturn.data.message}`
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

  const randomString = (length: number, chars: string) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  return (
    <div className="w-full lg:px-[0px] md:px-[10px] mb-[50px] min-h-[800px]">
      <Table
        aria-label="Admin transactions table"
        removeWrapper
        classNames={{
          th: "h-[50px] bg-[#464646] border-y-[1px] border-[#fff] text-[#fff] text-[16px] font-face-roboto",
          base: "h-[800px] w-full overflow-scroll balance-scrollbar",
        }}
      >
        <TableHeader>
          <TableColumn>DATE</TableColumn>
          <TableColumn>EVENT TYPE</TableColumn>
          <TableColumn>PRICE/BUY-IN</TableColumn>
          <TableColumn>PRIZE/PAYOUT</TableColumn>
          <TableColumn>TICKET #</TableColumn>
          <TableColumn>SELLER/OPPONENT</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody
          items={tableData}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow
              key={randomString(
                12,
                "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
              )}
            >
              <TableCell>
                <div className="flex flex-row py-[20px]">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {moment(item.date).format("MM/DD/YYYY h:mmA")}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row py-[20px]">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.eventType}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-row">
                  <p className="text-[16px] text-[#fff] font-bold uppercase">
                    {item.coinType}{" "}
                    {item.priceOrBuyIn
                      ? tokenValueConversion(
                          item.priceOrBuyIn,
                          item.coinType
                        ).toLocaleString()
                      : 0}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-end">
                  <p className="text-[16px] text-[#fff] font-bold uppercase">
                    {item.coinType}{" "}
                    {item.prizeOrPayout
                      ? tokenValueConversion(
                          item.prizeOrPayout,
                          item.coinType
                        ).toLocaleString()
                      : 0}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.ticketNumber}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {shortenUsername(item.sellerOrOpponent.username)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
                  <p className="text-[16px] text-[#fff] font-bold">
                    {item.status}
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

export default ProfileTransactionHistory;

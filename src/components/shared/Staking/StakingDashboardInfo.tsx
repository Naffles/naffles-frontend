"use client";

import { useUser } from "@blockchain/context/UserContext";
import React, { useEffect, useState } from "react";

interface StakingDashboardInfoData {
  id: string;
  description: string;
  value: string;
}

const StakingDashboardInfo = () => {
  // this is a custom react hook(context) that stores user info including JWT, address and more.
  const { user } = useUser();

  // this holds all data shown on UI
  const [stakingDashboardData, setStakingDashboardData] =
    useState<StakingDashboardInfoData[]>();

  //sample dynamic data for dashboard info
  let temp_staking_info_data = [
    {
      id: "1",
      description: "$NAFF Wallet Balance",
      value: "6,969",
    },
    {
      id: "2",
      description: "Staked $NAFF",
      value: "106,969",
    },
    {
      id: "3",
      description: "Unclaimed $NAFF Rewards",
      value: "5,699",
    },
    {
      id: "4",
      description: "Founders Keys",
      value: "5 (3 staked)",
    },
    {
      id: "5",
      description: "Claimable Open-Entries",
      value: "160",
    },
  ];

  useEffect(() => {
    // use this function to call api and set data
    user?.jwt && fetchStakingDashbordData(user?.jwt);
  }, [user]);

  const fetchStakingDashbordData = async (jwt: string) => {
    setStakingDashboardData(temp_staking_info_data);
  };

  const StakingDashboardInfo = ({
    description,
    value,
  }: {
    description: string;
    value: string;
  }) => (
    <div className="flex flex-row items-center justify-between w-full">
      <p className="text-[22px] text-[#969696]">{description}:</p>
      <p className="text-[22px] text-nafl-white font-bold">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start lg:w-[470px] max-w-[470px] w-[90%] gap-[27px]">
      <p className="text-nafl-white text-[40px] font-face-bebas leading-[100%]">
        STAKE/CLAIM DASHBOARD
      </p>
      <p className="w-full text-nafl-white text-[30px] font-face-bebas leading-[100%]">
        Wallet: {user?.address}
      </p>
      <div className="flex flex-col items-center justify-start gap-[10px] w-full px-[20px]">
        {stakingDashboardData?.map((item) => (
          <StakingDashboardInfo
            key={item.id}
            description={item.description}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};

export default StakingDashboardInfo;

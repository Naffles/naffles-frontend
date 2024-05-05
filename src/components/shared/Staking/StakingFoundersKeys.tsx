"use client";

import React from "react";
import StakeFoundersKeysRewardsTable from "../Tables/StakeFoundersKeysRewardsTable";
import StakeFoundersKeysTable from "../Tables/StakeFoundersKeysTable";

const StakingFoundersKeys = () => {
  let founders_keys_data = [
    {
      id: "1",
      description: "Unstaked",
      value: 2,
    },
    {
      id: "2",
      description: "1 Month",
      value: 0,
    },
    {
      id: "3",
      description: "3 Months",
      value: 0,
    },
    {
      id: "4",
      description: "6 Months",
      value: 1,
    },
    {
      id: "5",
      description: "12 Months",
      value: 2,
    },
  ];

  const FoundersKeysData = ({
    description,
    value,
  }: {
    description: string;
    value: number;
  }) => (
    <div className="flex flex-row items-center justify-between w-full">
      <p className="text-nafl-white text-[22px]">{description}:</p>
      <p className="text-nafl-white text-[22px]">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start w-full gap-[55px]">
      <p className="text-[60px] text-nafl-white font-face-bebas w-full">
        Founders Keys
      </p>
      <div className="flex w-full flex-wrap md:px-[40px] px-[20px] gap-[48px]">
        <div className="flex flex-col lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] px-[30px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas">
            Founders Keys
          </p>
          <div className="flex flex-col w-full gap-[6px]">
            {founders_keys_data?.map((item) => (
              <FoundersKeysData
                key={item.id}
                description={item.description}
                value={item.value}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-start lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] pb-[30px] px-[30px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            Unclaimed rewards
          </p>
          <div className="flex flex-col items-center w-full gap-[55px]">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-nafl-white text-[22px]">
                Claimable Open-Entries
              </p>
              <p className="text-nafl-white text-[22px]">1,699</p>
            </div>

            <button className="flex items-center justify-center md:w-[245px] w-full h-[55px] rounded-[8px] bg-[#02B1B1]">
              <p className="text-nafl-white text-[18px] font-bold">
                CLAIM ALL REWARDS
              </p>
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full rounded-[16px] border-[1px] border-nafl-sponge-500 pt-[10px] pb-[20px] md:px-[30px] px-[15px] bg-[#383838] gap-[26px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            FOUNDERS Keys STAKING REWARDS
          </p>
          <p className="text-nafl-white text-[14px]">
            Stake Founders Keys can earn juicy token rewards
          </p>

          <div className="w-full">
            <StakeFoundersKeysRewardsTable />
          </div>
        </div>
        <p className="text-nafl-white text-[14px] mt-[-30px]">
          Refer to Staking Benefits for full benefits of staking the Founders
          Keys
        </p>

        <div className="flex flex-col w-full rounded-[16px] border-[1px] border-nafl-sponge-500 pt-[10px] pb-[20px] md:px-[30px] px-[15px] bg-[#383838] gap-[26px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            FOUNDERS KEYS STAKING
          </p>
          <div className="w-full">
            <StakeFoundersKeysTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingFoundersKeys;

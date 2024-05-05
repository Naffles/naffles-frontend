"use client";

import React, { useState } from "react";
import StakeTokensRewardsTable from "../Tables/StakeTokensRewardsTable";
import StakingModal from "./StakingModal";
import toast from "react-hot-toast";

const StakingTokens = () => {
  const [showStakeModal, setShowStakeModal] = useState<boolean>(false);

  let stake_balance_data = [
    {
      id: "1",
      description: "1 Month",
      value: 0,
    },
    {
      id: "2",
      description: "3 Months",
      value: 6699,
    },
    {
      id: "3",
      description: "6 Months",
      value: 0,
    },
    {
      id: "4",
      description: "12 Months",
      value: 12103,
    },
  ];

  const StakeBalanceData = ({
    description,
    value,
  }: {
    description: string;
    value: number;
  }) => (
    <div className="flex flex-row items-center justify-between w-full">
      <p className="text-nafl-white text-[22px]">{description}</p>
      <p className="text-nafl-white text-[22px]">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start w-full gap-[55px]">
      <p className="text-[60px] text-nafl-white font-face-bebas w-full">
        TOKENS
      </p>
      <div className="flex w-full flex-wrap md:px-[40px] px-[20px] gap-[48px]">
        <div className="flex flex-col lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] px-[30px] md:h-[240px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas">
            Staked $NAFF balance
          </p>
          <div className="flex flex-col w-full gap-[6px]">
            {stake_balance_data?.map((item) => (
              <StakeBalanceData
                key={item.id}
                description={item.description}
                value={item.value}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-start lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] px-[30px] md:h-[240px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            Unclaimed rewards
          </p>
          <div className="flex flex-col items-center w-full gap-[55px]">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-nafl-white text-[22px]">Claimable APR $NAFF</p>
              <p className="text-nafl-white text-[22px]">5,699</p>
            </div>

            <button className="flex items-center justify-center w-[245px] h-[55px] rounded-[8px] bg-[#02B1B1]">
              <p className="text-nafl-white text-[18px] font-bold">
                CLAIM REWARDS
              </p>
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full rounded-[16px] border-[1px] border-nafl-sponge-500 pt-[10px] pb-[20px] px-[30px] bg-[#383838] gap-[26px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            TOKEN STAKING REWARDS
          </p>
          <p className="text-nafl-white text-[14px]">
            Stake $NAFL to start earning juicy rewards
          </p>

          <div className="flex flex-row flex-wrap items-end justify-between w-full">
            <div className="lg:w-[600px] w-full">
              <StakeTokensRewardsTable />
            </div>
            <button
              onClick={() => setShowStakeModal(true)}
              className="bg-nafl-sponge-500 rounded-[8px] px-[50px] h-[55px]"
            >
              <p className="text-[#000] text-[18px] font-bold">STAKE</p>
            </button>
          </div>

          <p className="text-nafl-white text-[14px]">
            All APR’s shown are current APR’s and are variable depending on the
            number of tokens staked.
          </p>
        </div>
      </div>

      <StakingModal
        show={showStakeModal}
        setShow={setShowStakeModal}
        walletBalance={69690}
        walletBalanceType="$NAFF"
        currentAPR={1314}
      />
    </div>
  );
};

export default StakingTokens;

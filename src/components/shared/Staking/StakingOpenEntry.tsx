"use client";

import React from "react";

const StakingOpenEntry = () => {
  let open_entry_data = [
    {
      id: "1",
      description: "You've earned",
      value: 400,
    },
    {
      id: "2",
      description: "You've Claimed",
      value: 240,
    },
    {
      id: "3",
      description: "You've Used",
      value: 60,
    },
    {
      id: "4",
      description: "You Have",
      value: 180,
    },
  ];

  const OpenEntryData = ({
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
        OPEN-ENTRY
      </p>
      <div className="flex w-full flex-wrap md:px-[40px] px-[20px] gap-[48px]">
        <div className="flex flex-col lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] px-[30px] md:h-[240px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas">
            OPEN ENTRY TICKETS
          </p>
          <div className="flex flex-col w-full gap-[6px]">
            {open_entry_data?.map((item) => (
              <OpenEntryData
                key={item.id}
                description={item.description}
                value={item.value}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-start lg:w-[47%] w-full rounded-[16px] border-[1px] border-nafl-sponge-500 py-[10px] px-[30px] md:h-[240px] bg-[#383838] gap-[10px]">
          <p className="text-[32px] text-nafl-white font-face-bebas w-full">
            Claim your tickets
          </p>
          <div className="flex flex-col items-center w-full gap-[55px]">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-nafl-white text-[22px]">Claimable Tickets</p>
              <p className="text-nafl-white text-[22px]">160</p>
            </div>

            <button className="flex items-center justify-center md:w-[245px] w-full h-[55px] rounded-[8px] bg-[#02B1B1]">
              <p className="text-nafl-white text-[18px] font-bold">
                CLAIM ALL TICKETS
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingOpenEntry;

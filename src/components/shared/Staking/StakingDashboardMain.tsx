"use client";

import { useState } from "react";
import StakingTokens from "./StakingTokens";
import StakingFoundersKeys from "./StakingFoundersKeys";
import StakingOpenEntry from "./StakingOpenEntry";

const StakingDashboardMain = () => {
  const [selectedTab, setSelectedTab] = useState<
    "tokens" | "foundersKeys" | "openEntry"
  >("tokens");

  return (
    <>
      <div className="flex flex-col items-center justify-start xl:w-[1035px] w-[90%] pb-[27px] gap-[50px]">
        {/* STAKE/CLAIM TABS */}
        <div className="flex flex-row items-end justify-between mt-[20px] w-full">
          <div className="flex flex-row items-end justify-start gap-[4px] border-b-[1px] border-nafl-sponge-500 w-full">
            <button
              onClick={() => setSelectedTab("tokens")}
              className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "tokens" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
            >
              <p className="md:text-[23px] text-[12px] font-face-bebas">
                TOKENS
              </p>
            </button>
            <button
              onClick={() => setSelectedTab("foundersKeys")}
              className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "foundersKeys" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
            >
              <p className="md:text-[23px] text-[12px] font-face-bebas">
                FOUNDERS KEYS
              </p>
            </button>
            <button
              onClick={() => setSelectedTab("openEntry")}
              className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "openEntry" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
            >
              <p className="md:text-[23px] text-[12px] font-face-bebas">
                OPEN-ENTRY
              </p>
            </button>
          </div>
        </div>

        {/* TABS CONTENT */}
        <div className="flex flex-col w-full md:px-[21px] px-[0px] mb-[50px]">
          {selectedTab == "tokens" && <StakingTokens />}
          {selectedTab == "foundersKeys" && <StakingFoundersKeys />}
          {selectedTab == "openEntry" && <StakingOpenEntry />}
        </div>
      </div>
    </>
  );
};

export default StakingDashboardMain;

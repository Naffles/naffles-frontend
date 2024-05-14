"use client";

import { useState } from "react";
import LeaderboardNafflersTable from "../Tables/LeaderboardsNafflersTable";
import LeaderboardRafflersTable from "../Tables/LeaderboardsRafflersTable";
import LeaderboardGamersTable from "../Tables/LeaderboardsGamersTable";
import LeaderboardCommunityMain from "./LeaderboardsCommunityMain";

const LeaderboardsMain = () => {
  const [selectedTab, setSelectedTab] = useState<
    "nafflers" | "rafflers" | "gamers" | "communities"
  >("nafflers");

  return (
    <>
      <div className="flex flex-col items-center lg:w-[966px] w-[90%] pb-[27px]">
        <div className="flex flex-col items-center justify-start bg-[#383838] rounded-[16px] w-full p-[13px]">
          <div className="flex flex-row items-end justify-between mt-[20px] w-full">
            <div className="flex flex-row items-end justify-start gap-[4px] border-b-[1px] border-nafl-sponge-500 w-full">
              <button
                onClick={() => setSelectedTab("nafflers")}
                className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "nafflers" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
              >
                <p className="md:text-[23px] text-[12px] font-face-bebas">
                  TOP NAFFLERS
                </p>
              </button>
              <button
                onClick={() => setSelectedTab("rafflers")}
                className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "rafflers" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
              >
                <p className="md:text-[23px] text-[12px] font-face-bebas">
                  TOP RAFFLERS
                </p>
              </button>
              <button
                onClick={() => setSelectedTab("gamers")}
                className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "gamers" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
              >
                <p className="md:text-[23px] text-[12px] font-face-bebas">
                  TOP GAMERS
                </p>
              </button>
              {/* <button
                onClick={() => setSelectedTab("communities")}
                className={`flex items-center justify-center rounded-t-[8.6px] lg:px-[40px] px-[20px] md:h-[38px] h-[54px] duration-500 ${selectedTab == "communities" ? "bg-[#FEFF3D] text-[#000]" : "bg-[#2F2F2F] text-[#D9D9D9]"}`}
              >
                <p className="md:text-[23px] text-[12px] font-face-bebas">
                  COMMUNITIES
                </p>
              </button> */}
            </div>
          </div>

          {selectedTab == "nafflers" && <LeaderboardNafflersTable />}
          {selectedTab == "rafflers" && <LeaderboardRafflersTable />}
          {selectedTab == "gamers" && <LeaderboardGamersTable />}
          {selectedTab == "communities" && <LeaderboardCommunityMain />}
        </div>
      </div>
    </>
  );
};

export default LeaderboardsMain;

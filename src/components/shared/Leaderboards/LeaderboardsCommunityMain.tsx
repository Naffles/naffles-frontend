"use client";

import { useEffect, useState } from "react";
import LeaderboardsCommunityPartnersTable from "../Tables/LeaderboardsCommunityPartnersTable";
import LeaderboardsCommunityTokensTable from "../Tables/LeaderboardsCommunityTokensTable";
import LeaderboardsCommunityNFTTable from "../Tables/LeaderboardsCommunityNFTTable";

interface tableRow {
  id: number;
  partner: string;
  players: number;
  tickets: number;
  winnings: number;
  points: number;
}

const LeaderboardCommunityMain = () => {
  const [communityTab, setCommunityTab] = useState<
    "tokens" | "nft" | "partners"
  >("tokens");

  return (
    <div className="flex flex-col w-full lg:px-[20px] px-[10px] bg-[#383838] mb-[50px] lg:gap-[30px] gap-[30px] mt-[30px] min-h-[800px]">
      <div className="flex items-center justify-center h-[300px]">
        <p className="font-mono text-[32px] text-white">Coming Soon</p>
      </div>
      {/* <div className="flex flex-row items-center justify-start h-[24px] w-full">
        <button
          onClick={() => setCommunityTab("tokens")}
          className="h-full lg:px-[30px] px-[10px]"
        >
          <p
            className={`font-face-bebas duration-300 ${communityTab == "tokens" ? "text-[#DC2ABF]" : "text-[#fff]"}`}
          >
            TOKENS
          </p>
        </button>
        <div className="w-[2px] h-full bg-nafl-white"></div>
        <button
          onClick={() => setCommunityTab("nft")}
          className="h-full lg:px-[30px] px-[10px]"
        >
          <p
            className={`font-face-bebas duration-300 ${communityTab == "nft" ? "text-[#DC2ABF]" : "text-[#fff]"}`}
          >
            NFT COLLECTIONS
          </p>
        </button>
        <div className="w-[2px] h-full bg-nafl-white"></div>
        <button
          onClick={() => setCommunityTab("partners")}
          className="h-full lg:px-[30px] px-[10px]"
        >
          <p
            className={`font-face-bebas duration-300 ${communityTab == "partners" ? "text-[#DC2ABF]" : "text-[#fff]"}`}
          >
            PARTNERS
          </p>
        </button>
      </div>

      {communityTab == "tokens" && <LeaderboardsCommunityTokensTable />}
      {communityTab == "nft" && <LeaderboardsCommunityNFTTable />}
      {communityTab == "partners" && <LeaderboardsCommunityPartnersTable />} */}
    </div>
  );
};

export default LeaderboardCommunityMain;

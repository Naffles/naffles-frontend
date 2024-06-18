"use client";

import Footer from "@components/shared/Footer/Footer";
import StakingDashboardInfo from "@components/shared/Staking/StakingDashboardInfo";
import StakingDashboardMain from "@components/shared/Staking/StakingDashboardMain";

const Staking = () => {
  return (
    <div className="flex flex-col items-center w-full relative pt-[180px]">
      <div className="flex flex-row flex-wrap items-start justify-center mb-[150px] gap-[57px] w-full">
        <StakingDashboardInfo />
        <StakingDashboardMain />
      </div>
      <Footer />
    </div>
  );
};

export default Staking;

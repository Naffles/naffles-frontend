"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";

interface Props {
  show: boolean;
  setShow: Function;
  walletBalance: number;
  walletBalanceType: string;
  currentAPR: number;
}

const StakingModal = (props: Props) => {
  const [stakingCount, setStakingCount] = useState<number>(1);
  const [stakingPeriod, setStakingPeriod] = useState<string>("month");
  const [showStakingPeriodDropdown, setShowStakingPeriodDropdown] =
    useState<boolean>(false);
  const [stakeAmount, setstakeAmount] = useState<number>(0.0);

  let sample_staking_period_options = [
    { id: "qwe1", count: 1, period: "month" },
    { id: "qwe3", count: 3, period: "months" },
    { id: "qwe6", count: 6, period: "months" },
    { id: "qwe12", count: 12, period: "months" },
  ];

  const stake = () => {
    if (stakeAmount > 0) {
      toast.success("You have successfully staked");
      props.setShow(false);
    } else {
      toast.error("Staking failed make sure to set staking amount");
    }
  };

  return (
    <div
      className={`fixed inset-0 ${props.show ? "opacity-100 z-[60]" : "opacity-0 z-[-1]"} duration-300 flex flex-col items-center justify-center`}
    >
      <div
        className="absolute inset-0 z-10 bg-[#464646CC] w-full h-screen"
        onClick={() => props.setShow(!props.show)}
      />
      <div className="flex flex-col md:w-[576px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
        <div className="flex items-center justify-center w-full h-[61px] bg-[#222222] relative rounded-t-[20px]">
          <p className="font-face-bebas text-nafl-white text-[31px]">
            STAKE TOKENS
          </p>
          <RiCloseLine
            onClick={() => props.setShow(!props.show)}
            className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
          />
        </div>
        <div className="flex flex-col w-full md:px-[54px] px-[24px] py-[35px] gap-[35.5px] rounded-b-[20px]">
          <div className="flex flex-col w-full gap-[10px]">
            <p className="text-nafl-white text-[21px] font-bold">
              Select staking period
            </p>
            <div className="w-full relative h-[55px]">
              <button
                onClick={() =>
                  setShowStakingPeriodDropdown(!showStakingPeriodDropdown)
                }
                className="flex items-center w-full h-full rounded-[11px] border-[1px] border-nafl-sponge-500 px-[23px] bg-[#4B4B4B]"
              >
                <p>
                  {stakingCount} {stakingPeriod}
                </p>
                <RiExpandUpDownLine className="absolute text-[20px] right-[20px] text-nafl-sponge-500" />
              </button>
              {showStakingPeriodDropdown && (
                <div className="flex absolute top-[60px] w-full h-[160px] z-40 p-[10px] rounded-[10px] bg-[#4B4B4B] overflow-hidden overflow-y-scroll balance-scrollbar">
                  <div className="flex flex-col w-full gap-[6px]">
                    {sample_staking_period_options.map((item) => (
                      <button
                        onClick={() => {
                          setStakingCount(item.count);
                          setStakingPeriod(item.period);
                          setShowStakingPeriodDropdown(false);
                        }}
                        key={item.id}
                        className={`flex items-center gap-[10px] w-full py-[10px] hover:bg-[#fff]/30 duration-500 rounded-[10px] px-[10px] ${
                          stakingCount == item.count && "bg-[#fff]/30"
                        }`}
                      >
                        <p className="text-[#fff] text-[16px]">
                          {item.count} {item.period}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-[10px]">
            <p className="text-nafl-white text-[21px] font-bold leading-[100%]">
              <span className="text-[#686868] font-normal">
                Wallet Balance:{" "}
              </span>{" "}
              {props.walletBalance.toLocaleString()} {props.walletBalanceType}
            </p>
            <div className=" flex flex-row items-center justify-between w-full relative h-[67px] bg-[#4B4B4B] rounded-[10px] overflow-hidden">
              <input
                value={stakeAmount}
                onChange={(e) =>
                  parseFloat(e.target.value) > 0 &&
                  setstakeAmount(parseFloat(e.target.value))
                }
                type="number"
                step={0.01}
                className="w-full h-full px-[30px] font-face-roboto bg-[#4B4B4B] border-0"
              />
              <button
                onClick={() => stake()}
                className="bg-nafl-sponge-500 rounded-[8px] px-[50px] h-[55px] mx-[6px]"
              >
                <p className="text-[#000] text-[18px] font-bold">STAKE</p>
              </button>
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <p className="text-nafl-white text-[21px] leading-[100%]">
              <span className="text-[#686868] font-normal mr-[14px]">
                Current APR{" "}
              </span>{" "}
              {props.currentAPR.toFixed(1).toLocaleString()}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingModal;

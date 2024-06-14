"use client";

import { useEffect, useState } from "react";
import ProfileTransactionHistory from "../Tables/ProfileTransactionHistoryTable";
import { RiExpandUpDownLine } from "react-icons/ri";
import CustomDropdownComponent from "../Dropdown/CustomDropdownComponent";
import CustomCheckboxComponent from "../Checkbox/CustomCheckboxComponent";

const TransactionHistory = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isWonChecked, setIsWonChecked] = useState<boolean>(false);
  const [isLostChecked, setIsLostChecked] = useState<boolean>(false);
  const [isLiveChecked, setIsLiveChecked] = useState<boolean>(false);
  const [isDrawnChecked, setIsDrawnChecked] = useState<boolean>(false);
  const [isSwappedChecked, setIsSwappedChecked] = useState<boolean>(false);

  const [eventSelected, setEventSelected] = useState<string>("ALL EVENTS");
  const [eventsDropdown, setEventsDropdown] = useState<boolean>(false);
  const events_option = ["ALL EVENTS", "EVENT ONE", "EVENT TWO", "EVENT THREE"];

  return (
    <>
      <div className="flex flex-col w-[1000px]">
        <div className="flex flex-col items-center justify-center w-full mt-[50px]">
          <p className="px-[20px] w-full text-[60px] text-[#fff] font-face-bebas">
            ACTIONS
          </p>
          <p className="font-mono text-[32px] text-[#fff]">Coming Soon</p>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-between gap-[20px] px-[20px] mt-[80px]">
          <p className="text-[60px] text-[#fff] font-face-bebas">HISTORY</p>
          <CustomDropdownComponent
            label={null}
            options={events_option}
            selected={eventSelected}
            setSelected={setEventSelected}
            openState={eventsDropdown}
            openStateFunction={setEventsDropdown}
            dropDownHeight={180}
            dropDownWidth={154}
          />
          <CustomCheckboxComponent
            label="WON"
            checked={isWonChecked}
            checkSetter={setIsWonChecked}
          />
          <CustomCheckboxComponent
            label="LOST"
            checked={isLostChecked}
            checkSetter={setIsLostChecked}
          />
          <CustomCheckboxComponent
            label="LIVE"
            checked={isLiveChecked}
            checkSetter={setIsLiveChecked}
          />
          <CustomCheckboxComponent
            label="DRAWN"
            checked={isDrawnChecked}
            checkSetter={setIsDrawnChecked}
          />
          <CustomCheckboxComponent
            label="SWAPPED"
            checked={isSwappedChecked}
            checkSetter={setIsSwappedChecked}
          />
        </div>
        <ProfileTransactionHistory />
      </div>
    </>
  );
};

export default TransactionHistory;

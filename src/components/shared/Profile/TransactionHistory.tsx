"use client";

import { useState } from "react";
import ProfileTransactionHistory from "../Tables/ProfileTransactionHistoryTable";
import { RiExpandUpDownLine } from "react-icons/ri";
import CustomDropdownComponent from "../Dropdown/CustomDropdownComponent";

const TransactionHistory = () => {
  const [tableData, setTableData] = useState<any[]>([]);

  const [eventSelected, setEventSelected] = useState<string>("ALL EVENTS");
  const [eventsDropdown, setEventsDropdown] = useState<boolean>(false);
  const events_option = ["ALL EVENTS", "EVENT ONE", "EVENT TWO", "EVENT THREE"];

  return (
    <>
      <div className="flex flex-col w-[1000px]">
        <div className="flex flex-row items-center justify-center gap-[20px]">
          <p className="text-[60px] text-white font-face-bebas">HISTORY</p>
          <CustomDropdownComponent
            label={null}
            options={events_option}
            selected={eventSelected}
            setSelected={setEventSelected}
            openState={eventsDropdown}
            openStateFunction={setEventsDropdown}
            dropDownHeight={180}
          />
        </div>
        <ProfileTransactionHistory />
      </div>
    </>
  );
};

export default TransactionHistory;

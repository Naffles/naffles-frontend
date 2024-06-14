"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
  isWalletConnected: boolean;
};

interface Props {
  show: boolean;
  setShow: Function;
}

const EmailModal = (props: Props) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (email) {
      try {
        setIsLoading(true);
        const {
          data: { success, errors },
        } = await axios.post(
          `https://assets.mailerlite.com/jsonp/${process.env.NEXT_PUBLIC_MAILERLITE_ACC_ID}/forms/${process.env.NEXT_PUBLIC_MAILERLITE_FORM_ID}/subscribe`,
          { fields: { email } }
        );
        if (success) {
          toast.success("You have successfully subscribed to our newsletter!");
          setTimeout(() => {
            props.setShow(false);
            setEmail("");
          }, 2000);
        } else {
          errors?.fields?.email &&
            toast.error(errors?.fields?.email?.join(" "));
        }

        setIsLoading(false);
      } catch (err) {
        toast.error("An error occurred. Please try again later.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const clickedElement = event.target as HTMLElement;
  //     const clickedElementClass = clickedElement.className;

  //     if (
  //       !clickedElementClass ||
  //       typeof clickedElementClass != "string" ||
  //       clickedElementClass.indexOf("balance-type-dropdown") < 0
  //     ) {
  //       setShowBalanceDropdown(false);
  //     }
  //   };

  //   // Add event listener on document for clicks outside the dropdown
  //   document.addEventListener("click", handleClickOutside);

  //   // Cleanup function to remove event listener on unmount
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] backdrop-blur-md w-full h-screen"
            onClick={() => props.setShow(false)}
          />
          <div className="flex items-center flex-col md:w-[480px] max-w-[480px] w-[95%] bg-[#292929] z-30 rounded-[16px] h-[300px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                YOU FOUND ME!
              </p>
              <RiCloseLine
                onClick={() => props.setShow(!props.show)}
                className="text-nafl-white text-[30px] absolute right-[20px] cursor-pointer"
              />
            </div>
            <div className="w-full flex gap-4 items-center justify-center relative mt-[130px]">
              <div className="absolute w-[201px] top-[-120px] left-[95px]">
                <img src="/static/cloud-text.png" alt="" />
              </div>
              <div className="absolute w-[158px] top-[-100px] left-[-20px]">
                <img src="/nafflings/shocked.png" alt="" />
              </div>
              <div className="absolute w-[96px] top-[-100px] right-[40px]">
                <img src="/static/chest.png" alt="" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Type in your email for instructions"
                className="font-sans max-w-[286px] h-[50px] w-full px-[13px] border-[1px] border-nafl-yellow-500 bg-[#4B4B4B] rounded-[10px] z-10"
              />
              <button
                type="submit"
                className="flex items-center justify-center h-[54px] rounded-[8px] min-w-[105px] bg-nafl-yellow-500 py-[15px] px-5 z-10"
                onClick={handleFormSubmit}
              >
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="text-[#292929] font-bold text-[18px]">GO</p>
                )}
              </button>
            </div>
            <p className=" text-nafl-white mt-[20px]">
              Fonefaunefu benafaune nefonafefe!
            </p>
          </div>
        </div>
      </>
    )
  );
};

export default EmailModal;

"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { FaBitcoin, FaEthereum, FaRegCheckCircle } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";

interface Props {
  show: boolean;
  setShow: Function;
  verificationToken: string;
  finished: Function;
}

const VerifyModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] =
    useState<boolean>(false);

  useEffect(() => {
    verifyEmail(props.verificationToken);
  }, [props.verificationToken]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}user/verify-token/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          body: JSON.stringify({ token: verificationToken }),
        }
      );

      const result = await response.json();

      // console.log("RESULT :", result);

      if (result.statusCode == 200 && response.ok) {
        setVerificationSuccess(true);
        toast.dismiss();
        toast.success("Email verified successfully");
      } else {
        setVerificationSuccess(false);
        console.error("Failed to verify email: ", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    setTimeout(() => {
      props.setShow(false);
      props.finished(true);
    }, 2000);
  };

  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in bg-[#464646CC]">
          <div className="flex flex-col items-center md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                EMAIL VERIFICATION
              </p>
            </div>
            {isLoading ? (
              <>
                <AiOutlineLoading className="text-[150px] text-nafl-sponge-500 pt-[20px] animate-spin" />
                <p className="text-[20px] text-center text-nafl-white font-face-bebas mt-[20px] pb-[50px]">
                  Verifying Email Update...
                </p>
              </>
            ) : verificationSuccess ? (
              <>
                <FaRegCheckCircle className="text-[150px] text-[#4BB543] pt-[20px]" />
                <p className="text-[20px] text-center text-nafl-white font-face-bebas mt-[20px] pb-[50px]">
                  Email Update Successful!
                </p>
              </>
            ) : (
              <>
                <IoIosCloseCircleOutline className="text-[150px] text-[#ED4337] pt-[20px]" />
                <p className="text-[20px] text-center text-nafl-white font-face-bebas mt-[20px] pb-[50px]">
                  Email Update Failed! Please try again.
                </p>
              </>
            )}
          </div>
        </div>
      </>
    )
  );
};

export default VerifyModal;

"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { RiCloseLine, RiExpandUpDownLine } from "react-icons/ri";
import { TbCurrencySolana } from "react-icons/tb";

interface Props {
  show: boolean;
  setShow: Function;
  verificationToken: string
}

const VerifyModal = (props: Props) => {
const [isLoading, setIsLoading] = useState<boolean>(false)
const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false)

  useEffect(() => {
    verifyEmail(props.verificationToken)
  }, [props.verificationToken]);

  const verifyEmail = async(verificationToken : string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({token : verificationToken
        }),
      });
  
      const result = await response.json();
  
      console.log("RESULT :", result);
  
      if (response.ok) {
        result.data && setVerificationSuccess(true)
        toast.success("Email verified successfully");
        setTimeout(() => {
          props.setShow(false)
        }, 1000);
      } else {
        console.error("Failed to create game: ", result.message);
        toast.error(result.message);
      }
     } catch (error) {
      console.error(error)
     }

     setIsLoading(false)
  }


  return (
    props.show && (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 z-10 bg-[#464646CC] w-full h-screen"
            onClick={() => props.setShow(false)}
          />
          <div className="flex flex-col md:w-[374px] max-w-[374px] w-[95%] bg-[#292929] z-30 rounded-[35px]">
            <div className="flex items-center justify-center w-full h-[64px] bg-[#222222] relative rounded-t-[20px]">
              <p className="font-face-bebas text-nafl-white text-[31px]">
                EMAIL VERIFICATION
              </p>
            </div>
            
          </div>
        </div>
      </>
    )
  );
};

export default VerifyModal;

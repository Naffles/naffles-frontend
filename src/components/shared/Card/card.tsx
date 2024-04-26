"use client";
import Image from "next/image";
import Button from "../Button/button";
import Typography from "../Typography/typography";
import { useRouter } from "next/navigation";

type CardProps = {
  title: string;
  description: string;
  price: string;
  buttonText: string;
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  price,
  buttonText,
}) => {
  const router = useRouter();
  const handleClick = () => {
    // router.push(`/${title}`); redirect to its nft profile page
    console.log("to redirect in nft page");
  };

  return (
    <>
      <button
        className="bg-nafl-grey-900 border-nafl-grey-900 border-[6px] z-10 overflow-hidden rounded-[21px] w-[210px] user-select-none h-[312px] "
        onClick={handleClick}
      >
        <div className="flex flex-col relative rounded-[6px] h-full w-full overflow-hidden">
          <div className="absolute bg-nafl-grey-900 z-10 overflow-hidden rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" />
          <img
            src="/static/sample-nft-image-1.png"
            alt="Sample NFT Card Image"
            className="w-full h-[70%] object-cover rounded-t-[14px]"
          />
          <div className="flex flex-col px-[15px] items-center justify-start bg-nafl-white gap-[7px] absolute bottom-0 w-full py-[12px]">
            <div className="flex items-center justify-between border-[#000]/20 border-b-[1px] w-full ">
              <div className="flex-col items-start justify-center ">
                <p className="text-[13px] text-nafl-charcoal-500 font-face-bebas leading-[110%]">
                  {title}
                </p>
                <p className="text-[13px] text-nafl-charcoal-500 font-face-bebas leading-[100%]">
                  {description}
                </p>
              </div>
              <p className="text-[#02B1B1] text-[40px] font-face-bebas leading-[100%]">
                #9419
              </p>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col items-start w-[80px] border-r-[1px] border-[#000]/20 gap-[3px]">
                <p className="text-[10px] font-face-bebas text-[#464646] leading-[100%]">
                  TICKETS LEFT
                </p>
                <p className="text-[21px] font-bold font-face-bebas text-[#464646] leading-[100%]">
                  69
                </p>
                <p className="text-[10px] font-face-bebas text-[#464646] leading-[100%]">
                  OF 23,000
                </p>
              </div>
              <div className="flex flex-col items-start w-[100px] px-[15px] py-[5px] gap-[2px]">
                <p className="text-[10px] font-face-bebas text-[#464646] leading-[100%]">
                  TICKETS PRICE
                </p>
                <div className="flex flex-row items-center justify-center w-full gap-[6px]">
                  <img
                    src="/static/eth-logo.png"
                    alt="ETH Logo"
                    className="w-[16px] object-contain"
                  />
                  <p className="text-[21px] font-bold font-face-bebas text-[#464646] leading-[100%]">
                    0.005
                  </p>
                </div>

                <p className="flex items-center justify-center w-full text-[11px] font-face-bebas text-[#02B1B1] leading-[100%]">
                  ($ 16 USD)
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};
export default Card;

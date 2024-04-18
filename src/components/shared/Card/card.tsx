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

const Card: React.FC<CardProps> = ({ title, description, price, buttonText }) => {
  const router = useRouter();
  const handleClick = () => {
    // router.push(`/${title}`); redirect to its nft profile page
    console.log("to redirect in nft page");
  };

  return (
      <>
        <button 
          className="bg-nafl-grey-900 z-10 mx-auto overflow-hidden p-2.5 rounded-2xl min-w-[210px] user-select-none h-[312px]"
          onClick={handleClick}
        >
          <div className="relative bg-nafl-white rounded-xl mx-auto px-0 py-0 pb-7 h-[292px]">
          <div className="absolute bg-nafl-grey-900 z-10 overflow-hidden rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" />
            <Image src="/static/ape-dummy.png" alt={title} width={210} height={172} sizes="210px"/>
            <div className="flex justify-between relative top-[-70px] bg-nafl-white">
              <div className="h-12 flex-row ml-2 mt-3">
                <h3 className="text-lg font-semibold text-nafl-charcoal-500">{title}</h3>
                <h4 className="text-lg text-nafl-charcoal-500">{description}</h4>
              </div>
              <div className="flex mt-2">
                <Typography size="text-5xl pr-2" color="accent-green">#9419</Typography>
              </div>
            </div>
            <hr className="nafl-grey-100 relative top-[-75px]"/>
            <div className="flex justify-between relative top-[-72px] pb-2">
              <div className="h-12 flex-row ml-2 mt-1">
                <h4 className="text-sm font-semibold text-nafl-charcoal-500">tickets left</h4>
                <h2 className="text-xl font-semibold text-nafl-charcoal-500">69</h2>
                <h4 className="text-xs font-semibold text-nafl-charcoal-500">of 23,000</h4>
              </div>
              <div className="flex-row mt-1 mr-2">
                <h4 className="text-sm font-semibold text-nafl-charcoal-500 text-right">ticket price</h4>
                <div className="flex">
                  <Image src="/static/eth-logo.png" alt="nafl-coin" width={20} height={20} sizes="20px" style={{objectFit: 'contain'}}/>
                  <h2 className="text-xl font-semibold text-nafl-charcoal-500 text-right">0.01</h2>
                </div>
                <Typography className="text-xs font-semibold text-right" color="accent-green">($16 USD)</Typography>
              </div>
            </div>
          </div>
        </button>
      </>
    );
  };
export default Card;

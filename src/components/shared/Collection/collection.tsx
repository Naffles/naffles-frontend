import Image from "next/image";
import Button from "../Button/button";
import Typography from "../Typography/typography";

type CollectionProps = {
  title: string;
  description: string;
  price: string;
  buttonText: string;
  notchColor?: string;
};

const CollectionItem: React.FC<CollectionProps> = ({
  title,
  description,
  price,
  buttonText,
  notchColor,
}) => {
  return (
    <div className="bg-nafl-grey-900 z-10 mx-auto overflow-hidden rounded-xl h-[372px] w-[305px] user-select-none">
      <div className="flex flex-col items-center justify-start relative bg-nafl-grey-900 rounded-xl mx-auto px-0 py-0 pb-12">
        <div
          className={`absolute ${notchColor ? notchColor : "bg-nafl-grey-900"} rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]`}
        />
        {/* <Image src="/static/ape-dummy.png" alt={title} width={310} height={209} className="rounded-none"/> */}
        <img
          src="/static/collection-sample-img.png"
          alt={title}
          className="w-full h-[70%] object-cover overflow-hidden"
        />
        <div className="flex justify-start flex-col items-center px-5 relative bg-nafl-grey-900 bottom-0 pt-3 w-full gap-[7px]">
          <div className="flex flex-col w-full items-center py-[16px] border-b-[1px] border-[#fff]/20">
            <p className="text-[30px] text-[#fff] font-face-bebas leading-[100%]">
              CRYPTOPUNKS
            </p>
          </div>
          <div className="flex flex-row justify-around pb-5 w-full">
            <div className="flex flex-col items-start w-[50%] px-[15px] py-[5px] gap-[2px] border-r-[1px] border-[#fff]/20">
              <p className="text-[10px] font-face-bebas text-[#fff] leading-[100%] ml-[15px]">
                FLOOR PRICE
              </p>
              <div className="flex flex-row items-center justify-center w-full gap-[6px]">
                <img
                  src="/static/eth-logo.png"
                  alt="ETH Logo"
                  className="w-[16px] object-contain"
                />
                <p className="text-[21px] font-bold font-face-bebas text-[#fff] leading-[100%]">
                  0.005
                </p>
              </div>

              <p className="flex items-center justify-center w-full text-[11px] font-face-bebas text-[#02B1B1] leading-[100%]">
                ($ 16 USD)
              </p>
            </div>
            <div className="flex flex-col items-start w-[50%] px-[15px] py-[5px] gap-[2px]">
              <p className="text-[10px] font-face-bebas text-[#fff] leading-[100%] ml-[15px]">
                ON SALE
              </p>
              <div className="flex flex-row items-center justify-center w-full gap-[6px]">
                <p className="text-[21px] font-bold font-face-bebas text-[#fff] leading-[100%]">
                  0.005
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollectionItem;

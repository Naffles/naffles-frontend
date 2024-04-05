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
  notchColor
}) => {
  return (
    <div className="bg-nafl-grey-900 z-10 mx-auto overflow-hidden rounded-xl h-[372px] w-[305px] user-select-none">
      <div className="relative bg-nafl-grey-900 rounded-xl mx-auto px-0 py-0 pb-12">
      <div className={`absolute ${ notchColor ? notchColor : 'bg-nafl-grey-900'} rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]`} />
        {/* <Image src="/static/ape-dummy.png" alt={title} width={310} height={209} className="rounded-none"/> */}
        <img src="/static/ape-dummy.png" alt={title} className="h-[305px] w-[305px] object-contain overflow-hidden"/>
        <div className="flex justify-between flex-col px-5 relative bg-nafl-grey-900 top-[-90px] pt-3">
          <Typography size="text-3xl" color="white" className="pb-2">CRYPTOPUNKS</Typography>
          <span className="bg-nafl-charcoal-300 h-[.5px] w-[285px] opacity-55 left-[-10px] relative"/>
          <div className="flex flex-row justify-around pb-5">
            <div className="h-12 flex-col ml-2 mt-2">
              <h4 className="text-sm font-semibold text-nafl-white">floor price</h4>
              <div className="flex flex-row">
                <Image src="/static/eth-light-logo.png" alt="nafl-coin" width={14} height={14} sizes="14px" style={{objectFit: 'contain'}}/>
                <h2 className="text-lg font-semibold text-nafl-white text-right pl-1">0.01</h2>
              </div>
              <Typography className="text-sm font-semibold pl-3" color="accent-green">($16 USD)</Typography>
            </div>
            <div className="border-l bg-nafl-white h-full w-[50px] border-spacing-0"></div>
            <div className="h-12 flex-col ml-2 mt-2">
              <h4 className="text-sm font-semibold text-nafl-white">floor price</h4>
              <div className="flex flex-row">
                <Image src="/static/eth-light-logo.png" alt="nafl-coin" width={14} height={14} sizes="14px" style={{objectFit: 'contain'}}/>
                <h2 className="text-lg font-semibold text-nafl-white text-right pl-1">0.01</h2>
              </div>
              <Typography className="text-sm font-semibold pl-3" color="accent-green">($16 USD)</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };
export default CollectionItem;

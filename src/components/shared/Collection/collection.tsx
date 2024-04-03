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
    <div className="bg-nafl-grey-900 z-10 mx-auto overflow-hidden rounded-xl h-auto w-56 user-select-none">
      <div className="relative bg-nafl-grey-900 rounded-xl mx-auto px-0 py-0 pb-7">
      <div className={`absolute ${ notchColor ? notchColor : 'bg-nafl-grey-900'} rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]`} />
        <Image src="/static/ape-dummy.png" alt={title} width={310} height={310} sizes="310px" className="rounded-none"/>
        <div className="flex ">
          <Typography size="text-3xl" color="accent-green">CRYPTOPUNKS</Typography>
          {/* <div className="h-16 flex-row ml-2 mt-5">
            <h3 className="text-lg font-semibold text-nafl-charcoal-500">{title}</h3>
            <h4 className="text-lg text-nafl-charcoal-500">{description}</h4>
          </div>
          <div className="flex mt-2">
            <Typography size="text-5xl pr-2" color="accent-green">#9419</Typography>
          </div> */}
        </div>
        <hr className="nafl-grey-100"/>
        <div className="flex justify-between">
          <div className="h-12 flex-row ml-2 mt-2">
            <h4 className="text-lg font-semibold text-nafl-charcoal-500">tickets left</h4>
            <h2 className="text-3xl font-semibold text-nafl-charcoal-500">69</h2>
            <h4 className="text-lg font-semibold text-nafl-charcoal-500">of 23,000</h4>
          </div>
          <div className="flex-row mt-2 mr-2">
            <h4 className="text-lg font-semibold text-nafl-charcoal-500 text-right">ticket price</h4>
            <div className="flex">
              <Image src="/static/eth-logo.png" alt="nafl-coin" width={20} height={20} sizes="20px" style={{objectFit: 'contain'}}/>
              <h2 className="text-3xl font-semibold text-nafl-charcoal-500 text-right">0.01</h2>
            </div>
            <Typography className="text-sm font-semibold text-right" color="accent-green">($16 USD)</Typography>
          </div>
        </div>
      </div>
    </div>
    );
  };
export default CollectionItem;

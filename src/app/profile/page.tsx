"use client";

import Footer from "@components/shared/Footer/Footer";
import { Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import NaffleDetails from "@components/naffleDetails/naffleDetails";
import { useParams } from "next/navigation";

const GameZone = () => {
  const {"naffle-details" : data} = useParams();
  
  return (
    <Fragment>
      <div className="flex flex-col items-center w-full mt-[85px] h-auto px-[125px]">
        <div className="flex w-full h-[100vh]">
          <div className="w-1/3 h-full bg-nafl-charcoal-700">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src="/static/nft-dummy.png" alt="NFT" className="w-[372px]" />
              <div className="flex flex-col items-center justify-center w-1/2 h-1/2">
                <div className="flex flex-col items-center justify-center w-full h-1/2">
                  <h2 className="text-2xl text-nafl-sponge-500">Name: </h2>
                  <h2 className="text-2xl text-nafl-sponge-500">Wallet Address: </h2>
                  <h2 className="text-2xl text-nafl-sponge-500">Email: </h2>
                  <h2 className="text-2xl text-nafl-sponge-500">Phone Number: </h2>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-1/2">
                  <h2 className="text-2xl text-nafl-sponge-500">John Doe</h2>
                  <h2 className="text-2xl text-nafl-sponge-500">0x1234567890</h2>
                  <h2 className="text-2xl text-nafl-sponge-500">
                </h2>
                  <h2 className="text-2xl text-nafl-sponge-500">+234 123 456 7890</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full bg-nafl-charcoal-500">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-5xl text-nafl-sponge-500">NFT Details</h1>
              <div className="flex flex-col items-center justify-center w-1/2 h-1/2">
                <h2 className="text-2xl text-nafl-sponge-500">Name: </h2>
                <h2 className="text-2xl text-nafl-sponge-500">Description: </h2>
                <h2 className="text-2xl text-nafl-sponge-500">Price: </h2>
                <h2 className="text-2xl text-nafl-sponge-500">Button Text: </h2>
              </div>
              <div className="flex flex-col items-center justify-center w-1/2 h-1/2">
                <h2 className="text-2xl text-nafl-sponge-500">NFT Name</h2>
                <h2 className="text-2xl text-nafl-sponge-500">NFT Description</h2>
                <h2 className="text-2xl text-nafl-sponge-500">NFT Price</h2>
                <h2 className="text-2xl text-nafl-sponge-500">Button Text</h2>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </Fragment>
  );
};

export default GameZone;

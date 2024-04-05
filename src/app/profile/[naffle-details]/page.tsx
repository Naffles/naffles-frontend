"use client";

import Footer from "@components/shared/Footer/Footer";
import { Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import NaffleDetails from "@components/naffleDetails/naffleDetails";
import { useParams } from "next/navigation";
import { Button } from "@components/shared/Button";
import PenEditIcon from "@components/icons/penEdit";
import ArrowRightIcon from "@components/icons/arrowRightIcon";

const GameZone = () => {
  const {"naffle-details" : data} = useParams();
  
  return (
    <Fragment>
      <div className="flex flex-col items-center w-full mt-[85px] h-auto px-[125px]">
        <div className="flex w-full h-[100vh]">
          <div className="w-1/3 h-full bg-nafl-charcoal-500 mt-[100px]">
            <div className="flex flex-col items-center w-full h-full">
              <h1 className="text-5xl text-nafl-white">MY Profile</h1>
              <img src="/static/nft-dummy.png" alt="NFT" className="w-[250px] rounded-full mt-4" />
              <div className="flex flex-col items-center justify-center w-1/2">
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-xl text-nafl-white font-sans">JXSmith123</span>
                  <span className="text-md text-nafl-charcoal-200 font-sans font-normal">jsmith@gmail.com</span>
                  <button className="bg-nafl-sponge-500 rounded-md w-40 mt-[25px]">
                    <div className="flex flex-row mx-5 my-2 rounded-md text-center">
                    <span className="text-sm text-nafl-grey-800 font-sans font-bold">EDIT PROFILE</span>
                      <PenEditIcon size="xs" colour="black" className="mt-[2px] ml-3"/>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full mt-3">
                  <span className="text-md text-nafl-white">Balance: 0.31 ETH</span>
                </div>
                <div className="flex flex-col items-center mt-5 w-full">
                  <button
                    className={`w-full flex 
                    flex-row justify-between py-2 px-2 border-y-yellow-500
                    border-`}>
                    <h1 className="text-nafl-white">
                      BUYER (S)
                    </h1>
                    <ArrowRightIcon
                      size="xs" 
                      colour="black"
                      className="mt-[2px] ml-3 text-nafl-charcoal-800"
                    />
                  </button>
                </div>
                <div className="flex flex-col items-center w-full">
                  <button
                    className={`w-full flex 
                    flex-row justify-between py-2 px-2 border-y-yellow-500
                    border-`}>
                    <h1 className="text-nafl-white">
                      SELLER (S)
                    </h1>
                    <ArrowRightIcon
                      size="xs" 
                      colour="black"
                      className="mt-[2px] ml-3 text-nafl-charcoal-800"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full bg-nafl-charcoal-500  mt-[100px]">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-nafl-sponge-500 dark:border-gray-700 dark:text-gray-400">
              <li className="me-2">
                <a href="#" aria-current="page" className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500">Profile</a>
              </li>
              <li className="me-2">
                <a href="#" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">Dashboard</a>
              </li>
              <li className="me-2">
                <a href="#" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">Settings</a>
              </li>
              <li className="me-2">
                <a href="#" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">Contacts</a>
              </li>
              <li>
                <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
              </li>
            </ul>
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

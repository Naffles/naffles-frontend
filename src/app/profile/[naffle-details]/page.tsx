"use client";

import Footer from "@components/shared/Footer/Footer";
import { ChangeEvent, Fragment, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal } from "@components/shared/Modal";

// import NaffleDetails from "@components/naffleDetails/naffleDetails";
import { useParams } from "next/navigation";
import CardCarousel from "@components/shared/CardCarousel/CardCarousel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Card from "@components/shared/Card/card";
import { Table } from "flowbite-react";

const UserProfile = () => {
  const { "naffle-details": data } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [tabsState, setTabsState] = useState([
    { key: "live-naffles", state: true, title: "My Naffles" },
    { key: "tickets-history", state: false, title: "Transactions" },
    { key: "burn", state: false, title: "Burn" },
    { key: "affiliate-rewards", state: false, title: "Affiliate Rewards" },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleOnTabClick = (key: any) => {
    const updatedTabsState = tabsState.map((tab) => {
      if (tab.key === key) {
        return { ...tab, state: true };
      }
      return { ...tab, state: false };
    });
    setTabsState(updatedTabsState);
  };
  // hardcoded for temporary use
  const liveNaffles = tabsState[0];
  const ticketsHistory = tabsState[1];
  const burn = tabsState[2];
  const affiliateRewards = tabsState[3];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    console.log("Image uploaded:", imageFile);
  };

  return (
    <Fragment>
      {/* open a modal to edit profile */}
      <div className="flex flex-col items-center w-full mt-[85px] h-auto px-[125px] min-h-[800px]">
        <div className="flex w-full h-auto">
          <div className="w-full h-full bg-nafl-charcoal-500 mt-[60px]">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-nafl-sponge-500 dark:border-gray-700 dark:text-gray-400">
              {tabsState.map((tab, index) => {
                const activeString =
                  "inline-block text-nafl-charcoal-800 bg-nafl-sponge-500 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
                const inactiveString =
                  "inline-block rounded-t-lg bg-nafl-grey-700 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-nafl-charcoal-100";
                return (
                  <li
                    className="me-2"
                    key={index}
                    onClick={() => handleOnTabClick(tab.key)}
                  >
                    <a
                      href="#"
                      aria-current="page"
                      className={`
                        font-normal
                        text-[22px]
                        lead-8
                        px-[48px]
                        py-[10px]
                        ${tab.state ? activeString : inactiveString}`
                      }
                    >
                      {tab.title}
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* {liveNaffles.state && (
              <div className="flex flex-col w-full h-full">
                <h1 className="text-5xl text-nafl-white mt-5 mb-5">
                  LIVE NAFFLES
                </h1>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 mb-10 pb-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Card
                        title="Boared Ape"
                        description="Yacht Club"
                        price="$9.99"
                        buttonText="Buy Now"
                        // notchColor="bg-nafl-grey-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ticketsHistory.state && (
              <div className="flex flex-col w-full h-full">
                <h1 className="text-5xl text-nafl-white mt-5 mb-5">Actions</h1>
                <div className="overflow-x-auto h-auto">
                  <Table className="bg-nafle-charcoal-800">
                    <Table.Head className="bg-nafle-charcoal-800 text-nafl-charcoal-100 text-lg border-t-orange-50 border-b-1 border-t-1">
                      <Table.HeadCell>action required</Table.HeadCell>
                      <Table.HeadCell>Event id</Table.HeadCell>
                      <Table.HeadCell>collection</Table.HeadCell>
                      <Table.HeadCell>token id</Table.HeadCell>
                      <Table.HeadCell>ticket #</Table.HeadCell>
                      <Table.HeadCell>cost</Table.HeadCell>
                      <Table.HeadCell>draw trx id</Table.HeadCell>
                      <Table.HeadCell>status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y border-none">
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          {'Apple MacBook Pro 17"'}
                        </Table.Cell>
                        <Table.Cell>Sliver</Table.Cell>
                        <Table.Cell>Laptop</Table.Cell>
                        <Table.Cell>$2999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Microsoft Surface Pro
                        </Table.Cell>
                        <Table.Cell>White</Table.Cell>
                        <Table.Cell>Laptop PC</Table.Cell>
                        <Table.Cell>$1999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Magic Mouse 2
                        </Table.Cell>
                        <Table.Cell>Black</Table.Cell>
                        <Table.Cell>Accessories</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
                <h1 className="text-5xl text-nafl-sponge-100 mt-3">History</h1>
                <div className="overflow-x-auto h-auto">
                  <Table className="bg-nafle-charcoal-800">
                    <Table.Head className="bg-nafle-charcoal-800 text-nafl-charcoal-100 text-lg border-t-orange-50 border-b-1 border-t-1">
                      <Table.HeadCell>action required</Table.HeadCell>
                      <Table.HeadCell>Event id</Table.HeadCell>
                      <Table.HeadCell>collection</Table.HeadCell>
                      <Table.HeadCell>token id</Table.HeadCell>
                      <Table.HeadCell>ticket #</Table.HeadCell>
                      <Table.HeadCell>cost</Table.HeadCell>
                      <Table.HeadCell>draw trx id</Table.HeadCell>
                      <Table.HeadCell>status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y border-none">
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          {'Apple MacBook Pro 17"'}
                        </Table.Cell>
                        <Table.Cell>Sliver</Table.Cell>
                        <Table.Cell>Laptop</Table.Cell>
                        <Table.Cell>$2999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Microsoft Surface Pro
                        </Table.Cell>
                        <Table.Cell>White</Table.Cell>
                        <Table.Cell>Laptop PC</Table.Cell>
                        <Table.Cell>$1999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Magic Mouse 2
                        </Table.Cell>
                        <Table.Cell>Black</Table.Cell>
                        <Table.Cell>Accessories</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              </div>
            )}
            {burn.state && (
              <div className="flex flex-col w-full h-full">
                <h1 className="text-5xl text-nafl-white mt-5 mb-5">BURN</h1>

                <div className="overflow-x-auto h-auto">
                  <Table className="bg-nafle-charcoal-800">
                    <Table.Head className="bg-nafle-charcoal-800 text-nafl-charcoal-100 text-lg border-t-orange-50 border-b-1 border-t-1">
                      <Table.HeadCell>action required</Table.HeadCell>
                      <Table.HeadCell>Event id</Table.HeadCell>
                      <Table.HeadCell>collection</Table.HeadCell>
                      <Table.HeadCell>token id</Table.HeadCell>
                      <Table.HeadCell>ticket #</Table.HeadCell>
                      <Table.HeadCell>cost</Table.HeadCell>
                      <Table.HeadCell>draw trx id</Table.HeadCell>
                      <Table.HeadCell>status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y border-none">
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          {'Apple MacBook Pro 17"'}
                        </Table.Cell>
                        <Table.Cell>Sliver</Table.Cell>
                        <Table.Cell>Laptop</Table.Cell>
                        <Table.Cell>$2999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Microsoft Surface Pro
                        </Table.Cell>
                        <Table.Cell>White</Table.Cell>
                        <Table.Cell>Laptop PC</Table.Cell>
                        <Table.Cell>$1999</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                      <Table.Row className="bg-nafle-charcoal-600 dark:border-gray-700 dark:bg-gray-800 text-nafl-sponge-100 border-none">
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-nafl-white">
                          Magic Mouse 2
                        </Table.Cell>
                        <Table.Cell>Black</Table.Cell>
                        <Table.Cell>Accessories</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3145</Table.Cell>
                        <Table.Cell>$99</Table.Cell>
                        <Table.Cell>3x213</Table.Cell>
                        <Table.Cell>WINNER</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              </div>
            )}
            {affiliateRewards.state && (
              <div className="flex flex-col w-full h-full">
                <h1 className="text-5xl text-nafl-white mt-5">
                  AFFILIATE REWARDS
                </h1>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 mb-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Card
                        title="Boared Ape"
                        description="Yacht Club"
                        price="$9.99"
                        buttonText="Buy Now"
                        // notchColor="bg-nafl-grey-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            <div className="flex items-center justify-center h-[300px]">
              <p className="font-mono text-[32px] text-white">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default UserProfile;

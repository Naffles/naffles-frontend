"use client";

import Footer from "@components/shared/Footer/Footer";
import { ChangeEvent, Fragment, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal } from "@components/shared/Modal";

// import NaffleDetails from "@components/naffleDetails/naffleDetails";
import { useParams } from "next/navigation";
import { Button } from "@components/shared/Button";
import PenEditIcon from "@components/icons/penEdit";
import ArrowRightIcon from "@components/icons/arrowRightIcon";
import CardCarousel from "@components/shared/CardCarousel/CardCarousel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Card from "@components/shared/Card/card";
import DeleteIcon from "@components/icons/deleteIcon";
import { Table } from "flowbite-react";

const UserProfile = () => {
  const { "naffle-details": data } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [tabsState, setTabsState] = useState([
    { key: "live-naffles", state: true, title: "My Naffles" },
    { key: "tickets-history", state: false, title: "Tickets History" },
    { key: "burn", state: false, title: "Burn" },
    { key: "affiliate-rewards", state: false, title: "Affiliate Rewards" },
  ]);
  const [imageFile, setImageFile] = useState<File|null>(null);
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
      <Modal
        show={openModal}
        hideModal={() => setOpenModal(false)}
        title="Edit Profile"
      >
        <div className="flex flex-col items-start h-auto">
          <div className="flex flex-row">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className={`w-[180px] h-[180px] cursor-pointer opacity-0 absolute top-0 left-0 z-10 ${
                  imageFile && "bg-gray-200 rounded-full"
                }`}
                onChange={handleChange}
              />
              <div
                className={`w-[180px] h-[180px] bg-cover bg-center rounded-full overflow-hidden relative z-0 ${
                  !imageFile && "bg-gray-300"
                }`}
                style={{ backgroundImage: `url(/static/nft-dummy.png)` }}
                onClick={handleUpload}
              >
                {!imageFile && (
                  <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-30 rounded-full">
                    Click to upload
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col m-5">
              <label htmlFor="username" className="text-nafl-white tex-sm">
                <h5 className="text-nafl-sponge-500 text-sm">Username</h5>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="border border-black p-2 w-[300px]"
              />
              <label htmlFor="email" className="text-nafl-white tex-sm mt-5">
                <h5 className="text-nafl-sponge-500 text-sm">Email</h5>
              </label>
              <input
                type="text"
                name="email"
                placeholder="email"
                className="border border-black p-2 w-[300px]"
              />
            </div>
          </div>
          <div className="flex flex-col w-full mt-3 items-center">
            <label htmlFor="wallet" className="text-nafl-white tex-sm mt-5">
              <h5 className="text-nafl-sponge-500 text-sm">
                Connected Wallet(s)
              </h5>
            </label>
            <div className="flex flex-col items-center justify-between w-full">
              {/* not input, but a row displaying the wallet address plus delete icon button in the right of it */}
              <div className="flex flex-row items-center justify-between w-[300px] mt-1">
                <input
                  type="text"
                  name="wallet"
                  placeholder="0xb794f5ea0...ba74279579268"
                  className="border border-black p-2 w-[300px]"
                  disabled
                />
                <DeleteIcon
                  size="sm"
                  colour="yellow"
                  className="mt-[2px] ml-3 cursor-pointer"
                />
              </div>
              <div className="flex flex-row items-center justify-between w-[300px] mt-1">
                <input
                  type="text"
                  name="wallet"
                  placeholder="0xb794f5ea0...ba74279579268"
                  className="border border-black p-2 w-[300px]"
                  disabled
                />
                <DeleteIcon
                  size="sm"
                  colour="yellow"
                  className="mt-[2px] ml-3 cursor-pointer"
                />
              </div>
              <div className="flex flex-row items-center justify-between w-[300px] mt-1">
                <input
                  type="text"
                  name="wallet"
                  placeholder="0xb794f5ea0...ba74279579268"
                  className="border border-black p-2 w-[300px]"
                  disabled
                />
                <DeleteIcon
                  size="sm"
                  colour="yellow"
                  className="mt-[2px] ml-3 cursor-pointer"
                />
              </div>
              {/*               
              <input type="text" name="wallet" placeholder="0x1234567890" className="border border-black p-2 w-[300px] mt-1" />
              <input type="text" name="wallet" placeholder="0x1234567890" className="border border-black p-2 w-[300px] mt-1" />
              <input type="text" name="wallet" placeholder="0x1234567890" className="border border-black p-2 w-[300px] mt-1" />
              <input type="text" name="wallet" placeholder="0x1234567890" className="border border-black p-2 w-[300px] mt-1" /> */}
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <button className="mt-4 bg-nafl-sponge-500 px-5 py-1 rounded-md align-middle">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col items-center w-full mt-[85px] h-auto px-[125px]">
        <div className="flex w-full h-auto">
          <div className="w-1/3 h-full bg-nafl-charcoal-500 mt-[60px]">
            <div className="flex flex-col items-center w-full h-full">
              <h1 className="text-5xl text-nafl-white">MY Profile</h1>
              <img
                src="/static/nft-dummy.png"
                alt="NFT"
                className="w-[250px] rounded-full mt-4"
              />
              <div className="flex flex-col items-center justify-center w-1/2">
                <div className="flex flex-col items-center justify-center w-full mt-3">
                  <span className="text-xl text-nafl-white font-sans">
                    JXSmith123
                  </span>
                  <span className="text-md text-nafl-charcoal-200 font-sans font-normal">
                    jsmith@gmail.com
                  </span>
                  <button
                    className="bg-nafl-sponge-500 rounded-md w-40 mt-[25px]"
                    onClick={() => setOpenModal(true)}
                  >
                    <div className="flex flex-row mx-5 my-2 rounded-md text-center">
                      <span className="text-sm text-nafl-grey-800 font-sans font-bold">
                        EDIT PROFILE
                      </span>
                      <PenEditIcon
                        size="xs"
                        colour="black"
                        className="mt-[2px] ml-3"
                      />
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full mt-3">
                  <span className="text-md text-nafl-white">
                    Balance: 0.31 ETH
                  </span>
                </div>
                <div className="flex flex-col items-center mt-5 w-full">
                  <button
                    className={`w-full flex 
                    flex-row justify-between py-2 px-2 border-y-yellow-500
                    border-`}
                  >
                    <h1 className="text-nafl-white">BUYER (S)</h1>
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
                    border-`}
                  >
                    <h1 className="text-nafl-white">SELLER (S)</h1>
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
          <div className="w-2/3 h-full bg-nafl-charcoal-500 mt-[60px]">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-nafl-sponge-500 dark:border-gray-700 dark:text-gray-400">
              {tabsState.map((tab, index) => {
                const activeString =
                  "inline-block text-lg p-4 text-nafl-charcoal-800 bg-nafl-sponge-500 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
                const inactiveString =
                  "inline-block text-lg p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-nafl-charcoal-100";
                return (
                  <li
                    className="me-2"
                    key={index}
                    onClick={() => handleOnTabClick(tab.key)}
                  >
                    <a
                      href="#"
                      aria-current="page"
                      className={tab.state ? activeString : inactiveString}
                    >
                      {tab.title}
                    </a>
                  </li>
                );
              })}
            </ul>
            {liveNaffles.state && (
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
                        <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default UserProfile;

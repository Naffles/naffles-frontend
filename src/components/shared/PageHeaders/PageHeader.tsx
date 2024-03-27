"use client";
import { Fragment } from "react";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { Menu, Transition } from "@headlessui/react";
import { MdMenu } from "react-icons/md";
import { FaDiscord, FaTwitter } from "react-icons/fa";

import { useUser } from "../../../blockchain/context/UserContext";
import {
  ConnectButton,
  DisconnectButton,
  ShowUIButton,
} from "../../../components/magic/index";

type PageHeaderProps = {
  // onLogin?: () => void;
  // onLogout: () => void;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  // onLogin,
  // onLogout,
}) => {
  const { user } = useUser();

  const navigationOptions = [
    {
      title: "Live Naffles",
      href: "/live-naffles",
    },
    {
      title: "Gaming",
      href: "/gaming",
    },
    {
      title: "Leaderboards",
      href: "/leaderboards",
    },
    {
      title: "Stake/Claim",
      href: "/stake-claim",
    },
    {
      title: "Profile",
      href: "/profile",
    },
  ];

  return (
    <div className="fixed top-0 w-full h-12 t bg-nafl-charcoal-600 z-10 mx-auto overflow:hidden">
      <div className="relative bg-nafl-sponge-500 rounded-xl mt-4 mx-auto px-2 py-1 w-[calc(100%-2rem)]">
        <div className="absolute bg-nafl-charcoal-600 rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" />
        <div className="flex flex-row items-center py-2 px-4 justify-between max-w-[200rem] m-auto">
          <div className="flex flex-row lg:flex-row lg:space-x-8 items-center space-y-4 lg:space-y-0">
            <span className="relative h-6">
              <Link href="/">
                <BrandIcon size="base" colour="dark" />
              </Link>
            </span>

            <Menu as="div" className="!m-0 pl-2 pt-2 block md:hidden">
              <Menu.Button>
                <MdMenu className="transition-colors ease-out duration-150 text-title-2xl text-nafl-charcoal-800 hover:text-[#8a8013] cursor-pointer" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-[0.25rem] mt-5 w-[calc(100vw-2.5rem)] md:w-64 origin-top-right rounded-xl bg-nafl-charcoal-700 shadow-lg ring-opacity-5 focus:outline-none overflow-hidden transition-all p-4">
                  <Menu.Item>
                    <>
                      <div className="flex flex-col space-y-2">
                        <a
                          href="/collections"
                          className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem]"
                        >
                          Explore
                        </a>
                        <hr className="border-nafl-charcoal-400" />
                        <a
                          href="/profile"
                          className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem]"
                        >
                          Profile
                        </a>
                      </div>
                    </>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="hidden lg:flex space-x-4 text-nafl-charcoal-800">
              <a href="https://twitter.com/Nafflesofficial" target="_blank">
                <FaTwitter className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-body-xl" />
              </a>
              <a href="https://discord.gg/naffles" target="_blank">
                <FaDiscord className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-body-xl" />
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-nafl-grey-900">
            {/* <CreateNaffleModal className=""></CreateNaffleModal> */}
            <div className="flex items-center space-x-4 hidden md:inline-block ">
              {navigationOptions.map((navItem, index) => (
                <a
                  key={index}
                  href={navItem.href}
                  className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem]"
                >
                  {navItem.title}
                </a>
              ))}
            </div>
            {/* Connect Wallet Here */}
            {user ? (
              <div className="p-2 flex flex-col w-[40vw] mx-auto">
                <ShowUIButton />
                <DisconnectButton />
              </div>
            ) : (
              <div className="p-2 text-center">
                <ConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageHeader;

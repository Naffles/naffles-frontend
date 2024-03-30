"use client";
import { Fragment, useState } from "react";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { Menu, Transition } from "@headlessui/react";
import { MdMenu } from "react-icons/md";
import { FaDiscord, FaTwitter, FaChevronDown } from "react-icons/fa";

import { useUser } from "@blockchain/context/UserContext";
import { ConnectButton } from "@components/magic/index";
import Login from "@components/shared/Button/login";
import colorVariants from "@components/utils/constants";

type PageHeaderProps = {
  // onLogin?: () => void;
  // onLogout: () => void;
};

const PageHeader: React.FC<PageHeaderProps> = (
  {
    // onLogin,
    // onLogout,
  }
) => {
  const { user } = useUser();
  const [selectedNavItem, setSelectedNavItem] = useState(0);

  const navigationOptions = [
    {
      title: "Naffle it",
      href: "/",
    },
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
    <div className="fixed top-0 w-full h-30 bg-nafl-charcoal-600 z-10 mx-auto">
      <div className="relative bg-nafl-sponge-500 rounded-lg mt-0 mx-auto px-2 py-1">
        <div className="absolute bg-nafl-charcoal-600 rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" />
        <div className="flex flex-row items-center py-2 px-4 justify-between max-w-[200rem] m-auto">
          <div className="flex flex-row lg:flex-row lg:space-x-8 items-center space-y-4 lg:space-y-0">
            <span className="relative h-6">
              <Link href="/">
                <BrandIcon size="lg" colour="black" />
              </Link>
            </span>
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

            <div className="flex items-center space-x-4 md:inline-block ">
              { navigationOptions.map((navItem, index) => (
                <a
                  key={index}
                  href={navItem.href}
                  style={{
                    backgroundColor: selectedNavItem === index ? colorVariants['dark-accent'] : colorVariants['yellow'],
                    color: selectedNavItem === index ? colorVariants['yellow'] : '#000',
                  }}
                  className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem] border-radius-[0.5rem] p-1 rounded-lg px-3"
                  onClick={() => selectedNavItem === index ? setSelectedNavItem(0) : setSelectedNavItem(index) }
                  >
                    {navItem.title}
                </a>
              ))}
            </div>
            {user ? (
              <Login />
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

"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { Menu, Transition } from "@headlessui/react";
import { MdMenu } from "react-icons/md";
import { FaDiscord, FaTwitter } from "react-icons/fa";
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
      href: "/gamezone",
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
    <div className="w-full h-30 bg-transparent mx-auto px-[25px] pt-[25px]">
      <div className="relative rounded-lg mt-0 mx-auto px-2 py-1 overflow-hidden z-50">
        {/* <div className="absolute bg-nafl-charcoal-600 rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" /> */}

        <div className="flex flex-row absolute inset-0 w-full h-full">
          <div className="flex h-full w-full bg-[#ffff3d]/90"></div>
          <div className="flex h-full w-[600px] bg-white">
            <img
              src={"/static/nav-mid-punch-hole.png"}
              alt="Naffle"
              className="flex w-full object-cover"
            />
          </div>
          <div className="flex h-full w-full bg-[#ffff3d]/90"></div>
        </div>

        <div className="flex flex-row items-center py-2 px-4 justify-between max-w-[200rem] m-auto">
          <div className="flex flex-row lg:flex-row lg:space-x-8 items-center space-y-4 lg:space-y-0 z-20 gap-[30px]">
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

          <div className="flex items-center space-x-4 z-20">
            <div className="flex items-center space-x-4 md:inline-block ">
              {navigationOptions.map((navItem, index) => (
                <a
                  key={index}
                  href={navItem.href}
                  style={{
                    backgroundColor:
                      selectedNavItem === index ? "#000" : "#00000000",
                    color:
                      selectedNavItem === index
                        ? "#fff"
                        : colorVariants["black"],
                  }}
                  className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem] border-radius-[0.5rem] p-1 rounded-lg px-3"
                  onClick={() =>
                    selectedNavItem === index
                      ? setSelectedNavItem(0)
                      : setSelectedNavItem(index)
                  }
                >
                  {navItem.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageHeader;

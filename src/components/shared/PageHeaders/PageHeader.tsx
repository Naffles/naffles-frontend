"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { Menu, Transition } from "@headlessui/react";
import { MdMenu } from "react-icons/md";
import { FaDiscord, FaTwitter, FaChevronDown, FaUser } from "react-icons/fa";

import { useUser } from "@blockchain/context/UserContext";
import { ConnectButton } from "@components/magic/index";
import Login from "@components/shared/Button/login";
import colorVariants from "@components/utils/constants";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm, LoginForm } from "@components/shared/AuthForms";
import WalletIcon from "@components/icons/walletIcon";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Use useRef for dropdown element reference

  const [showModal, setShowModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  const { jwt, user: basicUser, login, logout } = useBasicUser();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

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
    // {
    //   title: "Profile",
    //   href: "/profile",
    // },
  ];

  useEffect(() => {
    // Add event listener on document for clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogin = (response: any) => {};

  return (
    <div className="fixed top-0 w-full h-30 bg-nafl-charcoal-600 mx-auto z-50">
      {!basicUser && (
        <>
          <Modal
            title="REGISTER"
            show={showModal}
            hideModal={() => setShowModal(false)}
          >
            <RegistrationForm />
            <div className="text-body-sm text-nafl-charcoal-100 px-1">
              Have an Account?{" "}
              <u
                className="cursor-pointer"
                onClick={() => {
                  setShowModal(false);
                  setShowOtherModal(true);
                }}
              >
                Login Now
              </u>
            </div>
          </Modal>
          <Modal
            title="Login"
            show={showOtherModal}
            hideModal={() => setShowOtherModal(false)}
          >
            <LoginForm handleLogin={handleLogin} />
            <div className="text-body-sm text-nafl-charcoal-100 px-1">
              No Account?{" "}
              <u
                className="cursor-pointer"
                onClick={() => {
                  setShowModal(true);
                  setShowOtherModal(false);
                }}
              >
                Register Now
              </u>
            </div>
          </Modal>
        </>
      )}

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
            <div className="flex items-center space-x-4">
              {navigationOptions.map((navItem, index) => (
                <Link
                  key={index}
                  href={navItem.href}
                  style={{
                    backgroundColor:
                      selectedNavItem === index
                        ? colorVariants["dark-accent"]
                        : colorVariants["yellow"],
                    color:
                      selectedNavItem === index
                        ? colorVariants["yellow"]
                        : "#000",
                  }}
                  className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem] border-radius-[0.5rem] p-1 rounded-lg px-3"
                  onClick={() => setSelectedNavItem(index)}
                >
                  {navItem.title}
                </Link>
              ))}
            </div>
            <div ref={dropdownRef} className="relative">
              {" "}
              {/* Assign ref to outer div */}
              <button
                onClick={() => setOpen(!open)} // Toggle open state on button click
                type="button"
                className="focus:outline-none rounded-full p-2 hover:bg-gray-300"
                // onBlur={() => setOpen(!open)}
              >
                <WalletIcon
                  colour="black"
                  // onClick={() => setShowModal(true)}
                  size="lg"
                  className="cursor-pointer"
                />
              </button>
              {open && (
                <ul
                  onBlur={() => setOpen(false)}
                  className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-sm bg-white dark:bg-gray-800 overflow-hidden"
                >
                  {basicUser ? (
                    <Link
                      href={"/profile/aaa"}
                      className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      View Profile
                      {/* if user then View Profile else Login button */}
                    </Link>
                  ) : (
                    <li
                      className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setShowOtherModal(true)}
                    >
                      Login
                    </li>
                  )}

                  <li className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Settings
                  </li>
                  {basicUser && (
                    <li
                      className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={logout}
                    >
                      Logout
                    </li>
                  )}
                  <li className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 bg-[#feff3d] cursor-pointer border-t-[2px] border-[#000]">
                    <ConnectButton />
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageHeader;

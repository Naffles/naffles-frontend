"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandIcon from "@components/icons/brandIcon";
import { Menu, Transition } from "@headlessui/react";
import { MdMenu } from "react-icons/md";
import { FaDiscord, FaTwitter, FaChevronDown, FaUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

import { useUser } from "@blockchain/context/UserContext";
import { ConnectButton } from "@components/magic/index";
import Login from "@components/shared/Button/login";
import colorVariants from "@components/utils/constants";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm, LoginForm } from "@components/shared/AuthForms";
import WalletIcon from "@components/icons/walletIcon";
import UserIcon from "@components/icons/userIcon";
import DeleteIcon from "@components/icons/deleteIcon";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { BurgerIcon } from "@components/icons/burgerIcon";
import { CloseBurger } from "@components/icons/closeBurgerIcon";
import { ProfileForm, ProfileSubmitData } from "../AuthForms/ProfileForm";
import axios from "@components/utils/axios";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const [openModal, setOpenModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const handleProfileEditSubmit = (data: ProfileSubmitData) => {
    const form = new FormData();
    if (data?.username) form.append("username", data.username);
    if (imageFile) form.append("file", imageFile);
    axios.patch("user/profile", form);
  };

  return (
    <div className="fixed top-0 lg:w-full h-[84px] lg:bg-nafl-charcoal-600 bg-transparent mx-auto z-50 p-[25px]">
      {!basicUser ? (
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
      ) : (
        <Modal
          show={openModal}
          hideModal={() => setOpenModal(false)}
          title="Edit Profile"
        >
          <div className="flex flex-col items-start h-auto">
            <div className="flex flex-row items-center">
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
                  style={
                    !imageUrl
                      ? { backgroundImage: `url(/static/nft-dummy.png)` }
                      : { backgroundImage: `url(${imageUrl})` }
                  }
                  onClick={handleUpload}
                >
                  {!imageFile && (
                    <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-30 rounded-full">
                      Click to upload
                    </div>
                  )}
                </div>
              </div>

              <ProfileForm handleSubmit={handleProfileEditSubmit} />
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
              </div>
            </div>
            <div className="flex flex-col items-center w-full">
              <button className="mt-4 bg-nafl-sponge-500 px-5 py-1 rounded-md align-middle">
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="relative lg:bg-nafl-sponge-500 bg-transparent rounded-tr-lg rounded-tl-lg z-[20] ">
        <div className="absolute lg:bg-nafl-charcoal-600 bg-transparent rounded-full h-8 w-8 top-[-1rem] left-[calc(50%-1rem)]" />
        <div className="flex flex-row items-center py-2 px-4 justify-between w-full m-auto flex-wrap">
          <div className="flex flex-row lg:flex-row lg:space-x-8 items-center space-y-0">
            <span className="hidden lg:flex relative h-6">
              <Link href="/">
                <BrandIcon size="lg" colour="black" />
              </Link>
            </span>
            <span
              className="lg:hidden flex cursor-pointer"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <HiMenu className="text-nafl-sponge-500 text-[40px]" />
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
          <div className="hidden lg:flex items-center space-x-4 text-nafl-grey-900">
            <div className="flex items-center gap-[30px]">
              {navigationOptions.map((navItem, index) => (
                <Link
                  key={index}
                  href={navItem.href}
                  style={{
                    backgroundColor:
                      selectedNavItem === index ? "#000" : "#00000000",
                    color: selectedNavItem === index ? "#fff" : "#000",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                  }}
                  className="text-xl transition-colors ease-out duration-150 hover:text-[#8a8013] cursor-pointer pt-[0.2rem] border-radius-[0.5rem] p-1 rounded-lg"
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
                <UserIcon
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
                    <>
                      <Link
                        href={"/profile/aaa"}
                        className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        View Profile
                        {/* if user then View Profile else Login button */}
                      </Link>
                      <li
                        className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => setOpenModal(true)}
                      >
                        Edit Profile
                      </li>
                    </>
                  ) : (
                    <li
                      className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setShowOtherModal(true)}
                    >
                      Login
                    </li>
                  )}
                  <li className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <ConnectButton />
                  </li>
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
                </ul>
              )}
            </div>
            <WalletIcon colour="black" size="lg" className="cursor-pointer" />
          </div>
          <div className="flex lg:hidden space-x-4 text-nafl-charcoal-800">
            {/* <span
              className="cursor-pointer"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <CloseBurger colour="black" size="base" />
              ) : (
                <BurgerIcon colour="black" size="base" />
              )}
            </span> */}
          </div>
        </div>
      </div>
      <div
        className={`lg:hidden flex fixed left-0 top-0 h-screen overflow-hidden ${showMobileMenu ? "w-full " : "duration-[1500ms] w-0"}`}
      >
        <div
          onClick={() => setShowMobileMenu(false)}
          className={`z-10 w-full h-screen bg-[#000]/30 backdrop-blur-md duration-300 ${showMobileMenu ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 h-screen flex lg:hidden flex-col items-center bg-nafl-sponge-500 justify-between w-[200px] py-[50px] duration-500 z-20 ${showMobileMenu ? "left-0" : "left-[-200px]"}`}
        >
          <div className="flex flex-col items-center w-full gap-[40px]">
            <Link href="/" className="w-[90%]">
              <img
                src="/static/naffles-text-logo-dark.png"
                alt="Naffles Dark Logo"
                className="w-full object-contain"
              />
            </Link>
            <div className="flex flex-col items-center">
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
          </div>

          <div
            ref={dropdownRef}
            className={`flex flex-col relative items-center w-[90%] bg-white rounded-[10px] duration-500 overflow-hidden border-[2px] border-[#252525] ${open ? "h-[200px]" : "h-[43px]"}`}
          >
            {" "}
            {/* Assign ref to outer div */}
            <button
              onClick={() => setOpen(!open)} // Toggle open state on button click
              type="button"
              className="flex items-center justify-center focus:outline-none rounded-[10px] p-2 w-full"
              // onBlur={() => setOpen(!open)}
            >
              <WalletIcon
                colour="black"
                // onClick={() => setShowModal(true)}
                size="lg"
                className="cursor-pointer"
              />
            </button>
            <ul
              onBlur={() => setOpen(false)}
              className={`flex flex-col w-[90%] rounded-md bg-white dark:bg-gray-800 overflow-hidden duration-500 ${open ? "h-[140px]" : "h-[0px]"}`}
            >
              {basicUser ? (
                <>
                  <Link
                    href={"/profile/aaa"}
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    View Profile
                    {/* if user then View Profile else Login button */}
                  </Link>
                  <li
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setOpenModal(true)}
                  >
                    Edit Profile
                  </li>
                </>
              ) : (
                <li
                  className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setShowOtherModal(true)}
                >
                  Login
                </li>
              )}
              <li className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <ConnectButton />
              </li>
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageHeader;

"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaUserCircle } from "react-icons/fa";
import colorVariants from "@components/utils/constants";
import { useUser } from "@blockchain/context/UserContext";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import WalletIcon from "@components/icons/walletIcon";
import UserIcon from "@components/icons/userIcon";
import DeleteIcon from "@components/icons/deleteIcon";
import { ConnectButton } from "@components/magic";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm, LoginForm } from "@components/shared/AuthForms";
import { ProfileForm, ProfileSubmitData } from "../AuthForms/ProfileForm";
import axios from "@components/utils/axios";
import { HiMenu } from "react-icons/hi";

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
  ];

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     dropdownRef.current &&
  //     !dropdownRef.current.contains(event.target as Node)
  //   ) {
  //     setOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   // Add event listener on document for clicks outside the dropdown
  //   document.addEventListener("click", handleClickOutside);

  //   // Cleanup function to remove event listener on unmount
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  useEffect(() => {
    console.log("opening", open);
  }, [open]);

  const handleLogin = (response: any) => {
    console.log(response);
  };

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
  const handleLogout = () => {
    setShowModal(false);
    setShowOtherModal(false);
    setOpenModal(false);
    
    logout();
  };

  return (
    <div className="fixed top-0 flex items-center justify-center w-full bg-transparent px-[25px] pt-[25px] z-50">
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

      <div className="lg:flex hidden flex-row items-center justify-between rounded-lg h-[84px] w-full relative px-[19px]">
        <div className="flex flex-row absolute inset-0 w-full h-full z-10 rounded-[16px] overflow-hidden">
          <div className="flex h-full w-full bg-[#ffff3d]"></div>
          <img
            src={"/static/nav-mid-punch-hole.png"}
            alt="Naffle"
            className="flex h-full object-cover mx-[-2px]"
          />
          <div className="flex h-full w-full bg-[#ffff3d]"></div>
        </div>

        <div className="flex flex-row items-center px-4 justify-between w-full z-20">
          <div className="flex flex-row items-center justify-center gap-[80px]">
            <Link href="/">
              <img
                src="/static/naffles-icon-dark.png"
                alt="Naffles Icon"
                className="w-[80px] object-contain"
              />
            </Link>
            <div className="hidden xl:flex text-nafl-charcoal-800 gap-[40px]">
              <a href="https://twitter.com/Nafflesofficial" target="_blank">
                <FaTwitter className="hover:text-nafl-sponge-700 text-[40px] transition-colors ease-out duration-150 cursor-pointer " />
              </a>
              <a href="https://discord.gg/naffles" target="_blank">
                <FaDiscord className="hover:text-nafl-sponge-700 text-[40px] transition-colors ease-out duration-150 cursor-pointer" />
              </a>
            </div>
          </div>

          <div className="flex items-center z-20">
            <div className="flex items-center xl:gap-[50px] lg:gap-[30px] gap-[10px]">
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
                    paddingLeft: selectedNavItem === index ? "32px" : "0px",
                    paddingRight: selectedNavItem === index ? "32px" : "0px",
                  }}
                  className="flex items-center justify-center xl:text-[23px] lg:text-[20px] md:text-[18px] ease-out duration-150 cursor-pointer py-[8px] rounded-lg leading-[100%] tracking-[.5px]"
                  onClick={() => setSelectedNavItem(index)}
                >
                  {navItem.title}
                </a>
              ))}

              <div className="flex flex-row items-center justify-center gap-[30px]">
                <div ref={dropdownRef} className="relative">
                  {" "}
                  <button
                    onClick={() => {
                      setOpen(!open);
                      console.log("opened");
                    }} // Toggle open state on button click
                    type="button"
                    className="focus:outline-none rounded-full p-2 hover:bg-gray-300"
                    // onBlur={() => setOpen(!open)}
                  >
                    <FaUserCircle className="text-[#212121] text-[30px]" />
                  </button>
                  {open && (
                    <ul
                      onBlur={() => setOpen(false)}
                      className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-sm bg-white dark:bg-gray-800 overflow-hidden"
                    >
                      {basicUser ? (
                        <>
                          <Link
                            href={"/profile/user-profile"}
                            className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            View Profile
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
                        Settings
                      </li>
                      {basicUser && (
                        <li
                          className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <ConnectButton />
              </div>

              {/* <div ref={dropdownRef} className="relative">
                {" "}
                <button
                  onClick={() => {
                    setOpen(!open);
                    console.log("opened");
                  }} // Toggle open state on button click
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
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <span
        className="lg:hidden flex cursor-pointer absolute left-[20px] top-[20px] p-[5px] rounded-[10px] bg-[#000] shadow-xl"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <HiMenu className="text-nafl-sponge-500 text-[40px]" />
      </span>

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
              <UserIcon
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
                <Link
                  href={"/profile/user-profile"}
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
                <ConnectButton />
              </li>
              <li className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                Settings
              </li>
              {basicUser && (
                <li
                  className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              )}
            </ul>
            <WalletIcon colour="black" size="lg" className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PageHeader;

"use client";

import { useEffect, useRef, useState, ChangeEvent, useCallback } from "react";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaUserCircle } from "react-icons/fa";
import colorVariants from "@components/utils/constants";
import { useUser } from "@blockchain/context/UserContext";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import axios from "@components/utils/axios";
import { motion } from "framer-motion";
import WalletIcon from "@components/icons/walletIcon";
import UserIcon from "@components/icons/userIcon";
import { ConnectButton } from "@components/magic";
import { Modal } from "@components/shared/Modal";
import {
  RegistrationForm,
  LoginForm,
  ResetPassForm,
} from "@components/shared/AuthForms";
import { ProfileForm } from "../AuthForms/ProfileForm";
import { HiMenu } from "react-icons/hi";

type PageHeaderProps = {
  // onLogin?: () => void;
  // onLogout: () => void;
};
enum ModalNames {
  REGISTER = "Register",
  LOGIN = "Login",
  RESET = "Reset Password",
}

const PageHeader: React.FC<PageHeaderProps> = (
  {
    // onLogin,
    // onLogout,
  }
) => {
  const [selectedNavItem, setSelectedNavItem] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Use useRef for dropdown element reference

  const [shownModal, setShownModal] = useState<ModalNames | "">("");
  const [showModal, setShowModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      href: "/staking",
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", (e) => {
      if (window.scrollY < 25) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
    });
  }, []);

  useEffect(() => {
    console.log(isScrolled);
  }, [isScrolled]);

  const handleUserChange = useCallback(async () => {
    if (basicUser?.profileImage) {
      const { data: profileImageData } = await axios.get(
        "image/view?path=" + basicUser.profileImage,
        { responseType: "arraybuffer" }
      );
      setImageUrl(URL.createObjectURL(new Blob([profileImageData])));
    } else {
      setImageUrl(null);
    }
  }, [basicUser]);

  useEffect(() => {
    handleUserChange();
  }, [handleUserChange]);

  useEffect(() => {
    console.log("opening", open);
  }, [open]);

  const handleLogin = (response: any) => {
    console.log(response);
  };

  const [openEditModal, setOpenEditModal] = useState(false);

  const handleLogout = () => {
    setShownModal("");
    setOpenEditModal(false);
    logout();
  };
  const handleForgotClick = () => {
    setShownModal(ModalNames.RESET);
  };

  return (
    <motion.div
      initial={{ paddingTop: 25 }}
      animate={{ paddingTop: isScrolled ? 0 : 25 }}
      transition={{ type: "spring" }}
      className="sticky top-0 flex items-center justify-center w-full px-[25px] z-40"
    >
      {!basicUser ? (
        <>
          <Modal
            title={ModalNames.REGISTER}
            show={shownModal === ModalNames.REGISTER}
            hideModal={() => setShownModal("")}
          >
            <RegistrationForm />
            <div className="text-body-sm text-nafl-charcoal-100 px-1">
              Have an Account?{" "}
              <u
                className="cursor-pointer"
                onClick={() => setShownModal(ModalNames.LOGIN)}
              >
                Login Now
              </u>
            </div>
          </Modal>
          <Modal
            title={ModalNames.LOGIN}
            show={shownModal === ModalNames.LOGIN}
            hideModal={() => setShownModal("")}
          >
            <LoginForm
              handleLogin={handleLogin}
              handleForgotClick={handleForgotClick}
            />
            <div className="text-body-sm text-nafl-charcoal-100 px-1">
              No Account?{" "}
              <u
                className="cursor-pointer"
                onClick={() => setShownModal(ModalNames.REGISTER)}
              >
                Register Now
              </u>
            </div>
          </Modal>
          <Modal
            title={ModalNames.RESET}
            show={shownModal === ModalNames.RESET}
            hideModal={() => setShownModal("")}
          >
            <ResetPassForm />
            <div className="text-body-sm text-nafl-charcoal-100 px-1">
              No Account?{" "}
              <u
                className="cursor-pointer"
                onClick={() => setShownModal(ModalNames.REGISTER)}
              >
                Register Now
              </u>
            </div>
          </Modal>
        </>
      ) : (
        <Modal
          show={openEditModal}
          hideModal={() => setOpenEditModal(false)}
          title="Edit Profile"
        >
          <ProfileForm />
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
          <div className="flex flex-row items-center justify-center gap-[80px] relative">
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
            <div className="w-[200px] absolute top-[-20px] right-[-180px]">
              <img src="/nafflings/surprise.png" alt="" />
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
                    {basicUser && imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-[30px] h-[30px] rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="text-[#212121] text-[30px]" />
                    )}
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
                            onClick={() => setOpenEditModal(true)}
                          >
                            Edit Profile
                          </li>
                        </>
                      ) : (
                        <li
                          className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setShownModal(ModalNames.LOGIN)}
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
              {basicUser && imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-[30px] h-[30px] rounded-full"
                />
              ) : (
                <FaUserCircle className="text-[#212121] text-[30px]" />
              )}
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
    </motion.div>
  );
};
export default PageHeader;

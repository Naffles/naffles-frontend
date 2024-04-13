"use client";
import useStore from "../utils/store";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdLogOut } from "react-icons/io";

const ConnectButton = () => {
  const { magic } = useMagic();
  const { setJWT, fetchUser } = useUser();
  const [walletLoggedIn, setWalletLoggedIn] = useState(false);

  const handleConnect = async () => {
    try {
      // Try to connect to the wallet using Magic's user interface
      if (!magic) return;
      await magic.wallet.connectWithUI();

      // const did = await magic.auth.loginWithEmailOTP({ email: emailAddress });
      // console.log(did);

      // @note Send the `did` to server
      await fetchUser();
    } catch (error) {
      // Log any errors that occur during the connection process
      console.error("handleConnect:", error);
    }
  };

  useEffect(() => {
    if (!magic?.user) return;
    getUserData();
  }, [magic]);

  const getUserData = async () => {
    const userInfo = await magic?.user.getInfo();
    console.log("userInfo:", userInfo);

    const idToken = await magic?.user.getIdToken();
    console.log("idToken:", idToken);
    idToken && loginUsingDID(idToken);

    idToken && setWalletLoggedIn(true);

    if (process.env.SERVER_SECRET && !idToken) {
      console.log("generated new idtoken");
      const newIdToken = await magic?.user.generateIdToken({
        attachment: process.env.SERVER_SECRET,
      });
      newIdToken && loginUsingDID(newIdToken);

      console.log("newIdToken:", newIdToken);
    }
  };

  const loginUsingDID = async (DIDtoken: string | undefined) => {
    console.log("DIDtoken:", DIDtoken);
    try {
      let url = "https://dev.api.naffles.com/user/login/wallet";

      await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "a8182a19-2aae-48e6-97a7-4c7836d7004b",
          Authorization: "Bearer " + DIDtoken,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((result) => {
          if (result) {
            console.log("wallet login result:", result);
            // setJWT(result?.token);
            // Cookies.set("token", result?.token, { expires: 7, secure: true });
          } else {
            console.log("error");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      await magic?.wallet.showUI();
    } catch (error) {
      // Log any errors that occur during the process
      console.error("handleShowUI:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Try to disconnect the user's wallet using Magic's logout method
      await magic?.user.logout();
      await fetchUser();
    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log("handleDisconnect:", error);
    }
  };

  // Render the button component with the click event handler
  return (
    <div className="flex flex-row items-center justify-center w-full relative">
      <button
        className="flex flex-row items-center justify-start w-full"
        onClick={() => {
          // setIsOpen(true);
          walletLoggedIn ? handleShowUI() : handleConnect();
        }}
      >
        <p className="font-face-bebas leading-[100%] text-[#000]">
          {walletLoggedIn ? "Wallet Account Details" : "Wallet Login"}
        </p>
      </button>
      {walletLoggedIn && (
        <button
          onClick={() => handleDisconnect()}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-md bg-[#ff4747] absolute right-[-10px] shadow-xl"
        >
          <IoMdLogOut className="text-[#fff]" />
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

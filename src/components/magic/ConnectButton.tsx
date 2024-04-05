"use client";
import useStore from "../utils/store";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect } from "react";

const ConnectButton = () => {
  const { magic } = useMagic();
  const { fetchUser } = useUser();

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

    if (process.env.SERVER_SECRET && !idToken) return;
    console.log("generated new idtoken");
    const newIdToken = await magic?.user.generateIdToken({
      attachment: process.env.SERVER_SECRET,
    });

    console.log("idToken:", newIdToken);
  };

  // Render the button component with the click event handler
  return (
    <button
      type="button"
      className="w-auto border border-white text-color font-bold p-2 rounded-md"
      onClick={() => {
        // setIsOpen(true);
        handleConnect();
      }}
    >
      Connect
    </button>
  );
};

export default ConnectButton;

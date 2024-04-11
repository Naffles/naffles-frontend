"use client";
import useStore from "../utils/store";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ConnectButton = () => {
  const { magic } = useMagic();
  const { setJWT, fetchUser } = useUser();

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

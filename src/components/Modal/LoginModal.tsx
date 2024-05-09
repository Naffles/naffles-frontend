"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import useStore from "../utils/store";
// import ModalContainer from "@components/shared/Modal/modal2";

const LoginModal = () => {
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  const isOpen = useStore((state) => state.isOpen);
  const emailAddress = useStore((state) => state.emailAddress);

  const setIsOpen = useStore((state) => state.setIsOpen);
  const setEmailAddress = useStore((state) => state.setEmailAddress);
  // const [isOpen, setIsOpen] = useState(false);

  // Define the event handler for the button click
  const handleConnect = async () => {
    try {
      // Try to connect to the wallet using Magic's user interface
      if (!magic) return;
      // await magic.wallet.connectWithUI();
      const did = await magic.auth.loginWithEmailOTP({ email: emailAddress });
      console.log(did);

      const userInfo = await magic.user.getInfo();
      console.log(userInfo);

      // @note Send the `did` to server
      await fetchUser();
    } catch (error) {
      // Log any errors that occur during the connection process
      console.error("handleConnect:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <></>
    // <ModalContainer
    //   title={"Connect with your email"}
    //   content={<LoginModalContent />}
    //   category={"login"}
    //   isOpen={isOpen}
    //   handleOnClick={handleConnect}
    //   setIsOpen={setIsOpen}
    // />
  );
};

const LoginModalContent = () => {
  const setEmailAddress = useStore((state) => state.setEmailAddress);
  return (
    <div>
      <input
        type="email"
        className="border border-[#000] rounded-[8px] p-2 w-[300px] text-[#000]"
        onChange={(e) => setEmailAddress(e.target.value)}
      />
    </div>
  );
};

export default LoginModal;

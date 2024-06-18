"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useUser } from "@blockchain/context/UserContext";
import useStore from "../utils/store";
// import ModalContainer from "@components/shared/Modal/modal2";

const LoginModal = () => {
  // Get the initializeWeb3 function from the Web3 context

  const isOpen = useStore((state) => state.isOpen);
  const emailAddress = useStore((state) => state.emailAddress);

  const setIsOpen = useStore((state) => state.setIsOpen);
  const setEmailAddress = useStore((state) => state.setEmailAddress);
  // const [isOpen, setIsOpen] = useState(false);

  // Define the event handler for the button click

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

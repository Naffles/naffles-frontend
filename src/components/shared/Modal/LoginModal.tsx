"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import useStore from "../../utils/store";

const LoginModal = () => {
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  const isOpen = useStore((state) => state.isOpen);
  const emailAddress = useStore((state) => state.emailAddress);

  const setIsOpen = useStore((state) => state.setIsOpen);
  const setEmailAddress = useStore((state) => state.setEmailAddress);

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-nafl-white transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Connect with your email
                </Dialog.Title>
                <div className="mt-2">
                  <input type="email" className="border border-black p-2 w-[300px]" onChange={(e) => setEmailAddress(e.target.value)} />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleConnect}
                  >
                    Login
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;

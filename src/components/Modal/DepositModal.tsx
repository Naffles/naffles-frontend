"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMagic } from "@blockchain/context/MagicProvider";
import { useUser } from "@blockchain/context/UserContext";
import useStore from "../utils/store";
import ModalContainer from "../shared/Modal/modal";
import Banxa from "@banxa-global/js-sdk";

const DepositModal = () => {
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic();
  const { fetchUser } = useUser();

  const isDepositOpen = useStore((state) => state.isDepositOpen);

  const setIsDepositOpen = useStore((state) => state.setIsDepositOpen);

  const handleDeposit = async () => {
    try {
      console.log("handle click");
    } catch (error) {
    } finally {
      setIsDepositOpen(false);
    }
  };

  return (
    <ModalContainer
      title={"Deposit fiat and get crypto"}
      content={<DepositModalContent />}
      category={"deposit"}
      isOpen={isDepositOpen}
      handleOnClick={handleDeposit}
      setIsOpen={setIsDepositOpen}
    />
  );
};

const DepositModalContent = () => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
      // Embed Banxa SDK script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://sdk.banxa.com/js/banxa-sdk-latest.js';
  
      const onLoadCallback = () => {
        // initializeBanxa();
      };
  
      script.addEventListener('load', onLoadCallback);
      document.getElementsByTagName('script')[0].parentNode?.insertBefore(script, null);
  
      return () => {
        script.removeEventListener('load', onLoadCallback);
      };
    }, []);
  
    // const initializeBanxa = () => {
    //   // Initiate Banxa class
    //   const production = new Banxa('your-partner-name');
    //   const sandbox = new Banxa('your-partner-name', 'sandbox');
    // };
  
    const handleIframeButtonClick = () => {
      setIframeLoaded(true);
    };
  
    return (
      <div>
        <button id="iframeButton" onClick={handleIframeButtonClick}>Launch iframe</button>
        <div id="iframeTarget">
          {iframeLoaded && (
            <iframe
              title="Banxa iframe"
              src="about:blank"
              style={{ width: '800px', height: '400px' }}
              frameBorder="0"
            />
          )}
        </div>
      </div>
    );
};

export default DepositModal;

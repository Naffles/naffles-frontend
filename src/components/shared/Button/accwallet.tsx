import React, { useState } from 'react';
import WalletSelectModal from '../Modal/WalletSelectModal';

const AccWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [showWalletSelectModal, setShowWalletSelectModal] = useState<boolean>(false);

  const disconnect = async () => {
    setWalletAddress(null);
  }

  return (
    <div>
      {walletAddress ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={() => setShowWalletSelectModal(true)}>Connect</button>
      )}
      <WalletSelectModal
        show={showWalletSelectModal}
        setShow={setShowWalletSelectModal}
      />
    </div>
  );
};

export default AccWallet;
import { useState } from "react";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm } from "@components/shared/AuthForms";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import DemoPointsLeaderboards from "./DemoPointsLeaderboards";
import useScreenSize from "@hook/useScreenSize";
import { RockPaperScissorsGame, CoinTossGame } from "./Games";

export const GameSection = () => {
  const { user } = useBasicUser();
  const { isMobile } = useScreenSize();
  const [openModal, setOpenModal] = useState(false);
  const [isCoinTossPaused, setIsCoinTossPaused] = useState(false);
  const [isRPSPaused, setIsRPSPaused] = useState(false);

  const handleLimitReached = () => {
    setOpenModal(true);
    setIsRPSPaused(true);
    setIsCoinTossPaused(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsRPSPaused(false);
    setIsCoinTossPaused(false);
  };

  return (
    <>
      <Modal
        title="Register now to save your points"
        show={openModal && !user}
        hideModal={handleCloseModal}
      >
        <RegistrationForm />
      </Modal>
      <div className="flex-row flex-wrap justify-center items-center gamezone-container gap-4 pt-8 hidden lg:flex">
        <div className="flex-col flex games-container gap-8">
          <RockPaperScissorsGame
            onGameStart={() => setIsCoinTossPaused(true)}
            onGameReset={() => setIsCoinTossPaused(false)}
            isPaused={isRPSPaused}
            onLimitReached={handleLimitReached}
          />
          <CoinTossGame
            onGameStart={() => setIsRPSPaused(true)}
            onGameReset={() => setIsRPSPaused(false)}
            isPaused={isCoinTossPaused}
            onLimitReached={handleLimitReached}
          />
        </div>
        <div className="flex-col flex stats-container bg-nafl-grey-700 rounded-3xl xl:mt-0 lg:mt-[100px]">
          <DemoPointsLeaderboards />
        </div>
      </div>
      {isMobile && (
        <div className="flex lg:hidden xl:hidden flex-col h-auto">
          <RockPaperScissorsGame
            onGameStart={() => setIsCoinTossPaused(true)}
            onGameReset={() => setIsCoinTossPaused(false)}
            isPaused={isRPSPaused}
            onLimitReached={handleLimitReached}
          />
          <CoinTossGame
            onGameStart={() => setIsRPSPaused(true)}
            onGameReset={() => setIsRPSPaused(false)}
            isPaused={isCoinTossPaused}
            onLimitReached={handleLimitReached}
          />
        </div>
      )}
    </>
  );
};

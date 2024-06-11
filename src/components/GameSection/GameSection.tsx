import { useState, useEffect } from "react";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm } from "@components/shared/AuthForms";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import DemoPointsLeaderboards from "./DemoPointsLeaderboards";
import useScreenSize from "@hook/useScreenSize";
import { RockPaperScissorsGame } from "./Games/RockPaperScissorsGame";
import { CoinTossGame } from "./Games/CoinTossGame";
import GameResultModal from "@components/shared/Modal/GameResultModal";
import StartGameModal from "@components/shared/Modal/StartGameModal";

export const GameSection = () => {
  const [hasSelected, setHasSelected] = useState(false);
  const { user } = useBasicUser();
  const { isMobile } = useScreenSize();
  const [openModal, setOpenModal] = useState(false);
  const [isCoinTossPaused, setIsCoinTossPaused] = useState(false);
  const [isRPSPaused, setIsRPSPaused] = useState(false);
  const [showGameResultModal, setShowGameResultModal] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [showStartGameModal, setShowStartGameModal] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const containerElement = document.getElementById(
        "start-game-modal-pop-up"
      );
      const clickedElementId = clickedElement.id;

      if (
        !containerElement ||
        !containerElement.contains(clickedElement) ||
        clickedElementId == "start-game-modal-pop-up"
      ) {
        // setIsRPSPaused(false);
        // setIsCoinTossPaused(false);
        setShowStartGameModal(false);
      }
    };

    // Add event listener on document for clicks outside the dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      const timer = setTimeout(() => {
        setIsRPSPaused(true);
        setIsCoinTossPaused(true);
        setShowStartGameModal(true);
        setFirstLoad(false);
      }, 20000); // milliseconds

      return () => clearTimeout(timer); // Cleanup function to clear timeout on unmount
    }
  }, [firstLoad]);

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

  const handleRPSStart = (choice?: string) => {
    if (choice) {
      setFirstLoad(false);
      setHasSelected(true);
    }
    setIsCoinTossPaused(true);
  };

  const handleCoinTossStart = (choice?: string) => {
    if (choice) {
      setFirstLoad(false);
      setHasSelected(true);
    }
    setIsRPSPaused(true);
  };

  const handleRPSEnd = () => {
    if (hasSelected) {
      setHasSelected(false);
    }
    setIsCoinTossPaused(false);
  };

  const handleCoinTossEnd = () => {
    if (hasSelected) {
      setHasSelected(false);
    }
    setIsRPSPaused(false);
  };

  const handleResultModal = (result: string) => {
    setGameResult(result);
    setShowGameResultModal(true);
  };

  const handleCloseStartGameModal = () => {
    setShowStartGameModal(!showStartGameModal);
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
      <div className="flex-row flex-wrap justify-center items-center gamezone-container gap-4 pt-8 hidden lg:flex relative">
        <div className="flex-col flex games-container gap-8">
          <GameResultModal
            show={showGameResultModal}
            hideModal={() => setShowGameResultModal(!showGameResultModal)}
            result={gameResult}
          />
          <RockPaperScissorsGame
            resetToInitial={hasSelected}
            onGameStart={handleRPSStart}
            onGameReset={handleRPSEnd}
            isPaused={isRPSPaused}
            callGameResultModal={handleResultModal}
            onLimitReached={handleLimitReached}
          />
          <CoinTossGame
            resetToInitial={hasSelected}
            onGameStart={handleCoinTossStart}
            onGameReset={handleCoinTossEnd}
            isPaused={isCoinTossPaused}
            callGameResultModal={handleResultModal}
            onLimitReached={handleLimitReached}
          />
          <StartGameModal
            show={showStartGameModal}
            hideModal={() => {
              handleCloseStartGameModal;
            }}
          />
        </div>
        <div className="flex-col flex stats-container bg-nafl-grey-700 rounded-3xl xl:mt-0 lg:mt-[100px]">
          <DemoPointsLeaderboards />
        </div>
      </div>
      {isMobile && (
        <div className="flex lg:hidden xl:hidden flex-col h-auto">
          <GameResultModal
            show={showGameResultModal}
            hideModal={() => setShowGameResultModal(!showGameResultModal)}
            result={gameResult}
          />
          <RockPaperScissorsGame
            resetToInitial={hasSelected}
            onGameStart={handleRPSStart}
            onGameReset={handleRPSEnd}
            isPaused={isRPSPaused}
            callGameResultModal={handleResultModal}
            onLimitReached={handleLimitReached}
          />
          <CoinTossGame
            resetToInitial={hasSelected}
            onGameStart={handleCoinTossStart}
            onGameReset={handleCoinTossEnd}
            isPaused={isCoinTossPaused}
            callGameResultModal={handleResultModal}
            onLimitReached={handleLimitReached}
          />
        </div>
      )}
    </>
  );
};

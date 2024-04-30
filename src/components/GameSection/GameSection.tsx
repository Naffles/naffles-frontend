import { useState, useEffect } from "react";
import { useLocalStorage } from "@hook/useLocalStorage";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm } from "@components/shared/AuthForms";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import DemoPointsLeaderboards from "./DemoPointsLeaderboards";
import useScreenSize from "@hook/useScreenSize";
import { RockPaperScissorsGame, CoinTossGame } from "./Games";
import unixToString from "@components/utils/unixToString";

const DAILY_PLAYS_THRESHOLD = 10;
type PlaysObject = {
  plays: number;
  date: number;
};

export const GameSection = () => {
  const { user } = useBasicUser();
  const { isMobile } = useScreenSize();
  const [playsToday, setPlaysToday] = useLocalStorage<PlaysObject | null>(
    "daily-plays",
    null,
    {
      initializeWithValue: false,
    }
  );
  const [openModal, setOpenModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isPlaysCountToday = false;
    if (playsToday?.date) {
      const currentDateNumber = Date.now();
      const currentDate = unixToString(currentDateNumber);
      const previousDate = unixToString(playsToday.date);
      isPlaysCountToday = previousDate === currentDate;
    }
    if (
      isPlaysCountToday &&
      playsToday?.plays &&
      playsToday.plays >= DAILY_PLAYS_THRESHOLD
    ) {
      setOpenModal(true);
    }
  }, [playsToday]);

  const onPlayEnd = () => {
    if (!user) {
      setPlaysToday((playsObject) => {
        if (playsObject?.date && playsObject?.plays < DAILY_PLAYS_THRESHOLD) {
          const currentDateNumber = Date.now();
          const currentDate = unixToString(currentDateNumber);
          const previousDate = unixToString(playsObject.date);
          if (previousDate === currentDate) {
            const currentPlays = playsObject?.plays || 0;
            return {
              plays: currentPlays + 1,
              date: currentDateNumber,
            };
          }
        }
        return { plays: 1, date: Date.now() };
      });
    }
  };

  return (
    <>
      <Modal
        title="Register now to save your points"
        show={openModal && !user}
        hideModal={() => setOpenModal(false)}
      >
        <RegistrationForm />
      </Modal>
      <div className="flex-row flex-wrap justify-center items-center gamezone-container gap-4 pt-8 hidden lg:flex">
        <div className="flex-col flex games-container gap-8">
          <RockPaperScissorsGame
            handlePlayCount={onPlayEnd}
            onGameStart={() => setIsPaused(true)}
            onGameReset={() => setIsPaused(false)}
            isPaused={isPaused}
          />
          <CoinTossGame
            handlePlayCount={onPlayEnd}
            onGameStart={() => setIsPaused(true)}
            onGameReset={() => setIsPaused(false)}
            isPaused={isPaused}
          />
        </div>
        <div className="flex-col flex stats-container bg-nafl-grey-700 rounded-3xl xl:mt-0 lg:mt-[100px]">
          <DemoPointsLeaderboards />
        </div>
      </div>
      {isMobile && (
        <div className="flex lg:hidden xl:hidden flex-col h-auto">
          <RockPaperScissorsGame handlePlayCount={onPlayEnd} />
          <CoinTossGame handlePlayCount={onPlayEnd} />
        </div>
      )}
    </>
  );
};

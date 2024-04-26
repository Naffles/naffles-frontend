import { useState, useEffect } from "react";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm } from "@components/shared/AuthForms";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import DemoPointsLeaderboards from "./DemoPointsLeaderboards";
import useScreenSize from "@hook/useScreenSize";
import { RockPaperScissorsGame, CoinTossGame } from "./Games";

const DAILY_PLAYS_THRESHOLD = 20;

export const GameSection = () => {
  const { user } = useBasicUser();
  const { isMobile } = useScreenSize();
  const [openModal, setOpenModal] = useState(false);
  const [playsToday, setPlaysToday] = useState(0);

  useEffect(() => {
    // getting stored value
    const saved = localStorage.getItem("daily-plays");
    const initialValue = saved ? Number(JSON.parse(saved)) : 0;
    setPlaysToday(initialValue);
  }, []);

  useEffect(() => {
    if (playsToday > DAILY_PLAYS_THRESHOLD) {
      setOpenModal(true);
    }
  }, [playsToday]);

  const onPlayEnd = () => {
    setPlaysToday((plays) => plays + 1);
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
          <RockPaperScissorsGame handlePlayCount={onPlayEnd} />
          <CoinTossGame handlePlayCount={onPlayEnd} />
        </div>
        <div className="flex-col flex stats-container bg-nafl-grey-700 rounded-3xl xl:mt-0 lg:mt-[100px]">
          <DemoPointsLeaderboards />
        </div>
      </div>
      {
        isMobile && (
          <div className="flex lg:hidden xl:hidden flex-col h-auto">
            <RockPaperScissorsGame handlePlayCount={onPlayEnd} />
            <CoinTossGame handlePlayCount={onPlayEnd} />
          </div>
        )
      }
    </>
  );
};

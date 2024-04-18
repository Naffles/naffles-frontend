import { useState, useEffect, useCallback } from "react";
import { CoinToss } from "@components/CoinToss";
import { RockPaperScissors } from "@components/RockPaperScissors";
import { Modal } from "@components/shared/Modal";
import { RegistrationForm } from "@components/shared/AuthForms";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import DemoPointsLeaderboards from "./DemoPointsLeaderboards";

const DAILY_PLAYS_THRESHOLD = 20;
const GAME_START_SECS = 5;

const handChoices = ["rock", "paper", "scissors"];
const coinChoices = ["heads", "tails"];

export const GameSection = () => {
  const { user, addPoints } = useBasicUser();
  // const { user, addPoints } = useBasicUser();
  const [timeleft, setTimeleft] = useState(GAME_START_SECS);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [rpsResult, setRPSResult] = useState("");
  const [cointossResult, setCointossResult] = useState("");
  const [rpsLocked, setRPSLocked] = useState(false);
  const [coinLocked, setCoinLocked] = useState(false);
  const [rpsPoints, setRPSPoints] = useState(0);
  const [coinPoints, setCoinPoints] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [playsToday, setPlaysToday] = useState(0);

  useEffect(() => {
    // getting stored value
    const saved = localStorage.getItem("daily-plays");
    const initialValue = saved ? Number(JSON.parse(saved)) : 0;
    setPlaysToday(initialValue);
  }, []);

  const triggerRPSGame = useCallback(async () => {
    if (!rpsLocked) return;
    const {
      data: { data },
    } = await axios.post("game/demo/rock-paper-scissors");
    setRPSResult(data.result);
    setCoinPoints(data?.score || 0);
  }, [rpsLocked]);

  const triggerCoinTossGame = useCallback(async () => {
    if (!coinLocked) return;
    const {
      data: { data },
    } = await axios.post("game/demo/cointoss");
    setCointossResult(data.result);
    setRPSPoints(data?.score || 0);
  }, [coinLocked]);

  const testTrigger = useCallback(() => {
    triggerRPSGame();
    triggerCoinTossGame();
    setIsCountingDown(false);
    setPlaysToday((prevPlays) => {
      const plays = prevPlays + 1;
      localStorage.setItem("daily-plays", plays.toString());
      if (plays >= DAILY_PLAYS_THRESHOLD) {
        setOpenModal(true);
      }
      return plays;
    });
  }, [triggerCoinTossGame, triggerRPSGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingDown && timeleft > 0) {
      interval = setInterval(() => {
        if (timeleft <= 1) {
          testTrigger();
          clearInterval(interval);
        }
        setTimeleft((t) => t - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCountingDown, testTrigger, timeleft]);

  const handlePlayClick = () => {
    if (!isCountingDown) {
      setRPSPoints(0);
      setCoinPoints(0);
      setIsCountingDown(true);
      setTimeleft(GAME_START_SECS);
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
      <div className="flex-row flex justify-center gamezone-container gap-4 pt-8 md:hidden sm:hidden xs:hidden lg:flex">
        <div className="flex-col flex games-container gap-8">
          <RockPaperScissors
            timeleft={timeleft}
            result={rpsResult}
            isLocked={rpsLocked}
            onChoice={() => {
              setRPSLocked(true);
              handlePlayClick();
            }}
            choices={handChoices}
            triggerUnlock={() => {
              setRPSLocked(false);
              addPoints(rpsPoints);
            }}
          />
          <CoinToss
            timeleft={timeleft}
            result={cointossResult}
            isLocked={coinLocked}
            onChoice={() => {
              setCoinLocked(true);
              handlePlayClick();
            }}
            choices={coinChoices}
            triggerUnlock={() => {
              setCoinLocked(false);
              addPoints(coinPoints);
            }}
          />
        </div>
        <div className="flex-col flex stats-container bg-nafl-grey-700 rounded-3xl">
          <DemoPointsLeaderboards />
        </div>
      </div>
      <div className="md:flex sm:flex xs:flex lg:hidden flex-col h-auto">
        <RockPaperScissors
          timeleft={timeleft}
          result={rpsResult}
          isLocked={rpsLocked}
          onChoice={() => {
            setRPSLocked(true);
            handlePlayClick();
          }}
          choices={handChoices}
          triggerUnlock={() => {
            setRPSLocked(false);
            addPoints(rpsPoints);
          }}
        />
        <CoinToss
          timeleft={timeleft}
          result={cointossResult}
          isLocked={coinLocked}
          onChoice={() => {
            setCoinLocked(true);
            handlePlayClick();
          }}
          choices={coinChoices}
          triggerUnlock={() => {
            setCoinLocked(false);
            addPoints(coinPoints);
          }}
        />
        {/* <div className="h-auto ">
          <DemoPointsLeaderboards />
        </div> */}
      </div>
    </>
  );
};

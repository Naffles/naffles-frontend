import { useState, useEffect } from "react";
import { CoinToss } from "@components/CoinToss";
import { RockPaperScissors } from "@components/RockPaperScissors";
import { Button } from "@components/shared/Button";
import { Modal } from "@components/shared/Modal";
import { BetForm } from "./BetForm";

export const GameSection = () => {
  const [timeleft, setTimeleft] = useState(25);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [winningHand, setWinningHand] = useState("");
  const [winningFace, setWinningFace] = useState("");
  const [rpsLocked, setRPSLocked] = useState(false);
  const [coinLocked, setCoinLocked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalGame, setModalGame] = useState("rps");

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
  }, [isCountingDown, timeleft]);

  const testTrigger = () => {
    const rndNum = Math.random();
    setRPSLocked((isLocked) => {
      if (isLocked) {
        const handResult = ["rock", "paper", "scissors"][
          Math.floor(rndNum * 3)
        ];
        setWinningHand(handResult);
      }
      return false;
    });
    setCoinLocked((isLocked) => {
      if (isLocked) {
        const faceResult = ["heads", "tails"][Math.floor(rndNum * 2)];
        setWinningFace(faceResult);
      }
      return false;
    });
    setIsCountingDown(false);
  };

  const handlePlayClick = () => {
    setIsCountingDown(true);
    setTimeleft(5);
  };

  const betFormSubmit = () => {
    if (modalGame === "rps") {
      setRPSLocked(true);
      setOpenModal(false);
    }
    if (modalGame === "coin") {
      setCoinLocked(true);
      setOpenModal(false);
    }
  };

  return (
    <>
      <div className="flex-row flex justify-center py-4">
        <Modal
          show={openModal}
          hideModal={() => setOpenModal(false)}
          title="Set bet amounts"
        >
          <BetForm onSubmit={betFormSubmit} />
        </Modal>
        <Button
          size="xl"
          variant={
            (rpsLocked || coinLocked) && !isCountingDown
              ? "secondary"
              : "tertiary"
          }
          label="Play"
          onClick={handlePlayClick}
        >
          Play Now
        </Button>
      </div>
      <div className="flex-row flex justify-center gamezone-container gap-4">
        <div className="flex-col flex games-container gap-8">
          <RockPaperScissors
            timeleft={timeleft}
            winningChoice={winningHand}
            isLocked={rpsLocked}
            onChoice={() => {
              setOpenModal(true);
              setModalGame("rps");
            }}
          />
          <CoinToss
            timeleft={timeleft}
            winningChoice={winningFace}
            isLocked={coinLocked}
            onChoice={() => {
              setOpenModal(true);
              setModalGame("coin");
            }}
          />
        </div>
        <div className="flex-col flex stats-container w-[380px] bg-nafl-grey-700 rounded-3xl"></div>
      </div>
    </>
  );
};

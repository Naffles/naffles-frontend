import { useEffect, useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import toast from "react-hot-toast";

export const CoinTossGame = (props: GameContainerProps) => {
  const { onGameStart, onGameReset, isPaused, resetToInitial, onLimitReached, callGameResultModal } =
    props;
  const { setPoints } = useBasicUser();
  const [displayPoints, setDisplayPoints] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [changeGameText, setChangeGameText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeGameText(prevState => !prevState);
    }, 5000);

    return () => clearInterval(interval);
  }, []); 

  const triggerCoinTossGame = useCallback(
    async (choice?: string) => {
      setHasError(false);
      onGameStart?.(choice);
      try {
        const {
          data: { data },
        } = await axios.post("game/demo/cointoss");
        setDisplayPoints(data?.score || 0);
        return data;
      } catch (error: any) {
        setHasError(true);
        if (error.response.data.statusCode === 429) {
          alert(error.response.data.message);
          onLimitReached();
          throw error;
        } else {
          alert("An error occurred while playing Coin toss");
        }
      }
    },
    [onGameStart, onLimitReached]
  );

  const handleVideoEnd = (hasSelected?: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
    }
  };

  return (
    <BaseGame
      resetToInitial={resetToInitial}
      results={["win", "lose"]}
      choices={["heads", "tails"]}
      variants={[1, 2, 3, 4]}
      basePath="/static/coin-toss/"
      extension="webm"
      barColor="bg-nafl-purple"
      gameCall={triggerCoinTossGame}
      onChoiceClicked={onGameStart}
      onWinNotify={callGameResultModal}
      onVideoFinish={handleVideoEnd}
      onGameReset={onGameReset}
      isPaused={isPaused}
      hasError={hasError}
      initialTime={60}
      onCountdownStart={onGameStart}
      changeGameText={changeGameText}
      gameType="cointoss"
    />
  );
};

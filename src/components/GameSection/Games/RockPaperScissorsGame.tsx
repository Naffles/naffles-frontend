import { useEffect, useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import toast from "react-hot-toast";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
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

  const triggerRPSGame = useCallback(
    async (choice?: string) => {
      setHasError(false);
      onGameStart?.(choice);
      try {
        const {
          data: { data },
        } = await axios.post("game/demo/rock-paper-scissors");
        setDisplayPoints(data?.score || 0);
        return data;
      } catch (error: any) {
        setHasError(true);
        if (error.response.data.statusCode === 429) {
          onLimitReached();
          alert(error.response.data.message);
          throw error;
        } else {
          alert("An error occurred while playing RPS");
        }
      }
    },
    [onGameStart, onLimitReached]
  );

  const handleVideoEnd = (hasSelected: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
    }
    setHasError(false);
  };

  return (
    <BaseGame
      resetToInitial={resetToInitial}
      results={["win", "lose", "draw"]}
      choices={["rock", "paper", "scissors"]}
      variants={[1, 2, 3]}
      basePath="/static/rps/"
      extension="mp4"
      barColor="bg-nafl-aqua-500"
      gameCall={triggerRPSGame}
      onChoiceClicked={onGameStart}
      onWinNotify={callGameResultModal}
      onVideoFinish={handleVideoEnd}
      onGameReset={onGameReset}
      isPaused={isPaused}
      hasError={hasError}
      initialTime={30}
      onCountdownStart={onGameStart}
      changeGameText={changeGameText}
      gameType="rps"
    />
  );
};

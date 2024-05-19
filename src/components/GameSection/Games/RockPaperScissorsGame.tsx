import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import toast from "react-hot-toast";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const { onGameStart, onGameReset, isPaused, resetToInitial, onLimitReached } =
    props;
  const { setPoints } = useBasicUser();
  const [displayPoints, setDisplayPoints] = useState(0);
  const [hasError, setHasError] = useState(false);

<<<<<<< HEAD
  const triggerRPSGame = useCallback(async () => {
    onGameStart?.();
    try {
      const {
        data: { data },
      } = await axios.post("game/demo/rock-paper-scissors");
      setDisplayPoints(data?.score || 0);
      return data;
    } catch (error: any) {
      if (error.response.data.statusCode === 429) {
        onLimitReached();
        toast.error(error.response.data.message);
      } else {
        toast.success("An error occurred while playing RPS");
        onGameReset?.();
=======
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
>>>>>>> fb92a39e4c323328b7093f8cbe026c3cf396c161
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
      onWinNotify={() => alert("You won RPS")}
      onVideoFinish={handleVideoEnd}
      onGameReset={onGameReset}
      isPaused={isPaused}
      hasError={hasError}
      initialTime={30}
      onCountdownFinish={onGameStart}
      gameType="rps"
    />
  );
};

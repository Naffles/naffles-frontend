import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import toast from "react-hot-toast";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const { onGameStart, onGameReset, isPaused, onLimitReached } = props;
  const { setPoints } = useBasicUser();
  const [displayPoints, setDisplayPoints] = useState(0);

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
      }
    }
  }, [onGameReset, onGameStart, onLimitReached]);

  const handleVideoEnd = (hasSelected: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
    }
  };

  return (
    <BaseGame
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
      initialTime={30}
      onCountdownFinish={onGameStart}
    />
  );
};

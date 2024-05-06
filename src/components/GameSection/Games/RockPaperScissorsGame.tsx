import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const { handlePlayCount, onGameStart, onGameReset, isPaused, onLimitReached } = props;
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
      if (error.statusCode === 429) {
        onLimitReached();
        onGameReset?.();
      } else {
        alert("An error occurred while playing RPS");
        onGameReset?.();
      }
    }
  }, [onGameStart]);

  const handleVideoEnd = (hasSelected: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
      handlePlayCount?.(hasSelected);
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

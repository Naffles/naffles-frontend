import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const { handlePlayCount, onGameStart, onGameReset, isPaused } = props;
  const { addPoints } = useBasicUser();
  const [points, setPoints] = useState(0);

  const triggerRPSGame = useCallback(async () => {
    onGameStart?.();
    const {
      data: { data },
    } = await axios.post("game/demo/rock-paper-scissors");
    setPoints(data?.score || 0);
    return data;
  }, [onGameStart]);

  const handleVideoEnd = (hasSelected: boolean) => {
    if (hasSelected) {
      addPoints(points);
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
      onWinNotify={() => alert("You won RPS")}
      onVideoFinish={handleVideoEnd}
      onGameReset={onGameReset}
      isPaused={isPaused}
    />
  );
};

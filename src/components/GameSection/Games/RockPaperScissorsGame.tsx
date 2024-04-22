import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";

export const RockPaperScissorsGame = (props: GameContainerProps) => {
  const { handlePlayCount } = props;
  const { addPoints } = useBasicUser();
  const [points, setPoints] = useState(0);

  const triggerRPSGame = useCallback(async () => {
    const {
      data: { data },
    } = await axios.post("game/demo/rock-paper-scissors");
    setPoints(data?.score || 0);
    return data;
  }, []);

  const handleVideoEnd = () => {
    addPoints(points);
    handlePlayCount?.();
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
    />
  );
};

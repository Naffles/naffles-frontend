import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";

export const CoinTossGame = (props: GameContainerProps) => {
  const { handlePlayCount } = props;
  const { addPoints } = useBasicUser();
  const [points, setPoints] = useState(0);

  const triggerCoinTossGame = useCallback(async () => {
    const {
      data: { data },
    } = await axios.post("game/demo/cointoss");
    setPoints(data?.score || 0);
    return data;
  }, []);

  const handleVideoEnd = () => {
    addPoints(points);
    handlePlayCount?.();
  };

  return (
    <BaseGame
      results={["win", "lose"]}
      choices={["heads", "tails"]}
      variants={[1, 2, 3, 4]}
      basePath="/static/coin-toss/"
      extension="webm"
      barColor="bg-nafl-purple"
      gameCall={triggerCoinTossGame}
      onWinNotify={() => alert("You won Coin toss")}
      onVideoFinish={handleVideoEnd}
    />
  );
};

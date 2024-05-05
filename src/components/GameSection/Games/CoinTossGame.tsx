import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";

export const CoinTossGame = (props: GameContainerProps) => {
  const { handlePlayCount, onGameStart, onGameReset, isPaused } = props;
  const { setPoints } = useBasicUser();
  const [displayPoints, setDisplayPoints] = useState(0);

  const triggerCoinTossGame = useCallback(async () => {
    onGameStart?.();
    const {
      data: { data },
    } = await axios.post("game/demo/cointoss");
    setDisplayPoints(data?.score || 0);
    return data;
  }, [onGameStart]);

  const handleVideoEnd = (hasSelected?: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
      handlePlayCount?.(hasSelected);
    }
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
      onChoiceClicked={onGameStart}
      onWinNotify={() => alert("You won Coin toss")}
      onVideoFinish={handleVideoEnd}
      onGameReset={onGameReset}
      isPaused={isPaused}
      initialTime={90}
    />
  );
};

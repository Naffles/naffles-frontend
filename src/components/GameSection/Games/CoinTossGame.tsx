import { useState, useCallback } from "react";
import { BaseGame } from "./BaseGame";
import axios from "@components/utils/axios";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";
import { GameContainerProps } from "@type/GameSection";
import toast from "react-hot-toast";

export const CoinTossGame = (props: GameContainerProps) => {
  const { onGameStart, onGameReset, isPaused, onLimitReached } = props;
  const { setPoints } = useBasicUser();
  const [displayPoints, setDisplayPoints] = useState(0);

  const triggerCoinTossGame = useCallback(async () => {
    onGameStart?.();
    try {
      const {
        data: { data },
      } = await axios.post("game/demo/cointoss");
      setDisplayPoints(data?.score || 0);
      return data;
    } catch (error: any) {
      if (error.response.data.statusCode === 429) {
        toast.error(error.response.data.message);
        onLimitReached();
      } else {
        toast.success("An error occurred while playing Coin toss");
        onGameReset?.();
      }
    }
  }, [onGameReset, onGameStart, onLimitReached]);

  const handleVideoEnd = (hasSelected?: boolean) => {
    if (hasSelected) {
      setPoints(displayPoints);
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
      onCountdownFinish={onGameStart}
    />
  );
};

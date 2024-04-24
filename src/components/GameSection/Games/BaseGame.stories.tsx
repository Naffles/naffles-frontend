import { BaseGame } from "./BaseGame";

const meta = {
  title: "Components/GameSection/BaseGame",
  component: BaseGame,
};

export default meta;

export const RockPaperScissors = {
  args: {
    results: ["win", "lose", "draw"],
    choices: ["rock", "paper", "scissors"],
    variants: [1, 2, 3],
    basePath: "/static/rps/",
    extension: "mp4",
    barColor: "bg-nafl-aqua-500",
    onWinNotify: () => alert("You won RPS"),
  },
};

export const CoinToss = {
  args: {
    results: ["win", "lose"],
    choices: ["heads", "tails"],
    variants: [1, 2, 3],
    basePath: "/static/coin-toss/",
    extension: "webm",
    barColor: "bg-nafl-purple",
    onWinNotify: () => alert("You won Coin toss"),
  },
};

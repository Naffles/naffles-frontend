import { create } from "zustand";

interface GameState {
  screen:
    | "main"
    | "create"
    | "createNafflings"
    | "joining"
    | "accepting"
    | "ingame";
  mode: "challenger" | "host" | null;
  type: "Rock, Paper, Scissors" | "Coin Toss" | null;
  gameId: string | null;
  coinType: string;
  creatorBuyIn: string;
  challengerBuyIn: string;
  payout: string;
  betOdds: string;
  challengerId: string | null;
  defaultChosen: string | null;
  changingBet: boolean;
}

interface GameActions {
  setScreen: (
    screen:
      | "main"
      | "create"
      | "createNafflings"
      | "joining"
      | "accepting"
      | "ingame"
  ) => void;
  setMode: (mode: "challenger" | "host" | null) => void;
  setType: (type: "Rock, Paper, Scissors" | "Coin Toss" | null) => void;
  setGameId: (gameId: string | null) => void;
  setCoinType: (coinType: string) => void;
  setCreatorBuyIn: (creatorBuyIn: string) => void;
  setChallengerBuyIn: (challengerBuyIn: string) => void;
  setPayout: (payout: string) => void;
  setBetOdds: (betOdds: string) => void;
  setChallengerId: (challengerId: string | null) => void;
  setDefaultChosen: (defaultChosen: string | null) => void;
  setChangingBet: (changingBet: boolean) => void;
}

const initialState: Omit<GameState, "user"> = {
  screen: "main",
  mode: null,
  type: null,
  gameId: null,
  coinType: "",
  creatorBuyIn: "",
  challengerBuyIn: "",
  payout: "",
  betOdds: "",
  challengerId: null,
  defaultChosen: null,
  changingBet: false,
};

const useGame = create<GameState & GameActions>((set) => ({
  ...initialState,
  setScreen: (screen) => set(() => ({ screen })),
  setMode: (mode) => set(() => ({ mode })),
  setType: (type) => set(() => ({ type })),
  setGameId: (gameId) => set(() => ({ gameId })),
  setCoinType: (coinType) => set(() => ({ coinType })),
  setCreatorBuyIn: (creatorBuyIn) => set(() => ({ creatorBuyIn })),
  setChallengerBuyIn: (challengerBuyIn) => set(() => ({ challengerBuyIn })),
  setPayout: (payout) => set(() => ({ payout })),
  setBetOdds: (betOdds) => set(() => ({ betOdds })),
  setChallengerId: (challengerId) => set(() => ({ challengerId })),
  setDefaultChosen: (defaultChosen) => set(() => ({ defaultChosen })),
  setChangingBet: (changingBet) => set(() => ({ changingBet })),
}));

export default useGame;

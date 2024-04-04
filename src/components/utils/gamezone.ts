import { create } from "zustand";

interface GameState {
  screen: "main" | "create" | "ingame";
  mode: "challenger" | "host" | null;
  type: string | null;
  gameId: string | null;
}

interface GameActions {
  setScreen: (screen: "main" | "create" | "ingame") => void;
  setMode: (mode: "challenger" | "host") => void;
  setType: (type: string | null) => void;
  setGameId: (gameId: string | null) => void;
}

const initialState: Omit<GameState, "user"> = {
  screen: "main",
  mode: null,
  type: null,
  gameId: null,
};

const useGame = create<GameState & GameActions>((set) => ({
  ...initialState,
  setScreen: (screen) => set(() => ({ screen })),
  setMode: (mode) => set(() => ({ mode })),
  setType: (type) => set(() => ({ type })),
  setGameId: (gameId) => set(() => ({ gameId })),
}));

export default useGame;

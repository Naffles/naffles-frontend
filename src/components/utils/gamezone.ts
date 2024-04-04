import { create } from "zustand";

interface GameState {
  screen: string;
  mode: "challenger" | "host" | null;
  type: string | null;
}

interface GameActions {
  setScreen: (screen: string) => void;
  setMode: (mode: "challenger" | "host") => void;
  setType: (type: string | null) => void;
}

const initialState: Omit<GameState, "user"> = {
  screen: "main",
  mode: null,
  type: null,
};

const useGame = create<GameState & GameActions>((set) => ({
  ...initialState,
  setScreen: (screen) => set(() => ({ screen })),
  setMode: (mode) => set(() => ({ mode })),
  setType: (type) => set(() => ({ type })),
}));

export default useGame;

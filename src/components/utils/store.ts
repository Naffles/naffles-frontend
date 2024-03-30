import { create } from "zustand";

interface StoreState {
  isOpen: boolean;
  emailAddress: string;
}

interface StoreActions {
  setIsOpen: (isOpen: boolean) => void;
  setEmailAddress: (emailAddress: string) => void;
}

const initialState: Omit<StoreState, "user"> = {
  isOpen: false,
  emailAddress: "",
};

const useStore = create<StoreState & StoreActions>((set) => ({
  ...initialState,
  user: null,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  setEmailAddress: (emailAddress) => set(() => ({ emailAddress })),
}));

export default useStore;
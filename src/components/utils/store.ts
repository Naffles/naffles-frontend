import { create } from "zustand";

interface StoreState {
  isOpen: boolean;
  isDepositOpen: boolean;
  emailAddress: string;
}

interface StoreActions {
  setIsOpen: (isOpen: boolean) => void;
  setIsDepositOpen: (isDepositOpen: boolean) => void;
  setEmailAddress: (emailAddress: string) => void;
}

const initialState: Omit<StoreState, "user"> = {
  isOpen: false,
  isDepositOpen: false,
  emailAddress: "",
};

const useStore = create<StoreState & StoreActions>((set) => ({
  ...initialState,
  user: null,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  setIsDepositOpen: (isDepositOpen) => set(() => ({ isDepositOpen })),
  setEmailAddress: (emailAddress) => set(() => ({ emailAddress })),
}));

export default useStore;
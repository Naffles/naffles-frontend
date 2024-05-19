"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "@hook/useLocalStorage";
import axios from "@components/utils/axios";
import unixToString from "@components/utils/unixToString";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type LoginParams = {
  identifier: string;
  password: string;
};

type WalletLoginParams = {
  signature: string;
  address: string;
  timestamp: string;
  walletType: string;
  network: string;
};

// Define the type for the user
type BasicUser = Record<string, any>;
type PointsObject = {
  points: number;
  date: number;
};
// Define the type for the user context.
type BasicUserContextType = {
  user: BasicUser | null;
  jwt: string | null;
  points: number;
  addPoints: (points: number) => void;
  setPoints: (points: number) => void;
  login: (data: LoginParams) => Promise<Record<string, any>> | void;
  logout: () => void;
  reloadProfile: () => Record<string, any> | void;
  updateProfile: (form: FormData) => void;
  loginWithWallet: (data: WalletLoginParams) => Record<string, any> | void;
};

// // Create a context for user data.
const BasicUserContext = createContext<BasicUserContextType>({
  user: null,
  jwt: null,
  points: 0,
  addPoints: (points) => {},
  setPoints: (points) => {},
  login: (data) => {},
  logout: () => {},
  reloadProfile: () => {},
  updateProfile: (form) => {},
  loginWithWallet: (data) => {},
});

// Custom hook for accessing user context data.
export const useBasicUser = () => useContext(BasicUserContext);

// Provider component that wraps parts of the app that need user context.
export const BasicUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jwt, setJWT, removeJWT] = useLocalStorage("naffles-auth", "", {
    initializeWithValue: false,
  });
  const [user, setUser, removeUser] = useLocalStorage<BasicUser | null>(
    "naffles-user",
    null,
    { initializeWithValue: false }
  );

  const [pointsObject, setPointsObject, removePoints] =
    useLocalStorage<PointsObject | null>("naffles-points", null, {
      initializeWithValue: false,
    });

  const addPoints = useCallback(
    (addedPoints: number) => {
      setPointsObject((points) => {
        if (points?.date) {
          const currentDateNumber = Date.now();
          const currentDate = unixToString(currentDateNumber);
          const previousDate = unixToString(points.date);
          if (previousDate === currentDate) {
            const currentPoints = points?.points || 0;
            return {
              points: currentPoints + addedPoints,
              date: currentDateNumber,
            };
          }
        }
        return { points: addedPoints, date: Date.now() };
      });
    },
    [setPointsObject]
  );

  const setPoints = useCallback(
    (points: number) => {
      setPointsObject((pointsObject) => {
        if (pointsObject?.date) {
          const currentDateNumber = Date.now();
          const currentDate = unixToString(currentDateNumber);
          const previousDate = unixToString(pointsObject.date);
          if (previousDate === currentDate) {
            return {
              points,
              date: currentDateNumber,
            };
          }
        }
        return { points, date: Date.now() };
      });
    },
    [setPointsObject]
  );

  const login = useCallback(
    async ({ identifier, password }: LoginParams) => {
      const {
        data: { data },
      } = await axios.post("user/login", {
        identifier,
        password,
      });
      setJWT(data?.token ?? null);
      console.log("data:", data);
      return data;
    },
    [setJWT]
  );

  const logout = useCallback(() => {
    removeJWT();
    removeUser();
    removePoints();
  }, [removeJWT, removeUser, removePoints]);

  const reloadProfile = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await axios.get("user/profile");
      setUser(data ?? null);
      setPointsObject({ points: data?.temporaryPoints || 0, date: Date.now() });
      return data;
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error(err.response.data.message);
        logout();
      }
      throw err;
    }
  }, [setUser, setPointsObject, logout]);

  const updateProfile = useCallback(
    async (form: FormData) => {
      try {
        const {
          data: { data },
        } = await axios.patch("user/profile", form);
        setUser(data ?? null);
        setPointsObject({
          points: data?.temporaryPoints || 0,
          date: Date.now(),
        });
        toast.success("Profile updated successfully!");
        return data;
      } catch (error: any) {
        const errorData = error.response?.data;
        toast.error(`Error updating profile: ${errorData.message}`);
      }
    },
    [setUser, setPointsObject]
  );

  const loginWithWallet = useCallback(
    async (data: WalletLoginParams) => {
      try {
        const validResponse = await axios.post("user/login/wallet", data);

        console.log("WALLET LOGIN RESULT:", validResponse);
        if (validResponse.status === 200 || validResponse.status === 201) {
          setJWT(validResponse.data?.data?.token ?? null);
          toast.success("Successfully logged in using wallet!");
        } else toast.error("Login with wallet failed, please try again!");
      } catch (error: any) {
        const errorData = error.response?.data;
        toast.error(`Error on Wallet Login: ${errorData.message}`);
      }
    },
    [setUser]
  );

  useEffect(() => {
    if (jwt) {
      reloadProfile();
    }
  }, [jwt, reloadProfile]);

  const contextValue = useMemo(() => {
    const points = pointsObject?.points ?? 0;
    return {
      jwt,
      user,
      points,
      addPoints,
      setPoints,
      login,
      logout,
      reloadProfile,
      updateProfile,
      loginWithWallet,
    };
  }, [
    jwt,
    user,
    login,
    logout,
    reloadProfile,
    updateProfile,
    loginWithWallet,
    pointsObject,
    addPoints,
    setPoints,
  ]);

  return (
    <BasicUserContext.Provider value={contextValue}>
      {children}
    </BasicUserContext.Provider>
  );
};

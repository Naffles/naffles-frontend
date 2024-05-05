"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useLocalStorage } from "@hook/useLocalStorage";
import axios from "@components/utils/axios";
import unixToString from "@components/utils/unixToString";

type LoginParams = {
  identifier: string;
  password: string;
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
  login: (data: LoginParams) => Record<string, any> | void;
  logout: () => void;
  reloadProfile: () => Record<string, any> | void;
  updateProfile: (form: FormData) => void;
};

// // Create a context for user data.
const BasicUserContext = createContext<BasicUserContextType>({
  user: null,
  jwt: null,
  points: 0,
  addPoints: (points) => {},
  login: (data) => {},
  logout: () => {},
  reloadProfile: () => {},
  updateProfile: (form) => {},
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
  const [pointsObject, setPoints, removePoints] =
    useLocalStorage<PointsObject | null>("naffles-points", null, {
      initializeWithValue: false,
    });

  const addPoints = useCallback(
    (addedPoints: number) => {
      setPoints((points) => {
        localStorage.removeItem('naffles-points');
        // if (points?.date) {
        //   const currentDateNumber = Date.now();
        //   const currentDate = unixToString(currentDateNumber);
        //   const previousDate = unixToString(points.date);
        //   if (previousDate === currentDate) {
        //     const currentPoints = points?.points || 0;
        //     return {
        //       points: currentPoints + addedPoints,
        //       date: currentDateNumber,
        //     };
        //   }
        // }
        return { points: addedPoints, date: Date.now() };
      });
    },
    [setPoints]
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

  const reloadProfile = useCallback(async () => {
    const {
      data: { data },
    } = await axios.get("user/profile");
    setUser(data ?? null);
    setPoints({ points: data?.temporaryPoints || 0, date: Date.now() });
    return data;
  }, [setUser, setPoints]);

  const updateProfile = useCallback(
    async (form: FormData) => {
      const {
        data: { data },
      } = await axios.patch("user/profile", form);
      setUser(data ?? null);
      setPoints({ points: data?.temporaryPoints || 0, date: Date.now() });
      return data;
    },
    [setUser, setPoints]
  );

  useEffect(() => {
    if (jwt) {
      reloadProfile();
    }
  }, [jwt, reloadProfile]);

  const logout = useCallback(() => {
    removeJWT();
    removeUser();
    removePoints();
  }, [removeJWT, removeUser, removePoints]);

  const contextValue = useMemo(() => {
    const points = pointsObject?.points ?? 0;
    return {
      jwt,
      user,
      points,
      addPoints,
      login,
      logout,
      reloadProfile,
      updateProfile,
    };
  }, [
    jwt,
    user,
    login,
    logout,
    reloadProfile,
    updateProfile,
    pointsObject,
    addPoints,
  ]);

  return (
    <BasicUserContext.Provider value={contextValue}>
      {children}
    </BasicUserContext.Provider>
  );
};

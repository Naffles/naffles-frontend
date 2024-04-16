"use client";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@hook/useLocalStorage";
import axios from "@components/utils/axios";

// Define the type for the user
type BasicUser = Record<string, any>;
// Define the type for the user context.
type BasicUserContextType = {
  user: BasicUser | null;
  jwt: string | null;
  login: (data: LoginParams) => Record<string, any> | void;
  logout: () => void;
};

// Create a context for user data.
const BasicUserContext = createContext<BasicUserContextType>({
  user: null,
  jwt: null,
  login: (data) => {},
  logout: () => {},
});

// Custom hook for accessing user context data.
export const useBasicUser = () => useContext(BasicUserContext);

type LoginParams = {
  identifier: string;
  password: string;
};

// Provider component that wraps parts of the app that need user context.
export const BasicUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jwt, setJWT, removeJWT] = useLocalStorage("naffles-auth", "");
  const [user, setUser, removeUser] = useLocalStorage<BasicUser | null>(
    "naffles-user",
    null
  );

  const login = useCallback(
    async ({ identifier, password }: LoginParams) => {
      const {
        data: { data },
      } = await axios.post("user/login", {
        identifier,
        password,
      });
      setUser(data?.user);
      setJWT(data?.token);
      return data;
    },
    [setJWT, setUser]
  );
  const logout = useCallback(() => {
    removeJWT();
    removeUser();
  }, [removeJWT, removeUser]);

  const contextValue = useMemo(() => {
    return { jwt, user, login, logout };
  }, [jwt, user, login, logout]);

  return (
    <BasicUserContext.Provider value={contextValue}>
      {children}
    </BasicUserContext.Provider>
  );
};

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMagic } from "./MagicProvider";
import { io, Socket } from "socket.io-client";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

// Define the type for the user
type User = {
  address: string | null;
  jwt: string | null;
  id: string | null;
  name: string | null;
  image: string | null;
  points: number;
};

// Define the type for the user context.
type UserContextType = {
  user: User | null;
  socket: Socket | null;
  socketId: string | null;
  setProfileName: (name: string | null) => void;
  setProfileImage: (imgURL: string | null) => void;
  setJWT: (jwt: string | null) => void;
  setId: (id: string | null) => void;
  setWalletAddress: (id: string | null) => void;
};

// Create a context for user data.
const UserContext = createContext<UserContextType>({
  user: null,
  socket: null,
  socketId: null,
  setProfileName: () => {},
  setProfileImage: () => {},
  setJWT: () => {},
  setId: () => {},
  setWalletAddress: () => {},
});

// Custom hook for accessing user context data.
export const useUser = () => useContext(UserContext);

// Provider component that wraps parts of the app that need user context.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the web3 context.
  // const { web3, magic } = useMagic();

  // Initialize user state to hold user's account information.
  const [address, setAddress] = useState<string | null>(null);
  const [userJWT, setUserJWT] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const [userPoints, setUserPoints] = useState<number>(0);

  const { jwt, user } = useBasicUser();

  // Run fetchUserAccount function whenever the web3 instance changes.

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_ENDPOINT}`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    console.log("socket", socket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    console.log("basic user context data:", jwt, user);

    !userJWT && jwt && setUserJWT(jwt);
    !userId && user?.id && setUserId(user?.id);
    !profileName && user?.username && setProfileName(user?.username);
    !userPoints && user?.temporaryPoints && setUserPoints(user.temporaryPoints);
  }, [jwt, user]);

  useEffect(() => {
    userId && socket?.emit("register", { userId: userId });
    const setIntoSocketId = (data: any) => {
      setSocketId(data.userId);
    };
    socket?.on("registered", setIntoSocketId);

    const setPoints = (data: any) => {
      setUserPoints(data);
    };

    socket?.on("realtimePoints", setPoints);

    return () => {
      socket?.off("registered", setIntoSocketId);
      socket?.off("realtimePoints", setPoints);
    };
  }, [userId, socket]);

  return (
    <UserContext.Provider
      value={{
        user:
          userJWT && userId
            ? {
                address: address,
                jwt: userJWT,
                id: userId,
                name: profileName,
                image: profileImage,
                points: userPoints,
              }
            : null,
        socket: socket,
        socketId: socketId,
        setProfileName: setProfileName,
        setProfileImage: setProfileImage,
        setJWT: setUserJWT,
        setId: setUserId,
        setWalletAddress: setAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

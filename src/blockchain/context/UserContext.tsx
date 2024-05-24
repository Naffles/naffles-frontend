"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useBasicUser } from "@components/context/BasicUser/BasicUser";

// Define the type for the user
type Balance = {
  id: string;
  tokenType: string;
  amount: string;
  conversion: string;
};

// Define the type for the user
type User = {
  address: string | null;
  jwt: string | null;
  id: string | null;
  name: string | null;
  image: string | null;
  points: number;
  balances: Balance[] | null;
};

// Define the type for the user context.
type UserContextType = {
  user: User | null;
  socket: Socket | null;
  socketId: string | null;
  showDepositModal: boolean;
  showWithdrawModal: boolean;
  setProfileName: (name: string | null) => void;
  setProfileImage: (imgURL: string | null) => void;
  setJWT: (jwt: string | null) => void;
  setId: (id: string | null) => void;
  setWalletAddress: (id: string | null) => void;
  setShowDepositModal: (showDepositModal: boolean) => void;
  setShowWithdrawModal: (showWithdrawModal: boolean) => void;
};

// Create a context for user data.
const UserContext = createContext<UserContextType>({
  user: null,
  socket: null,
  socketId: null,
  showDepositModal: false,
  showWithdrawModal: false,
  setProfileName: () => {},
  setProfileImage: () => {},
  setJWT: () => {},
  setId: () => {},
  setWalletAddress: () => {},
  setShowDepositModal: () => {},
  setShowWithdrawModal: () => {},
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
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [userBalances, setUserBalances] = useState<Balance[] | null>(null);

  const { jwt, user, reloadProfile } = useBasicUser();

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
    user?.userBalance && setUserBalances(user?.userBalance);
  }, [jwt, user]);

  useEffect(() => {
    userId && socket?.emit("register", { userId: userId });
    const setIntoSocketId = (data: any) => {
      setSocketId(data.userId);
    };
    socket?.on("registered", setIntoSocketId);

    // const setPoints = (data: any) => {
    //   setUserPoints(data);
    // };

    // socket?.on("realtimePoints", setPoints);

    const tokenBalanceUpdate = (data: any) => {
      if (data) {
        reloadProfile();
      }
    };

    socket?.on("updateTokenBalance", tokenBalanceUpdate);

    return () => {
      socket?.off("registered", setIntoSocketId);
      // socket?.off("realtimePoints", setPoints);
      socket?.off("updateTokenBalance", tokenBalanceUpdate);
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
                balances: userBalances,
              }
            : null,
        socket: socket,
        socketId: socketId,
        showDepositModal: showDepositModal,
        showWithdrawModal: showWithdrawModal,
        setProfileName: setProfileName,
        setProfileImage: setProfileImage,
        setJWT: setUserJWT,
        setId: setUserId,
        setWalletAddress: setAddress,
        setShowDepositModal: setShowDepositModal,
        setShowWithdrawModal: setShowWithdrawModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

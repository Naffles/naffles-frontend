"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMagic } from "./MagicProvider";
import { io, Socket } from "socket.io-client";

// Define the type for the user
type User = {
  address: string | null;
  jwt: string | null;
  id: string | null;
  name: string | null;
  image: string | null;
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
  fetchUser: () => Promise<void>;
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
  fetchUser: async () => {},
});

// Custom hook for accessing user context data.
export const useUser = () => useContext(UserContext);

// Provider component that wraps parts of the app that need user context.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the web3 context.
  const { web3, magic } = useMagic();

  // Initialize user state to hold user's account information.
  const [address, setAddress] = useState<string | null>(null);
  const [userJWT, setUserJWT] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>("");

  // Function to retrieve and set user's account.
  const fetchUserAccount = async () => {
    // Use Web3 to get user's accounts.
    const accounts = await web3?.eth.getAccounts();

    // Update the user state with the first account (if available), otherwise set to null.
    setAddress(accounts ? accounts[0] : null);
  };

  // Run fetchUserAccount function whenever the web3 instance changes.
  useEffect(() => {
    fetchUserAccount();
  }, [web3]);

  useEffect(() => {
    if (!magic?.user) return;
    getUserData();
  }, [magic]);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_ENDPOINT}`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    console.log("socket", socket);

    userId && newSocket
      ? newSocket?.emit("register", { userId: userId })
      : newSocket?.emit("register", { userId: "Anonymous" });

    newSocket?.on("registered", (data) => setSocketId(data.userId));

    return () => {
      newSocket.off("hello");
      newSocket.close();
    };
  }, []);

  const getUserData = async () => {
    const userInfo = await magic?.user.getInfo();
    console.log("userInfo:", userInfo);

    const idToken = await magic?.user.getIdToken();

    idToken && loginUsingDID(idToken);

    if (process.env.SERVER_SECRET && !idToken) {
      console.log("generated new idtoken");
      const newIdToken = await magic?.user.generateIdToken({
        attachment: process.env.SERVER_SECRET,
      });
      newIdToken && loginUsingDID(newIdToken);
    }
  };

  const loginUsingDID = async (DIDtoken: string | undefined) => {
    console.log("DIDtoken:", DIDtoken);
    try {
      let url = process.env.NEXT_PUBLIC_ENDPOINT + "user/login/wallet";

      await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
          Authorization: "Bearer " + DIDtoken,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((result) => {
          if (result) {
            console.log("wallet login result:", result);
            setUserJWT(result?.data?.token);
            setUserId(result?.data?.user?._id);
            console.log("wallet login id:", result?.data?.user?._id);
            // Cookies.set("token", result?.token, { expires: 7, secure: true });
          } else {
            console.log("error");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user:
          address && userJWT && userId
            ? {
                address: address,
                jwt: userJWT,
                id: userId,
                name: profileName,
                image: profileImage,
              }
            : null,
        socket: socket,
        socketId: socketId,
        setProfileName: setProfileName,
        setProfileImage: setProfileImage,
        setJWT: setUserJWT,
        setId: setUserId,
        fetchUser: fetchUserAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

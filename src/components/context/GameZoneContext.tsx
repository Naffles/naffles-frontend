"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the type for the user
type View = string;

// Define the type for the user context.
type GameZoneContextType = {
  selectedView: View | null;
};

// Create a context for user data.
export const GameZoneContext = createContext<GameZoneContextType>({
  selectedView: null,
});

// Provider component that wraps parts of the app that need user context.
export const GameZoneProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let queryString = window.location.search;

  useEffect(() => {
    // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    let mode = urlParams.get("mode");
    mode && setSelectedView(mode);
  }, [queryString]);

  const [selectedView, setSelectedView] = useState<string>("main");

  return (
    <GameZoneContext.Provider
      value={{
        selectedView: selectedView,
      }}
    >
      {children}
    </GameZoneContext.Provider>
  );
};

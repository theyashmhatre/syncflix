import React, { createContext, useContext, useState, useRef } from "react"

const AppStateContext = createContext();

export const useAppStateContext = () => {
  return useContext(AppStateContext);
}

export const AppStateProvider = ({ children }) => {
  const [isCreate, setIsCreate] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const videoLoaded = useRef(false);
  const [isVideo, setIsVideo] = useState(false);

  const state = {
    isCreate, setIsCreate, isJoin, setIsJoin, videoLoaded, isVideo, setIsVideo
  }

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
}

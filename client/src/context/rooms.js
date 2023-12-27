import React, { createContext, useContext, useRef, useState } from "react"

const RoomContext = createContext();

export const useRoomContext = () => {
  return useContext(RoomContext);
}

export const RoomProvider = ({ children }) => {
  const [messageList, setMessageList] = useState([]);
  const room = useRef("");
  const [usersList, setUsersList] = useState("");
  const state = {
    room,
    usersList,
    setUsersList,
    messageList,
    setMessageList
  }

  return (
    <RoomContext.Provider value={state}>
      {children}
    </RoomContext.Provider>
  );
}

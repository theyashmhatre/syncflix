import React, { createContext, useContext } from "react"

const RoomContext = createContext();

export const useRoomContext = () => {
  return useContext(RoomContext);
}

export const RoomProvider = ({ children }) => {
  const [messageList, setMessageList] = React.useState([]);
  const [roomID, setRoomID] = React.useState("");
  const state = {
    roomID,
    setRoomID,
    messageList,
    setMessageList
  }

  return (
    <RoomContext.Provider value={state}>
      {children}
    </RoomContext.Provider>
  );
}

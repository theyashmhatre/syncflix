import React, { createContext, useContext, useRef, useState } from "react"

const RoomContext = createContext();

export const useRoomContext = () => {
  return useContext(RoomContext);
}

export const RoomProvider = ({ children }) => {
  const [messageList, setMessageList] = useState([]);
  const room = useRef("");
  const [usersList, setUsersList] = useState("");
  const [lastSeekFromServer, setLastSeekFromServer] = useState("");
  const isAdmin = useRef(false);
  const [partyData, setPartyData] = useState({});


  const state = {
    room,
    usersList,
    setUsersList,
    messageList,
    setMessageList,
    lastSeekFromServer,
    setLastSeekFromServer,
    isAdmin,
    partyData,
    setPartyData
  }

  return (
    <RoomContext.Provider value={state}>
      {children}
    </RoomContext.Provider>
  );
}

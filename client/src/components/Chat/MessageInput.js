import { Box, Stack } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useRoomContext } from '../../context/rooms';
import { SocketContext } from '../../context/socket';
import { useAuth } from '../../context/auth';
import SendIcon from '@mui/icons-material/Send';

export default function MessageInput({setSentMsgCount}) {

  const [messageText, setMessageText] = useState("");
  const { room, messageList } = useRoomContext()
  const socket = useContext(SocketContext)
  const { user } = useAuth();

  function handleInput(e) {
    e.preventDefault();
    setMessageText(e.target.value)
  }

  function message_in_room(e) {
    if (!e.key || e.key === "Enter") {
      const userData = {
        "name": user.displayName,
        "email": user.email,
        "photoURL": user.photoURL
      }
      socket.emit("room message", { room: room.current, message: messageText, userData: userData, type: "chat" })
      messageList.push({ message: messageText, id: socket.id, userData: userData, type: "chat" })
      setSentMsgCount(prev => prev + 1);
      setMessageText("");
    }
  }

  return (
    <>
      <Box p="3px" bgcolor="white" position="fixed" bottom="0px" borderTop={"1px solid gray"}>
        <Stack direction="row" borderRadius="5px" p="5px" m="10px">

          <textarea onSubmit={message_in_room} onChange={handleInput} value={messageText} onKeyDown={message_in_room} placeholder='Your message...' style={{ border: "none", outline: 0, width: "15rem", resize: "none" }} />
          <SendIcon fontSize="medium" onClick={message_in_room} sx={{ alignSelf: "center", color: 'blue' }} />

        </Stack>
      </Box>
    </>
  )
}

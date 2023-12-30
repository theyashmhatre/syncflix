import { Box, Chip, Divider } from '@mui/material'
import React, { useContext } from 'react'
import OwnChatCard from './OwnChatCard'
import OtherChatCard from './OtherChatCard'
import { useRoomContext } from '../../context/rooms'
import { SocketContext } from '../../context/socket'
import { useAuth } from '../../context/auth'

export default function MessageList({ bottomRef }) {
  const { messageList } = useRoomContext()
  const socket = useContext(SocketContext)
  const { user } = useAuth();

  return (
    <>
      <Box>
        {messageList && messageList.map((msg, index) => {
          return (
            <div key={index}>
              <div>
                {msg.type === "chat" ?
                  msg.id === socket.id ?
                    <>
                      <OwnChatCard message={msg.message} id={user.displayName} userData={msg.userData} />
                      {messageList.length === index ? <></> : <Divider variant="middle" component="li" />}
                    </>
                    :
                    <>
                      <OtherChatCard message={msg.message} id={msg.id} userData={msg.userData} />
                      {messageList.length === index ? <></> : <Divider variant="middle" component="li" />}
                    </>
                  : msg.type === "remove" ?
                    <>
                      <p><Chip label={socket.id === msg.id ? `You removed ${msg.userData}` : msg.message} sx={{ fontSize: "11px" }} /></p>
                      <Divider variant="middle" component="li" />
                    </>
                    :
                    <>
                      <p><Chip label={msg.message} sx={{ fontSize: "11px" }} /></p>
                      <Divider variant="middle" component="li" />
                    </>}
              </div>
              <Box ref={bottomRef}></Box>
            </div>
          )
        })}
      </Box>
    </>
  )
}

import React, {useContext, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Button, Chip, Input, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import OwnChatCard from './Chat/OwnChatCard';
import OtherChatCard from './Chat/OtherChatCard';
import { SocketContext } from '../context/socket';
import { useRoomContext } from '../context/rooms';
import { useAuth } from '../context/auth';

const drawerWidth = 300;

export default function Sidebar() {

  const socket = useContext(SocketContext);
  var { room, messageList } = useRoomContext();
  const {user} = useAuth();
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef(null);
  const [sentMsgCount, setSentMsgCount] = useState(0)

  function handleInput(e) {
    e.preventDefault();
    setMessageText(e.target.value)
  }

  function message_in_room(e) {
    if (!e.key || e.key === "Enter"){
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
  

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList, sentMsgCount]);
  

  return (
    <Box sx={{ display: 'flex'}} zIndex={0}>  
      <CssBaseline /> 
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <List sx={{ width: '100%', mt: "6rem", mb:"3rem", maxWidth: 360 }}>
          <Box p="15px 5px" pl="10px" display="flex" textAlign="start" position="fixed" top="4rem" width="100%" bgcolor="white" zIndex="2">
            <Typography fontWeight="600" letterSpacing="0.5px">
                Chats
            </Typography>
              <Box borderRadius="5px" p="0px 8px" color="white" bgcolor="#8C52FF" ml="7px" display="inline-block">
              {messageList.length}
            </Box>
        </Box>
        <Box>
            {messageList && messageList.map((msg, index) => {
              return (
                <div key={index}>
                  <div>
                    {msg.type === "chat" ?
                      msg.id === socket.id ?
                        <>
                          <OwnChatCard message={msg.message} id={socket.id} userData={msg.userData} />
                          {messageList.length === index ? <></> : <Divider variant="middle" component="li" />}
                        </>
                        :
                        <>
                          <OtherChatCard message={msg.message} id={msg.id} userData={msg.userData} />
                          {messageList.length === index ? <></> : <Divider variant="middle" component="li" />}
                        </>
                      : <><p><Chip label={msg.message} sx={{ fontSize: "11px" }} /></p>
                       <Divider variant="middle" component="li" /></>}
                  </div>
                  <Box ref={bottomRef}></Box>
                </div>
              )
            })}
        </Box>

        </List>
        
        <Box p="3px" bgcolor="white" position="fixed" bottom="0px" borderRadius="5px 5px 0px 0px">
          <Stack direction="row"  borderRadius="5px" p="5px" m="10px">

            <textarea onSubmit={message_in_room} onChange={handleInput} value={messageText} onKeyDown={message_in_room} placeholder='Your message...' style={{ border: "none", outline: 0, width: "15rem", resize: "none" }} />
            <SendIcon fontSize="medium" onClick={message_in_room} sx={{ alignSelf: "center", color: 'blue' }} />

          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
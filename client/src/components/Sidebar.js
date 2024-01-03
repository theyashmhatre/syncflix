import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Badge, Button, Chip, Input, Stack } from '@mui/material';
import { SocketContext } from '../context/socket';
import { useRoomContext } from '../context/rooms';
import { useAuth } from '../context/auth';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import { grey } from '@mui/material/colors';
import MessageList from './Chat/MessageList';
import MessageInput from './Chat/MessageInput';
import UserList from './User/UserList';

const drawerWidth = 300;

export default function Sidebar() {

  var { messageList } = useRoomContext();
  const bottomRef = useRef(null);
  const [sentMsgCount, setSentMsgCount] = useState(0)
  const [sideSection, setSideSection] = useState("chat");

  function toggleSection(section) {
    setSideSection(section);
  }



  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList, sentMsgCount]);


  return (
    <Box sx={{ display: 'flex' }} zIndex={0}>
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
        <List sx={{ width: '100%', mt: "3.5rem", mb: "3rem", maxWidth: 360 }}>
          <Box position="sticky" top="4rem" width={drawerWidth} zIndex={3} >
            <Stack direction="row">
              <Box p="15px 0px" display="flex" borderBottom={sideSection === "chat" ? "" : "1px solid grey"} bgcolor={sideSection === "chat" ? "white" : grey[200]}
                justifyContent={'center'}
                width={"50%"}
                sx={{ ":hover": { cursor: "pointer" }, '&:hover .chat-icon': { color: sideSection === "people" ? "#8C52FF" : "gray" } }}
                onClick={(e) => toggleSection("chat")} >

                <ChatIcon className='chat-icon' sx={{ color: sideSection === "chat" ? "#8C52FF" : "gray" }} />
                {/* </Badge>  */}

              </Box>
              <Divider orientation="vertical" flexItem />
              <Box p="15px 5px" display="flex" borderBottom={sideSection === "people" ? "" : "1px solid grey"} textAlign="start" bgcolor={sideSection === "people" ? "white" : grey[300]} justifyContent={'center'} width={"50%"} onClick={(e) => toggleSection("people")} sx={{ ":hover": { cursor: "pointer" }, '&:hover .people-icon': { color: sideSection === "chat" ? "#8C52FF" : "gray" } }}>
                <PeopleIcon className='people-icon' sx={{ color: sideSection === "people" ? "#8C52FF" : "gray" }} />

              </Box>
            </Stack>
          </Box>

          {!sideSection || sideSection === "chat" ?
            <MessageList bottomRef={bottomRef} />
            :
            <UserList />
          }


        </List>

        {!sideSection || sideSection === "chat" ?
          <MessageInput setSentMsgCount={setSentMsgCount} />
          :
          <></>
        }

      </Drawer>
    </Box>
  );
}
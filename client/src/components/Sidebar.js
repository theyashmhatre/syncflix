import React, {useContext, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Button, Chip, Input, Stack } from '@mui/material';
import { SocketContext } from '../context/socket';
import { useRoomContext } from '../context/rooms';
import { useAuth } from '../context/auth';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import { grey } from '@mui/material/colors';
import MessageList from './Chat/MessageList';
import MessageInput from './Chat/MessageInput';

const drawerWidth = 300;

export default function Sidebar() {

  var { messageList } = useRoomContext();
  const bottomRef = useRef(null);
  const [sentMsgCount, setSentMsgCount] = useState(0)

  

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
        <List sx={{ width: '100%', mt: "3.5rem", mb:"3rem", maxWidth: 360 }}>
         <Box position="sticky" top="4rem" width={drawerWidth} zIndex={3} bgcolor="white" >
            <Stack direction="row"  borderBottom="1px solid grey">
              <Box p="15px 0px"  display="flex" justifyContent={'center'} width={"50%"} >
                <ChatIcon sx={{ color: grey[600] }} />

              </Box>
              <Divider orientation="vertical" flexItem />
              <Box p="15px 5px" display="flex" textAlign="start" justifyContent={'center'} width={"50%"}>
                <PeopleIcon sx={{ color: grey[600] }} />

              </Box>
            </Stack>
         </Box>
        
        <MessageList bottomRef={bottomRef} />

        </List>
        
        <MessageInput setSentMsgCount={setSentMsgCount} />
        
      </Drawer>
    </Box>
  );
}
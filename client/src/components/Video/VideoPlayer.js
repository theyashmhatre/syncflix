import { Box, Grid, IconButton, Stack, Typography, useScrollTrigger } from '@mui/material'
import React, { useContext, useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { useRoomContext } from '../../context/rooms';
import { useAppStateContext } from '../../context/appstate';
import { SocketContext } from '../../context/socket';
import { useAuth } from '../../context/auth';
import Settings from '../Settings/Settings';
import LinkIcon from '@mui/icons-material/Link';


export default function VideoPlayer({ video, roomID }) {

  const { usersList, partyData, room, lastSeekFromServer, controlSwitch, isAdmin } = useRoomContext();
  const socket = useContext(SocketContext);
  const { user } = useAuth();
  const [openTooltip, setOpenTooltip] = useState(false);


  const handleCloseTooltip = () => {
    setOpenTooltip(false);
  };

  const handleOpenTooltip = () => {
    setOpenTooltip(true);

    setTimeout(() => {
      setOpenTooltip(false);
    }, 3000);
  };

  function handleEvent(event) {
    // use a switch/case to check for each event
    const userData = {
      "name": user.displayName,
      "email": user.email,
      "photoURL": user.photoURL
    }

    if (event.type === "ratechange") {

      socket.emit(event.type, { room: room.current, rate: event.target.playbackRate, userData: userData, type: "info" })
      return;
    }

    socket.emit(event.type, { room: room.current, time: event.target.currentTime, userData: userData, type: "info" })
  }

  function onSeeked(e) {
    var timestamp = e.target.currentTime;
    const userData = {
      "name": user.displayName,
      "email": user.email,
      "photoURL": user.photoURL
    }

    if (parseFloat(timestamp).toFixed(2) !== parseFloat(lastSeekFromServer).toFixed(2)) { // NEW CODE
      socket.emit("seekdone", { room: room.current, time: e.target.currentTime, userData: userData, type: "info" });

    }
  }


  return (
    <Grid container>

      <Grid item xs={12} >
        <Box color="black" bggradient="linear(to-r, #74ebd5, #ACB6E5)" overflow="hidden" margin="auto" height="70vh">
          {video.preview ? <video id="video" onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} 
          onPause={handleEvent} height="100%" width={"100%"} controls={isAdmin.current? true : controlSwitch === "public"? true : false} style={{ "objectFit": "cover" }}>
            <source src={video.preview} content='.mkv' type="video/mp4" />
          </video> :
            <iframe id='video'
              title='Youtube player'
              onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{ "objectFit": "cover" }}
              src={video.link}>
            </iframe>}
        </Box>
      </Grid>

      <Box width={"100%"} mt="10px" >
        <Stack direction={"row"} justifyContent="space-between" >
          <Typography sx={{fontWeight: "900", fontSize: "24px" }} display={"flex"} justifyContent={"center"} alignItems={"center"} >{partyData.title}</Typography>
          <Stack direction={"row"} spacing={2}>
            <Tooltip open={openTooltip} onClose={handleCloseTooltip} title="Text Copied!" placement="bottom">

              <Stack direction={"row"} display={"flex"} spacing={1}
                border={"1px solid #8C52FF"}
                sx={{ cursor:"pointer" }}
                onClick={() => { navigator.clipboard.writeText("http://localhost:3000/party/" + room.current); handleOpenTooltip() }}
                justifyContent={"center"} p="8px 5px" borderRadius={"5px"}
                boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
                color="#8C52FF" alignItems={"center"}>
                <LinkIcon fontSize='small' />
                <Typography color="#8C52FF" fontSize={"small"}>Copy Link</Typography>
              </Stack>

            </Tooltip>
            <Settings />
          </Stack>
        </Stack>
      </Box>
      <Box>
        <Stack direction={"row"} spacing={1} ml="2px">
          <Avatar alt="James Phelps" src={partyData.admin.photoURL} sx={{ width: 24, height: 24 }} />
          <Typography textAlign={"center"} fontSize={"15px"}>{partyData.admin.name}</Typography>
        </Stack>
      </Box>

    </Grid>
  )
}

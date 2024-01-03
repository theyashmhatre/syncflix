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

  const { usersList, partyData } = useRoomContext();
  const socket = useContext(SocketContext);
  const { user } = useAuth();
  const { room, lastSeekFromServer } = useRoomContext();
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
    console.log(`handleEvent ${event.type}\n ${event.target.currentTime} ${event.target.playbackRate}`);

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
          {video.preview ? <video id="video" onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{ "objectFit": "cover" }}>
            <source src={video.preview} content='.mkv' type="video/mp4" />
          </video> :
            <iframe id='video'
              title='Youtube player'
              onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{ "objectFit": "cover" }}
              src={video.link}>
            </iframe>}
        </Box>
      </Grid>

      <Box display={"flex"} justifyContent={"self"} alignItems={"center"}>
        <Box>
          <Stack direction={"column"}>
            <Typography sx={{ ml: "10px", fontWeight:"900", fontSize:"large" }} >{partyData.title}</Typography>
            <Stack direction={"row"}>
              <Avatar alt="James Phelps" src={partyData.admin.photoURL} />
              <Typography textAlign={"center"}>{partyData.admin.name}</Typography>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <Stack direction={"row"}>
            <Tooltip open={openTooltip} onClose={handleCloseTooltip} title="Text Copied!" placement="bottom">
              <Stack direction={"row"} display={"flex"} spacing={1}
                onClick={() => { navigator.clipboard.writeText("https://localhost:3000/party" + room.current); handleOpenTooltip() }}
                justifyContent={"center"} p="8px 2px" borderRadius={"10px"}
                boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
                color="white" alignItems={"center"} bgcolor={"#8C52FF"}>
                <LinkIcon fontSize='small' />
                <Typography color="white" fontSize={"small"}>Copy Link</Typography>
              </Stack>
            </Tooltip>
            <Settings />
          </Stack>
        </Box>
      </Box>

    </Grid>
  )
}

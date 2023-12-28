import { Box, Grid, IconButton, Stack, Typography, useScrollTrigger } from '@mui/material'
import React, { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { useRoomContext } from '../../context/rooms';

export default function VideoPlayer({ video, onSeeked, handleEvent, roomID }) {

  const [open, setOpen] = React.useState(false);
  const [isControl, setControl] = useState(true);
  const {usersList} = useRoomContext()

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    console.log(usersList);
    setControl(!isControl)

    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };


  return (
    <Grid container>
      
      <Grid item xs={12} >
        <Box color="black" bggradient="linear(to-r, #74ebd5, #ACB6E5)" overflow="hidden" margin="auto" height="70vh">
          {video.preview ? <video id="video" onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{ "objectFit": "cover" }} controls={isControl ? true: false}>
            <source src={video.preview} type="video/mp4" />
          </video> :
            <iframe id='video'
              title='Youtube player'
              onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{ "objectFit": "cover" }}
              src={video.link}>
            </iframe>}
        </Box>
      </Grid>

      <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} pt="15px">
        <Grid container height="3rem" textAlign={'left'} spacing={2}>
          <Grid item >
            <Typography ><span style={{ "fontWeight": "900", "fontSize": "large" }}>#{roomID}</span></Typography>
          </Grid>
          <Grid item>
            <Tooltip open={open} onClose={handleClose} title="Text Copied!" placement="right">
              <ContentCopyIcon fontSize='medium' style={{ "color": "grey" }} onClick={() => { navigator.clipboard.writeText(roomID); handleOpen() }} sx={{ ":hover": { cursor: "pointer" } }} />
            </Tooltip>
          </Grid>
        </Grid>


        <Grid item >
          <IconButton sx={{ "borderRadius": "5px", "backgroundColor": "#8C52FF" }}>
            <SettingsIcon style={{ "color": "white" }} />
          </IconButton>
        </Grid>
      </Stack>

    </Grid>
  )
}

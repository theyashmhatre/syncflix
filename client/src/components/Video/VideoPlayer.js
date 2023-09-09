import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function VideoPlayer({ video, onSeeked, handleEvent, roomID }) {
  return (
    <Grid container>
      <Grid container xs={6} height="3rem" p={"5px"} textAlign={'left'} spacing={2}>
        <Grid item xs={3} textAlign={"end"}>
          <Typography ><span style={{ "fontWeight": "900", "fontSize": "large" }}>#{roomID}</span></Typography>
        </Grid>
        <Grid item xs={1}>
          <ContentCopyIcon fontSize='medium' style={{"color": "grey"}} />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Avatar src="/static/images/avatar/2.jpg" alt='John Alto' />
          <Avatar src="/static/images/avatar/2.jpg" alt='John Alto' />
          <Avatar src="/static/images/avatar/2.jpg" alt='John Alto' />
          <Avatar src="/static/images/avatar/2.jpg" alt='John Alto' />
          <Typography fontSize={"30px"}>+</Typography>
        </Stack>
        
      </Grid>
      <Grid item xs={12} mt="10px">
        <Box color="black" bggradient="linear(to-r, #74ebd5, #ACB6E5)" borderRadius="5px" margin="auto" height="70vh">
          <video id="video" onEnded={handleEvent} onRateChange={handleEvent} onSeeking={onSeeked} onPlay={handleEvent} onPause={handleEvent} height="100%" width={"100%"} style={{"objectFit":"cover"}} controls>
            <source src={video.preview} />
          </video>
        </Box>
      </Grid>

      <Grid item xs={10} textAlign={'left'} height="100px">
        <Typography variant='h4' p="5px">My Intro Title</Typography>
        <Stack direction="row" ml="10px">
          <Avatar src="/static/images/avatar/2.jpg" alt='John Alto' />
          <Typography alignSelf="center" ml="10px">Yash Mhatre</Typography>
        </Stack>
      </Grid>

      <Grid item xs={2} mt="10px">
        <IconButton sx={{ "borderRadius": "5px", "backgroundColor":"#8C52FF"}}>
          <SettingsIcon fontSize="large" style={{"color": "white"}} />
        </IconButton>
      </Grid>
      
    </Grid>
  )
}

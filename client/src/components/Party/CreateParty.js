import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideoPlayer from '../Video/VideoPlayer';
import VideoOptions from '../Video/VideoOptions';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAppStateContext } from '../../context/appstate';
import { Grid } from 'react-loader-spinner';
import { useRoomContext } from '../../context/rooms';


export default function CreateParty({ video, loadVideo, onSeeked, handleEvent, roomID }) {

  const { setIsCreate, setIsJoin } = useAppStateContext();
  const { usersList } = useRoomContext()

  return (
    <Box color="black" bgGradient="linear(to-r, #74ebd5, #ACB6E5)" borderRadius="5px" margin="auto">

      <Stack direction="row" justifyContent="space-between" sx={{ p: "10px" }}>
        <Stack direction="row" spacing={1} >
          <Chip avatar={<KeyboardBackspaceIcon />} label="Back" variant='outlined' onClick={() => { setIsCreate(false); setIsJoin(false) }}
          />
        </Stack>
        {usersList.length ? usersList.map((user, index) => {
          return (
            <Avatar src={user.photoURL ? user.photoURL : "/static/images/avatar/2.jpg"} key={index} alt={user.name} />
          )
        }) : <></>}
        <Typography fontSize={"30px"}></Typography>
      </Stack>

      {video.visible ?
        <VideoPlayer
          video={video}
          onSeeked={onSeeked}
          handleEvent={handleEvent}
          roomID={roomID}
        /> :
        <VideoOptions loadVideo={loadVideo} isCreateRoom={true} roomID={roomID} />}
    </Box>
  )
}

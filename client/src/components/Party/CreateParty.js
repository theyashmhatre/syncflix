import { Avatar, AvatarGroup, Box, Chip, Stack, Typography } from '@mui/material'
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
    <Stack color="black" bgGradient="linear(to-r, #74ebd5, #ACB6E5)" margin="auto" padding={"20px"}>

      <Stack direction="row" justifyContent="space-between" sx={{ p: "0px 0px 10px 0px" }}>
        <Stack direction="row" spacing={1} >
          <Chip avatar={<KeyboardBackspaceIcon />} sx={{p:"20px 5px", borderRadius:"10px"}} label="Back" variant='outlined' onClick={() => { setIsCreate(false); setIsJoin(false) }}
          />
        </Stack>
        <AvatarGroup max={4} total={usersList.length}>
          {usersList.length ? usersList.map((user, index) => {
            return (
              <Avatar src={user.photoURL ? user.photoURL : "/static/images/avatar/2.jpg"} key={index} alt={user.name} />
            )
          }) : <></>}
        </AvatarGroup>
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
    </Stack>
  )
}

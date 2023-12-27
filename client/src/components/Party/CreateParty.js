import { Box, Typography } from '@mui/material'
import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideoPlayer from '../Video/VideoPlayer';
import VideoOptions from '../Video/VideoOptions';


export default function CreateParty({ video, loadVideo, onSeeked, handleEvent, roomID }) {
  return (
    <Box color="black" bgGradient="linear(to-r, #74ebd5, #ACB6E5)" borderRadius="5px" margin="auto">
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

import { Box, Typography } from '@mui/material'
import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideoPlayer from '../Video/VideoPlayer';
import VideoLoad from '../Video/VideoLoad';


export default function CreateParty({video, loadVideo, onSeeked, handleEvent, roomID}) {
  return (
    <Box color="black" bgGradient="linear(to-r, #74ebd5, #ACB6E5)" borderRadius="5px" margin="auto">
      {video.preview ? 
      <VideoPlayer
        video={video}
        onSeeked={onSeeked}
        handleEvent={handleEvent}
        roomID={roomID}
      /> : 
        <VideoLoad loadVideo={loadVideo} createRoom={true} roomID={roomID} />}
    </Box>
  )
}

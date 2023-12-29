import { Box, Typography } from '@mui/material'
import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function VideoLoad({loadVideo, roomID}) {
  return (
    <>
      {roomID? <Typography>Room ID: {roomID}</Typography> : <></>}
      <div>
        <label htmlFor="video_file" >
          <CloudUploadIcon size="25px" style={{ marginRight: "10px" }} />
          Select a Video
        </label>
        <input id="video_file" type='file' style={{ display: "none" }} onChange={(e) => { loadVideo(e, '') }} />
      </div>
    </>
  )
}

import React, { useState } from 'react'
import Card from '@mui/material/Card';
import { Box, Button, Grid, Input, Stack, TextField } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import CachedIcon from '@mui/icons-material/Cached';
import { ProgressBar } from "react-loader-spinner";

export default function VideoOptions({ loadVideo, isCreateRoom, roomID }) {

  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function loadVideoThroughLink(e) {
    console.log("EEe", e.clipboardData.getData('text'))
    setLink(e.clipboardData.getData('text'))
    const temp = e.clipboardData.getData('text');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      loadVideo(e, isCreateRoom, temp);
    }, 3000);
  }

  return (
    <div>
      <Stack direction={'column'} display={'flex'} justifyContent={'center'} height="81vh" alignItems={'center'} spacing={'20px'}>
        <label htmlFor="video_file">
          <Box sx={{ minWidth: 400, maxWidth: 450, border: '1px dashed black', borderRadius: "5px", padding: '10px', ":hover": { cursor: "pointer" } }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Click to upload {<CloudUploadIcon />}
            </Typography>
            <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
              or, drag and drop a file here
            </Typography>
          </Box>
        </label>
        <input id="video_file" type='file' style={{ display: "none" }} onChange={(e) => { loadVideo(e, isCreateRoom, '') }} />
        <Typography>or</Typography>
        {isLoading ?
          <Stack direction={'column'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <ProgressBar
              height="80"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor='black'
              barColor='#8C52FF'
            />
            <Typography sx={{ fontSize: 14, mt: "-10px" }} color="text.secondary">
              Fetching {link}
            </Typography>
          </Stack> :
          <TextField id="filled-basic" autoComplete='off' label="Paste video URL (e.g. https://www.youtube.com/watch?v=dMjce5P4j-Y)" onPaste={loadVideoThroughLink} variant="filled" sx={{ minWidth: 400, maxWidth: 450 }} />}
      </Stack>
    </div>
  )
}

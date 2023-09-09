import { Button } from '@mui/material'
import React from 'react'
import CreateParty from './CreateParty'
import VideoPlayer from '../Video/VideoPlayer'
import VideoLoad from '../Video/VideoLoad'

export default function JoinParty({room_id_input, roomID, handleInput, join_room, videoLoad}) {
  return (
    <div>
      {roomID? 
      <>
        <VideoLoad />
      </> : 
      <>
          <input type="text"
            value={room_id_input}
            name="room"
            onChange={handleInput} />
          <Button onClick={() => { join_room(room_id_input) }}>Connect</Button>
      </>}
    </div>
  )
}

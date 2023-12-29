import { Button } from '@mui/material'
import React from 'react'
import VideoPlayer from '../Video/VideoPlayer'
import VideoLoad from '../Video/VideoLoad'
import { useNavigate } from 'react-router-dom'

export default function JoinParty({ data, handleInput, join_room }) {
  const navigate = useNavigate();
  return (
    <>
      <input type="text"
        value={data.room}
        name="room"
        onChange={handleInput} />
      <Button onClick={() => { join_room(data.room, false, true) }}>Connect</Button>
    </>
  )
}

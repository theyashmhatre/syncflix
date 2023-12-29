import { Button } from '@mui/material'
import React from 'react'

export default function Create({join_room, data, handleInput}) {

  return (
    <>
      <input type="text"
        value={data.partyTitle}
        name="partyTitle"
        onChange={handleInput} placeholder='Title e.g. Hunger Games Movie' />
      <Button onClick={() => { const room_id = join_room('', true, true); console.log(room_id, data.partyTitle) }}>Create</Button>
    </>
  )
}

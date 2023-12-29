import { Box, Button, Grid, Stack } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SocketContext } from '../context/socket';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Options from './Party/Options';
import JoinParty from './Party/JoinParty';
import { useRoomContext } from '../context/rooms';
import { useAppStateContext } from '../context/appstate';
import Chip from '@mui/material/Chip';
import { useAuth } from '../context/auth';
import Create from './Party/Create';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {db} from "../firebase"
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

export default function MainContent() {

  const [data, setData] = useState({
    room: "",
    message: "",
    private_user: "",
    partyTitle: ""
  })
  const { isCreate, setIsCreate, isJoin, setIsJoin, videoLoaded } = useAppStateContext()
  const socket = useContext(SocketContext)
  const { user } = useAuth();
  const navigate = useNavigate();
  var { room } = useRoomContext();

  function handleInput(e) {
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
  };

  async function join_room(roomID, isAdmin, redirect) {
    if (!roomID) {
      roomID = generateRandomString().toUpperCase();
    }
    const userData = { roomID: roomID, data: { email: user.email, name: user.displayName, photoURL: user.photoURL } }
    if (isAdmin) {
      userData.isAdmin = true;
      await setDoc(doc(db, "Parties", roomID), {
        title: data.partyTitle,
        roomID: roomID,
        createdAt: new Date(),
        admin: {email: user.email, photoURL: user.photoURL, name: user.displayName},
        videoType: "",
        allAdmins: [user.email]
      });
    }

    if (redirect){
      navigate("/party/" + roomID)
    }
  }

  // function generate_roomID_and_join() {
  //   const roomID = generateRandomString().toUpperCase();

  //   join_room(roomID, true)
  //   localStorage.setItem("roomID", roomID)
  //   room.current = roomID
  // }

  // function message_in_room() {
  //   socket.emit("room message", {room: roomID, message: data.message})
  //   setData({
  //     ...data,
  //     message: "",
  //   })
  // }

  // function send_private_msg() {
  //   socket.emit("private msg", {private_user: data.private_user, message: "Hey there, this is a private msg from " + socket.id})
  //   setData({
  //     ...data,
  //     private_user: "",
  //   })
  // }


  return (
    <Box mt={8} zIndex={0} component="main"
      sx={{ flexGrow: 1, width: { sm: (isJoin || isCreate) && videoLoaded.current ? `calc(100% - ${300}px)` : '100%' } }}>

      {!(isCreate || isJoin) ?
        <Options setIsCreate={setIsCreate} setIsJoin={setIsJoin} />
        :
        <>
          <Stack direction="row" spacing={1} padding={"20px"} >
            <Chip avatar={<KeyboardBackspaceIcon />} sx={{ p: "20px 5px", borderRadius: "10px" }} label="Back" variant='outlined' onClick={() => { setIsCreate(false); setIsJoin(false) }}
            />
          </Stack>
          {isCreate ?

            <Create join_room={join_room} data={data} handleInput={handleInput} />
            :
            <JoinParty data={data} handleInput={handleInput} join_room={join_room} />}
        </>

      }
    </Box>
  )
}

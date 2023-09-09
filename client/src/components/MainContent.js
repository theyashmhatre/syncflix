import { Box, Button, Grid, Stack } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SocketContext } from '../context/socket';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Options from './Party/Options';
import CreateParty from './Party/CreateParty';
import JoinParty from './Party/JoinParty';
import { useRoomContext } from '../context/rooms';
import VideoLoad from './Video/VideoLoad';
import VideoPlayer from './Video/VideoPlayer';
import { useAuth } from '../context/auth';

export default function MainContent() {

  const [data, setData] = useState({
    room: "",
    message: "",
    private_user: "",
  })
  const [isCreate, setIsCreate] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const socket = useContext(SocketContext)
  const { user } = useAuth();
  var {roomID, setRoomID, messageList, setMessageList} = useRoomContext();
  const [video, setVideo] = useState({ preview: "", raw: "", visible: false, uploaded: false });
  const videoLoaded = useRef(false);
  const bottomRef = useRef(null);
  const videoRef = useRef(null);
  const [lastSeekFromServer, setLastSeekFromServer] = useState("");

  function handleInput(e){
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  function handleEvent(event) {
    // use a switch/case to check for each event
    const userData = {
      "name": user.displayName,
      "email": user.email,
      "photoURL": user.photoURL
    }
    console.log(`handleEvent ${event.type}\n ${event.target.currentTime} ${event.target.playbackRate}`);

    if (event.type === "ratechange") {

      socket.emit(event.type, { room: roomID, rate: event.target.playbackRate, userData: userData, type: "info" })
      return;
    }

    socket.emit(event.type, { room: roomID, time: event.target.currentTime, userData:userData, type:"info" })
  }

  useEffect(() => {
    if (socket) {
      socket.on("room message", ({message, id, userData, type}) => {
        setMessageList(prev => [...prev, {message, id, userData, type}])
      });
      socket.on("play", (time, message, userData, type) => {
        play(time)
      });
      socket.on("pause", (time, message, userData, type) => {
        pause()
      });
      socket.on("seekdone", (timestamp, message, userData, type) => {
        console.log("server seeked seekdone", timestamp, message);
        setLastSeekFromServer(timestamp)
        if (videoLoaded.current) {
          document.getElementById("video").currentTime = timestamp;
        }
        setMessageList(prev => [...prev, { message, userData, type }])
        pause()
      });

      socket.on("ratechange", (speed, message, userData, type) => {
        console.log("playback speed received ",speed)
        document.getElementById("video").playbackRate = speed;
        setMessageList(prev => [...prev, { message, userData, type }])
      });

      socket.on("ended", (time) => {
        console.log("ended", time);
      });

      socket.on('disconnect', () => {
        socket.removeAllListeners();
      });
    }
  }, [])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
  };

  function join_room(roomID) {
    socket.emit("join_room", roomID)
    setRoomID(roomID);
    setData({
      ...data,
      room: "",
    })  
  }

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

  const loadVideo = (e, join_new_room=false) => {
    if (e.target.files[0]) {
        setVideo(video => {
          return {
          preview: URL.createObjectURL(e.target.files[0]), //Offline preview url
          raw: e.target.files[0],
          visible: true,
          uploaded: false,
        }}
        );
        videoLoaded.current = true;

        if (join_new_room){
          const room = generateRandomString().toUpperCase()

          join_room(room)
          localStorage.setItem("roomID", room)
          setRoomID(room)
        }

    }

  };

  function onSeeked(e) {
    var timestamp = e.target.currentTime;
    const userData = {
      "name": user.displayName,
      "email": user.email,
      "photoURL": user.photoURL
    }

    if (parseFloat(timestamp).toFixed(2) !== parseFloat(lastSeekFromServer).toFixed(2)) { // NEW CODE
      socket.emit("seekdone", { room: roomID, time: e.target.currentTime, userData: userData, type: "info" });

    }
  }

  function play(time) {
    var videoPlayer = document.getElementById("video");
    var isPlaying = videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended
      && videoPlayer.readyState > videoPlayer.HAVE_CURRENT_DATA;

    if (videoLoaded.current && !isPlaying){
      videoPlayer.play()
    }
  }

  function pause() {
    var videoPlayer = document.getElementById("video");
    var isPlaying = videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended
      && videoPlayer.readyState > videoPlayer.HAVE_CURRENT_DATA;

    if (videoLoaded.current && isPlaying) {
      videoPlayer.pause()
    }
  }


  return (
    <Box mt={8} zIndex={0} component="main"
      sx={{ flexGrow: 1, px: 3, pt:1, width: { sm: `calc(100% - ${300}px)` } }}>

      {!(isCreate || isJoin) ? 
        <Options setIsCreate={setIsCreate} setIsJoin={setIsJoin} /> 
        :        
        isCreate ? 
        <CreateParty 
          video = {video}
          loadVideo = {loadVideo}
          onSeeked={onSeeked}
          handleEvent={handleEvent}
          roomID={roomID} 
        /> 
        : 
          <div>
            {roomID ?
              <>
              
                {video.preview ?
                  <>
                    <VideoPlayer 
                      video={video}
                      onSeeked={onSeeked}
                      handleEvent={handleEvent}
                      roomID={roomID}
                      />
                  </> 
                  : 
                  <VideoLoad loadVideo={loadVideo} createRoom={false} roomID={roomID} />}
              </> :
              <>
                <input type="text"
                  value={data.room}
                  name="room"
                  onChange={handleInput} />
                <Button onClick={() => { join_room(data.room) }}>Connect</Button>
              </>}
          </div>
        }
    </Box>
  )
}

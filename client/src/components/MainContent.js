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
import { useAppStateContext } from '../context/appstate';
import VideoLoad from './Video/VideoLoad';
import VideoPlayer from './Video/VideoPlayer';
import Chip from '@mui/material/Chip';
import { useAuth } from '../context/auth';
import VideoOptions from './Video/VideoOptions';

export default function MainContent() {

  const [data, setData] = useState({
    room: "",
    message: "",
    private_user: "",
  })
  const { isCreate, setIsCreate, isJoin, setIsJoin, videoLoaded, setIsVideo } = useAppStateContext()
  const socket = useContext(SocketContext)
  const { user } = useAuth();
  var { room, usersList, setUsersList, messageList, setMessageList } = useRoomContext();
  const [video, setVideo] = useState({ preview: "", raw: "", visible: false, link: '' });
  const bottomRef = useRef(null);
  const [lastSeekFromServer, setLastSeekFromServer] = useState("");

  function handleInput(e) {
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

      socket.emit(event.type, { room: room.current, rate: event.target.playbackRate, userData: userData, type: "info" })
      return;
    }

    socket.emit(event.type, { room: room.current, time: event.target.currentTime, userData: userData, type: "info" })
  }

  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();

      console.log(`beforeunload event triggeredx ${room.current}.`);
      socket.emit("connections_updated", {roomID: room.current, id: socket.id})
      socket.disconnect();

      return (event.returnValue =
        'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    if (socket) {
      socket.on("room message", ({ message, id, userData, type }) => {
        setMessageList(prev => [...prev, { message, id, userData, type }])
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
        console.log("playback speed received ", speed)
        document.getElementById("video").playbackRate = speed;
        setMessageList(prev => [...prev, { message, userData, type }])
      });

      socket.on("connections_updated", (users) => {
        console.log(users);
        setUsersList([...users])
        console.log(usersList);
      })

      socket.on("ended", (time) => {
        console.log("ended", time);
      });

      socket.on('disconnect', () => {
        socket.removeAllListeners();
        
      });
    }

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
  };

  function join_room(roomID, isAdmin) {
    const userData = { roomID: roomID, data: { email: user.email, name: user.displayName, photoURL: user.photoURL } }
    if (isAdmin){
      userData.isAdmin = true;
    }
    socket.emit("join_room", userData)
    console.log(user);
    room.current = roomID
    setData({
      ...data,
      room: roomID,
    })
    console.log(roomID);
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

  const loadVideo = (e, join_new_room, link) => {
    console.log(room.current, data.room)
    if (link) {
      setVideo(video => {
        return {
          preview: '',
          link: link, //Offline preview url
          raw: 'e.target.files[0]',
          visible: true,
        }
      }
      );
      videoLoaded.current = true;
      setIsVideo(true);
    }
    else if (e.target.files[0]) {
      setVideo(video => {
        return {
          preview: URL.createObjectURL(e.target.files[0]), //Offline preview url
          raw: e.target.files[0],
          visible: true,
        }
      }
      );
      videoLoaded.current = true;
      setIsVideo(true);
    }

    if (join_new_room) {
      const roomID = generateRandomString().toUpperCase()

      join_room(roomID, true)
      localStorage.setItem("roomID", roomID)
      room.current = roomID
    }
    console.log(isCreate, isJoin, videoLoaded.current);
  };

  function onSeeked(e) {
    var timestamp = e.target.currentTime;
    const userData = {
      "name": user.displayName,
      "email": user.email,
      "photoURL": user.photoURL
    }

    if (parseFloat(timestamp).toFixed(2) !== parseFloat(lastSeekFromServer).toFixed(2)) { // NEW CODE
      socket.emit("seekdone", { room: room.current, time: e.target.currentTime, userData: userData, type: "info" });

    }
  }

  function play(time) {
    var videoPlayer = document.getElementById("video");
    var isPlaying = videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended
      && videoPlayer.readyState > videoPlayer.HAVE_CURRENT_DATA;

    if (videoLoaded.current && !isPlaying) {
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
      sx={{ flexGrow: 1, width: { sm: (isJoin || isCreate) && videoLoaded.current ? `calc(100% - ${300}px)` : '100%' } }}>

      {!(isCreate || isJoin) ?
        <Options setIsCreate={setIsCreate} setIsJoin={setIsJoin} />
        :
        isCreate ?
          <CreateParty
            video={video}
            loadVideo={loadVideo}
            onSeeked={onSeeked}
            handleEvent={handleEvent}
            roomID={room.current}
          />
          :
          <div>
            {room.current ?
              <>

                {videoLoaded.current ?
                  <>
                    <VideoPlayer
                      video={video}
                      onSeeked={onSeeked}
                      handleEvent={handleEvent}
                      roomID={room.current}
                    />
                  </>
                  :
                  <VideoOptions loadVideo={loadVideo} isCreateRoom={false} roomID={room.current} />
                }
                
              </> :
              <>
                <input type="text"
                  value={data.room}
                  name="room"
                  onChange={handleInput} />
                <Button onClick={() => { join_room(data.room, false) }}>Connect</Button>
              </>}
          </div>
      }
    </Box>
  )
}

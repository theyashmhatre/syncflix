import { Avatar, AvatarGroup, Box, Chip, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideoPlayer from '../Video/VideoPlayer';
import VideoOptions from '../Video/VideoOptions';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAppStateContext } from '../../context/appstate';
import { Grid } from 'react-loader-spinner';
import { useRoomContext } from '../../context/rooms';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { SocketContext } from '../../context/socket';
import { useAuth } from '../../context/auth';
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";


export default function VideoPage() {

  const { setIsCreate, setIsJoin, videoLoaded, setIsVideo } = useAppStateContext();
  const { usersList, room, messageList, setMessageList, setLastSeekFromServer, setUsersList } = useRoomContext()
  const [video, setVideo] = useState({ preview: "", raw: "", visible: false, link: '' });
  const socket = useContext(SocketContext);
  const [partyExists, setPartyExists] = useState(false)
  const {user} = useAuth()
  const { id } = useParams();
  const bottomRef = useRef(null);
  const navigate = useNavigate()
  room.current = id;
  console.log(id, room.current);

  function join_room() {
    if (user){
      const userData = { roomID: room.current, data: { email: user.email, name: user.displayName, photoURL: user.photoURL } }
      console.log(userData);
      socket.emit("join_room", userData)
      setPartyExists(true)
    }
  }

  useEffect(() => {
    (async () => {
      const partyRef = doc(db, "Parties", id);
      const partySnap = await getDoc(partyRef);

      if (partySnap.exists()) {
        console.log(id, "exists");
      } else {
        console.log("No Such Document.");
        navigate("/error")
        return false;
      }
    })();
  }, [])

  useEffect(() => {
    join_room()
  }, [user])
  

  const loadVideo = (e, link) => {
    console.log(room.current)
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
  };

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

  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();

      console.log(`beforeunload event triggeredx ${room.current}.`);
      socket.emit("connections_updated", { roomID: room.current, id: socket.id })
      socket.disconnect();

      return (event.returnValue =
        'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    if (socket) {
      console.log("socket yes")
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

  return (
    <>
      {partyExists ? 
      <>
          <Sidebar />
          <Box sx={{ flexGrow: 1, width: { sm: `calc(100% - ${300}px)` } }}>

            <Stack color="black" bgGradient="linear(to-r, #74ebd5, #ACB6E5)" margin="auto" padding={"20px"}>

              <Stack direction="row" justifyContent="space-between" sx={{ p: "0px 0px 10px 0px" }}>
                <Stack direction="row" spacing={1} >
                  <Chip avatar={<KeyboardBackspaceIcon />} sx={{ p: "20px 5px", borderRadius: "10px" }} label="Back" variant='outlined' onClick={() => { setIsCreate(false); setIsJoin(false) }}
                  />
                </Stack>
                <AvatarGroup max={4} total={usersList.length}>
                  {usersList.length ? usersList.slice(0, 5).map((user, index) => {
                    return (
                      <Avatar src={user.photoURL ? user.photoURL : "/static/images/avatar/2.jpg"} key={index} alt={user.name} />
                    )
                  }) : <></>}
                </AvatarGroup>
                <Typography fontSize={"30px"}></Typography>
              </Stack>

              {video.visible ?
                <VideoPlayer
                  video={video}
                  roomID={room.current}
                /> :
                <VideoOptions loadVideo={loadVideo} roomID={room.current} />}
            </Stack>
          </Box>
      </>
        : <></>}
    </>
  )
}

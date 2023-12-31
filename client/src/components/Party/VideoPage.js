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
import { onAuthStateChanged } from "firebase/auth";


export default function VideoPage() {

  const { setIsCreate, setIsJoin, videoLoaded, setIsVideo } = useAppStateContext();
  const { usersList, room, messageList, setMessageList, setLastSeekFromServer, setUsersList, isAdmin, partyData, setPartyData, setControlSwitch } = useRoomContext()
  const [video, setVideo] = useState({ preview: "", raw: "", visible: false, link: '' });
  const socket = useContext(SocketContext);
  const [partyExists, setPartyExists] = useState(false)
  const { user } = useAuth()
  const { id } = useParams();
  const bottomRef = useRef(null);
  const navigate = useNavigate()
  room.current = id;

  function join_room() {
    if (user) {
      const userData = { roomID: room.current, data: { email: user.email, name: user.displayName, photoURL: user.photoURL, id:socket.id} }
      socket.emit("join_room", userData)
      setPartyExists(true)

    }
  }

  function update_admin_status() {

    if (!(Object.keys(partyData).length === 0 && partyData.constructor === Object)){   //checking if partydata has values
      if (partyData.allAdmins.includes(user.email)) {
        socket.emit("make_admin", { newAdminEmail: user.email, adminID: '', roomID: room.current, admin: '', newAdmin: '' })
        isAdmin.current = true; 
      }
    }
  }

  useEffect(() => {
    update_admin_status()
  }, [partyData])


  useEffect(() => {
    (async () => {
      const partyRef = doc(db, "Parties", id);
      const partySnap = await getDoc(partyRef);

      if (partySnap.exists()) {
        setPartyData(partySnap.data())

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

      socket.emit("connections_updated", { roomID: room.current, id: socket.id })
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
        setLastSeekFromServer(timestamp)
        if (videoLoaded.current) {
          document.getElementById("video").currentTime = timestamp;
        }
        setMessageList(prev => [...prev, { message, userData, type }])
        pause()
      });

      socket.on("ratechange", (speed, message, userData, type) => {
        document.getElementById("video").playbackRate = speed;
        setMessageList(prev => [...prev, { message, userData, type }])
      });

      socket.on("connections_updated", (users) => {
        
        Object.keys(users).forEach(key => {
          let u = users[key];
          if (u.id === socket.id) {
            if (u.isAdmin) {
              isAdmin.current = true;
            } else {
              isAdmin.current = false;
            }
          }
        })
        setUsersList([...users])
      })

      socket.on("video controls", ({control}) => {
        setControlSwitch(control);
      })

      socket.on("removed", () => {
        alert("Oops! You have been removed from the party.")
        navigate("/");
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

              <Stack direction="row" justifyContent="space-between" sx={{ p: "0px 0px 10px 0px", mt: '4rem', mb: '0.3rem' }}>
                <Stack direction="row" spacing={1} >
                  <Chip avatar={<KeyboardBackspaceIcon />} sx={{ p: "20px 5px", borderRadius: "10px" }} label="Back" variant='outlined' onClick={() => { setIsCreate(false); setIsJoin(false); navigate("/") }}
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

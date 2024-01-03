import React, { useContext } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useRoomContext } from '../../context/rooms';
import { Checkbox, Stack, Tooltip } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import RemoveModeratorOutlinedIcon from '@mui/icons-material/RemoveModeratorOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import { SocketContext } from '../../context/socket';
import { useAuth } from '../../context/auth';
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"

export default function UserList() {
  const { usersList, isAdmin, room, partyData } = useRoomContext();
  const socket = useContext(SocketContext);
  const { user } = useAuth();

  function remove_user(remove_id, name) {
    console.log(socket.id);
    if (isAdmin.current && remove_id !== socket.id) {
      socket.emit("remove_user", { id: remove_id, adminID: socket.id, roomID: room.current, adminName: user.displayName, removedUsername: name });
    }
  }

  async function make_admin(newAdminEmail, newAdminID, name) {
    console.log(isAdmin.current, newAdminEmail, newAdminID, name);
    if (isAdmin.current && newAdminID !== socket.id) {
      console.log("make admin executed");
      const partyDocRef = doc(db, "Parties", room.current)
      let allAdminList = partyData.allAdmins;
      console.log(allAdminList);
      allAdminList = allAdminList.filter(email => email !== newAdminEmail);
      allAdminList.push(newAdminEmail);
      const uniqueAdminList = [...new Set(allAdminList)]

      await updateDoc(partyDocRef, {
        allAdmins: uniqueAdminList
      });

      socket.emit("make_admin", { newAdminEmail: newAdminEmail, adminID: socket.id, roomID: room.current, admin: user.displayName, newAdmin: name });

    }
  }

  async function remove_admin(removeAdminEmail, removeAdminID, name) {
    console.log(removeAdminEmail, removeAdminID, name);
    if (isAdmin.current && removeAdminID !== socket.id) {
      console.log("remove admin executed");
      const partyDocRef = doc(db, "Parties", room.current)
      let allAdminList = partyData.allAdmins;
      if (partyData.allAdmins.includes(removeAdminEmail)) {
        allAdminList.push(removeAdminEmail);
        allAdminList = allAdminList.filter(item => item !== removeAdminEmail)

        await updateDoc(partyDocRef, {
          allAdmins: allAdminList
        });
      }
      socket.emit("remove_admin", { removedAdminEmail: removeAdminEmail, adminID: socket.id, roomID: room.current, admin: user.displayName, removedAdmin: name });
    }
  }

  function onChangeHandler(event, email, id, name) {
    console.log(event.target.checked, email, id);

    let checked = event.target.checked;

    if (checked) {
      make_admin(email, id, name);
    } else {
      remove_admin(email, id, name);
    }
  }

  return (
    <>
      <List
        sx={{
          bgcolor: 'background.paper',
        }}
      >
        {usersList.length ? usersList.map((user, index) => {
          return (
            <>
              <ListItem sx={{ width: "100%" }}>
                <Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"flex-end"}>
                  <>
                    <ListItemAvatar>
                      <Avatar alt="Jemy Sharp" src={user.photoURL} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </>
                  <>
                    <Tooltip title="Add/Remove Admin">
                      <Checkbox
                        onChange={(e) => { onChangeHandler(e, user.email, user.id, user.name) }}

                        disabled={(user.id === socket.id) || !isAdmin.current ? true : false}

                        checked={user.isAdmin ? true : false}

                        icon={<AddModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        checkedIcon={<RemoveModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}

                      />
                    </Tooltip>
                    <Tooltip title="Remove User">
                      <Checkbox disabled={(user.id === socket.id) || !isAdmin.current ? true : false}

                        icon={<RemoveCircleOutlineOutlinedIcon sx={{ fontSize: 25 }} />}
                        checkedIcon={<RemoveCircleOutlineOutlinedIcon sx={{ fontSize: 25 }} />}
                        onClick={() => { remove_user(user.id, user.name) }} />
                    </Tooltip>

                  </>
                </Stack>
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          )
        }) : <></>}
      </List>
    </>
  )
}

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

export default function UserList() {
  const { usersList, isAdmin, room } = useRoomContext();
  const socket = useContext(SocketContext);
  const {user} = useAuth();

  function remove_user(id, name) {
    if (isAdmin){
      socket.emit("remove_user", { id: id, adminID: socket.id, roomID: room.current, admin: user.displayName, removed_username: name });
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
              <ListItem sx={{width:"100%"}}>
                <Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"flex-end"}>
                  <>
                    <ListItemAvatar>
                      <Avatar alt="Jemy Sharp" src={user.photoURL} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </>
                  <>
                    <Tooltip title="Add/Remove Admin">
                      <Checkbox disabled={isAdmin ? false : true}
                        icon={<AddModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        checkedIcon={<RemoveModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}

                      />
                    </Tooltip>
                    <Tooltip title="Remove User">
                      <Checkbox disabled={isAdmin ? false : true}
                       icon={<RemoveCircleOutlineOutlinedIcon sx={{ fontSize: 25 }} />} onClick={() => { remove_user(user.id, user.name) }} />
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

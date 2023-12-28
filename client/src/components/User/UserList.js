import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import { useRoomContext } from '../../context/rooms';
import { Checkbox, IconButton, Stack, Tooltip } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import RemoveModeratorOutlinedIcon from '@mui/icons-material/RemoveModeratorOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';

export default function UserList() {
  const { usersList } = useRoomContext();

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
                      <Checkbox
                        icon={<AddModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        checkedIcon={<RemoveModeratorOutlinedIcon sx={{ fontSize: 25 }} />}
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}

                      />
                    </Tooltip>
                    <Tooltip title="Remove User">
                      <Checkbox icon={<RemoveCircleOutlineOutlinedIcon sx={{ fontSize: 25 }} />} />
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

import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';


export default function OtherChatCard({message, id, userData}) {
  return (
    <ListItem alignItems="flex-start">
   <ListItemAvatar>
        <Avatar alt="Hohn Sharp" src={userData.photoURL} />
      </ListItemAvatar> 
      <ListItemText
        primary={userData.name}
        secondary={
          <React.Fragment>
            {message}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';


export default function OwnChatCard({message, id, userData}) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={id}
        secondary={
          <React.Fragment>
            {message}
          </React.Fragment>
        }
      />
      <ListItemAvatar>
        <Avatar alt="Jemy Sharp" src={userData.photoURL} />
      </ListItemAvatar> 
    </ListItem>
  )
}

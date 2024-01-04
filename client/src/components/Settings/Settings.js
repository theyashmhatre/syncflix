import React, { Fragment, useContext, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Alert, Box, Button, Divider, Grid, IconButton, Paper, Snackbar, Stack, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import { grey } from '@mui/material/colors';
import { useRoomContext } from '../../context/rooms';
import { SocketContext } from '../../context/socket';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Settings() {

  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const socket = useContext(SocketContext);
  const { room, isAdmin, controlSwitch, setControlSwitch } = useRoomContext()

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function toggleVideoControls(control) {
    if (!isAdmin.current){
      setOpenAlert(true)
      return;
    }

    socket.emit("video controls", {control: control, adminID: socket.id, roomID: room.current})
    setControlSwitch(control);
    
  }

  return (
    <Fragment>
      <IconButton sx={{
        borderRadius: "5px", backgroundColor: "#8C52FF",
        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px", ":hover": { bgcolor: "white" }, '&:hover .setting-icon': { color: "#8C52FF" },
        transition: "0.5s"
      }}
        onClick={handleClickOpen}>
        <SettingsIcon className='setting-icon' sx={{ color:"white",":hover":{color:"white"}}} />
      </IconButton>
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={()=>{setOpenAlert(false)}} anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
        <Alert onClose={() => { setOpenAlert(false)}} severity="error" sx={{ width: '100%' }}>
          Only Admins are allowed to toggle controls!
        </Alert>
      </Snackbar>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="customized-dialog-title" fontWeight={500}>
          Video Controls
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>

          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt="10px">
            <Stack direction={"row"} width={"80%"} border={"2px solid"} borderColor={grey[400]} borderRadius={"10px"} bgcolor={grey[300]}
              sx={{ ":hover": { cursor: "pointer" } }}
            >
              <Box p="5px 0px" display={"flex"}
                borderRadius={controlSwitch === "admins" ? "10px" : ""}
                color={controlSwitch === "admins" ? "black" : grey[500]}
                bgcolor={controlSwitch === "admins" ? "white" : ""}
                justifyContent={"center"} width={"50%"}
                sx={{ transition: "0.5s" }}
                onClick={() => { toggleVideoControls("admins") }}
              >
                <PeopleIcon />
              </Box>
              <Box p="5px 0px" display={"flex"} justifyContent={"center"} width={"50%"}
                borderRadius={controlSwitch === "public" ? "10px" : ""}
                color={controlSwitch === "public" ? "black" : grey[500]}
                bgcolor={controlSwitch === "public" ? "white" : ""}
                sx={{ transition: "0.5s" }}
                onClick={() => { toggleVideoControls("public") }}
              >
                <PublicIcon />
              </Box>
            </Stack>
          </Box>


          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Stack direction={"row"} width={"80%"} mt="5px">
              <Box display={"flex"} justifyContent={"center"} width={"50%"}>
                <Typography color={controlSwitch === "admins" ? "" : grey[500]} sx={{ transition: "0.5s" }}>Admins</Typography>
              </Box>
              <Box display={"flex"} justifyContent={"center"} width={"50%"}>
                <Typography color={controlSwitch === "public" ? "" : grey[500]} sx={{ transition: "0.5s" }} >Public</Typography>
              </Box>
            </Stack>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Done
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  )
}

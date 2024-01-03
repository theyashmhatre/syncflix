import React, { Fragment, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, Divider, Grid, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import { grey } from '@mui/material/colors';
import { useRoomContext } from '../../context/rooms';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Settings() {

  const [open, setOpen] = React.useState(false);
  const [controlSwitch, setControlSwitch] = useState("admins")
  const { room } = useRoomContext()

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <IconButton sx={{ "borderRadius": "5px", "backgroundColor": "#8C52FF", boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px" }} onClick={handleClickOpen}>
        <SettingsIcon style={{ "color": "white" }} />
      </IconButton>
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
          {/* <Grid container display={"flex"} alignItems={"center"}>
            <Grid item xs={9} >
              <Box border={"1px solid"} borderColor={grey[400]} p="5px" width={"95%"} borderRadius={"5px"}>
                <Typography fontSize={"14px"} fontWeight={600}><Typography color={grey[500]} display={"inline"}>https://localhost:3000/party/</Typography>{room.current}</Typography>
              </Box>
            </Grid>

            <Grid item xs={3} sx={{ ":hover": { cursor: "pointer" } }}>
              <Tooltip open={openTooltip} onClose={handleCloseTooltip} title="Text Copied!" placement="bottom">
                <Stack direction={"row"} display={"flex"} spacing={1}
                  onClick={() => { navigator.clipboard.writeText("https://localhost:3000/party" + room.current); handleOpenTooltip() }}
                  justifyContent={"center"} p="8px 2px" borderRadius={"10px"}
                  boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
                  color="white" alignItems={"center"} bgcolor={"#8C52FF"}>
                  <LinkIcon fontSize='small' />
                  <Typography color="white" fontSize={"small"}>Copy Link</Typography>
                </Stack>
              </Tooltip>
            </Grid>
          </Grid>

          <Typography m={"30px 0px 8px 0px"} fontWeight={600} display={"flex"} justifyContent={"center"} alignItems={"center"} alignContent={"center"}>
            Video Controls
          </Typography> */}

          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt="10px">
            <Stack direction={"row"} width={"80%"} border={"2px solid"} borderColor={grey[400]} borderRadius={"10px"} bgcolor={grey[300]}
              sx={{ ":hover": { cursor: "pointer" } }}
            >
              <Box p="5px 0px" display={"flex"}
                // border={controlSwitch === "admins" ? "1px solid black" : ""}
                borderRadius={controlSwitch === "admins" ? "10px" : ""}
                color={controlSwitch === "admins" ? "black" : grey[500]}
                bgcolor={controlSwitch === "admins" ? "white" : ""}
                justifyContent={"center"} width={"50%"}
                sx={{ transition: "0.5s" }}
                onClick={() => { setControlSwitch("admins") }}
              >
                <PeopleIcon />
              </Box>
              <Box p="5px 0px" display={"flex"} justifyContent={"center"} width={"50%"}
                borderRadius={controlSwitch === "public" ? "10px" : ""}
                color={controlSwitch === "public" ? "black" : grey[500]}
                bgcolor={controlSwitch === "public" ? "white" : ""}
                sx={{ transition: "0.5s" }}
                onClick={() => { setControlSwitch("public") }}
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

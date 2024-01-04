import * as React from 'react';
import { useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from "../SYNC.png";
import { Grid, Stack } from '@mui/material';
import { signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase";
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
const provider = new GoogleAuthProvider();

const settings = ['Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const {user, getUser, handleLogin, handleLogout} = useAuth()
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    if (await handleLogout()) {
      navigate("/")
    }
  }

  

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl" sx={{ backgroundColor: '#8C52FF'}}>
        <Toolbar disableGutters >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box sx={{ flexGrow: 0, float: "left", mt: "10px" }}>
                <img src={logo} alt="logo" width={150} />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ flexGrow: 1, float: "right", borderRadius:"5px", p:"5px", m:"5px" }}>
                <Stack direction="row" spacing={1}>
                  
                  <Tooltip title="Open settings">

                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user? user.displayName: ""} src={user ? user.photoURL : "/static/images/avatar/2.jpg"} />
                    </IconButton>
                  </Tooltip>
                  <Typography alignSelf="center">{user ? user.displayName : "---"}</Typography>
                </Stack>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={user? logout: handleLogin}>
                    <Typography textAlign="center">{user? "Logout": "Login"}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
import React, { Fragment, useState } from 'react'
import Card from '@mui/material/Card';
import { Alert, Box, Button, Grid, Snackbar, Stack } from '@mui/material'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../context/auth';

export default function Options({setIsCreate, setIsJoin}) {

  const [openAlert, setOpenAlert] = useState(false);
  const {user} = useAuth();

  function toggleOptions(setFunc, value) {
    if (!user) {
      setOpenAlert(true);
      return;
    }
    setFunc(value);
  }
  return (
    <Fragment>
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={() => { setOpenAlert(false) }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => { setOpenAlert(false) }} severity="error" sx={{ width: '100%' }}>
          Please login to continue.
        </Alert>
      </Snackbar>
      <Grid container spacing={4} width="100%" height="81vh" alignItems={'center'} display={'flex'} justifyContent={'center'} >
        <Grid item>
          <Card sx={{ minWidth: 100, maxWidth: 250, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '10px' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                SyncFlix
              </Typography>
              <Typography variant="h5" component="div">
                Create Party
              </Typography>
              <Typography sx={{ mb: 2, mt: 2 }} color="text.secondary">
                Create a party - Share with friends - Watch content together 🎉
              </Typography>
            </CardContent>
            <Button variant='contained' sx={{ width: 100, margin: '0 auto' }} onClick={() => { toggleOptions(setIsCreate, true) }}>
              <Typography letterSpacing={1}>
                Create
              </Typography>
            </Button>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ minWidth: 100, maxWidth: 250, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '10px' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                SyncFlix
              </Typography>
              <Typography variant="h5" component="div">
                Join Party
              </Typography>
              <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
                Join Party created by others - Enjoy content together 🍿
              </Typography>
            </CardContent>
            <Button variant='contained' color='success' sx={{ m: "10px", margin: '0 auto' }} onClick={() => { toggleOptions(setIsJoin, true) }}>
              <Typography letterSpacing={2}>
                Join
              </Typography>
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  )
}

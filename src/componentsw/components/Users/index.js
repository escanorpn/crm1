import React from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import UserList from './UserList';
import AddUser from './addUser';

function UserComponent() {
  return (
    <div>
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <UserList />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <AddUser />
        </Grid> */}
      </Grid>
    </div>
  );
}

export default UserComponent;

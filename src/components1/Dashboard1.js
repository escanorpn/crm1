
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get, push, set, serverTimestamp, onValue } from 'firebase/database';
import { db, DB, auth } from '../store/firebase';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import  {Tooltip,Avatar,Menu } from '@mui/material';

import {signOut as firebaseSignOut } from 'firebase/auth';

import { useSelector, useDispatch } from 'react-redux';
import { setSelectedApp,setSelectedAppID } from '../store/Actions'; 
import Users from './Users/index'
import Tasks from './Tasks/TaskTable'


import { Link } from 'react-router-dom';
import { Route, Routes as Switch, Navigate } from 'react-router-dom';

const drawerWidth = 240;


function Dashboard(props) {
  const [user] = useAuthState(auth);
  const [apps, setApps] = useState([]);
  // const [selectedApp, setSelectedApp] = useState('');
  const [appName, setAppName] = useState('');
  const [appType, setAppType] = useState('CRM');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const selectedApp = useSelector(state => state.app.selectedApp);
  const dispatch = useDispatch();
  
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
   const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  useEffect(()=>{
    if (apps.length > 0) {
      setSelectedApp(apps[0].name);
      setSelectedAppID(apps[0].id);
      
    // console.log(apps[0].name) // Assuming you have setSelectedAppID in your state
    }
    // console.log('apps[0].name')
  }, [apps])

  useEffect(() => {
    if (user) {
      setLoading(true); // Set loading state to true initially
      const appsRef = ref(db, `${DB}/apps/${user.uid}`);
      const fetchData = async () => {
        try {
          const snapshot = await get(appsRef);
          if (snapshot.exists()) {
            const appsData = snapshot.val();
            const userApps = Object.entries(appsData || {}).map(([appId, appData]) => ({
              id: appId,
              ...appData,
            })).filter(app => app.userId === user.uid);
  
            setApps(userApps);
  
            if (userApps.length > 0) {
              setSelectedApp(userApps[0].name);
              setSelectedAppID(userApps[0].id);
            }
          }
          setLoading(false); // Set loading state to false after data is fetched
        } catch (error) {
          console.error('Error fetching apps:', error);
          setLoading(false); // Make sure to set loading to false even in case of an error
        }
      };
  
      fetchData();
  
      // Listen for app changes
      onValue(appsRef, (snapshot) => {
        if (snapshot.exists()) {
          const appsData = snapshot.val();
          const userApps = Object.entries(appsData || {}).map(([appId, appData]) => ({
            id: appId,
            ...appData,
          })).filter(app => app.userId === user.uid);
  
          setApps(userApps);
        }
      });
    }
  }, [user]);
  
  

  const handleAppRegistration = async () => {
    try {
      if (!appName || !appType) {
        setSnackbarMessage('Please provide app name and type.');
        setSnackbarOpen(true);
        return;
      }
      const existingApp = apps.find(app => app.name === appName);
      if (existingApp) {
        setSnackbarMessage('An app with the same name already exists.');
        setSnackbarOpen(true);
        return;
      }
      const newAppRef = push(ref(db, `${DB}/apps/${user.uid}`));
      const appData = {
        userId: user.uid,
        name: appName,
        type: appType,
        createdAt: serverTimestamp(),
      };
      await set(newAppRef, appData);

      setSnackbarMessage('App registered successfully.');
      setSnackbarOpen(true);
      setAppName('');
      setAppType('CRM');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error registering app:', error);
      setSnackbarMessage('An error occurred. Please try again later.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
const menuSelection=(v)=>{
  setSelectedApp(v)
  if(v=='newApp'){
    setDialogOpen(true)
  }
}
  const drawer = (
    <div>
      <Toolbar />
     
      <Select
      displayEmpty={true}
  label="Select App"
  value={loading ? 'Loading...' : selectedApp}
  onChange={e => {
    const selectedAppName = e.target.value;
    const selectedAppId = apps.find(app => app.name === selectedAppName)?.id || '';
    dispatch(setSelectedApp(selectedAppName));
    dispatch(setSelectedAppID(selectedAppId));
    menuSelection(selectedAppName);
  }}
  fullWidth
  sx={{ marginBottom: '16px' }}
  disabled={loading}
>
<MenuItem value="">Select an app</MenuItem>
  {apps && apps.length > 0 ? (
    apps.map((app) => (
      <MenuItem
        key={app.id}
        value={app.name}
        selected={selectedApp === app.name}
      >
        {app.name}
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>No apps available</MenuItem>
  )}
</Select>


      <Divider />
      <List>
      {/* Add navigation links for Users and Tasks */}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/dashboard/users">
          <ListItemText primary="Users" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/dashboard/tasks">
          <ListItemText primary="Tasks" />
        </ListItemButton>
      </ListItem>
    </List>
      <Divider />
      <List>
 
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        // position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
  <IconButton
    color="inherit"
    aria-label="open drawer"
    edge="start"
    onClick={handleDrawerToggle}
    sx={{ mr: 2, display: { sm: 'none' } }}
  >
    <MenuIcon />
  </IconButton>
  <Button color="inherit" onClick={() => setDialogOpen(true)}>Add New App +</Button> {/* Button to add a new app */}
  
  <Box sx={{ flexGrow: 1 }}></Box>
  {selectedApp}
  <Box sx={{ flexGrow: 1 }}></Box>
  <Tooltip title="Open settings">
    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
      {user ? ( // Conditionally render user info if logged in
        <>
          <Avatar alt="User Avatar" src={user.photoURL} />
        </>
      ) : (
        <Avatar alt="User Avatar" src="/static/images/avatar.jpg" />
      )}
    </IconButton>
  </Tooltip>
  <Menu id="menu-appbar" anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} sx={{ mt: '45px' }}>
    {settings.map((setting) => (
      <MenuItem key={setting} onClick={setting === 'Logout' ? handleSignOut : handleCloseUserMenu}>
        <Typography textAlign="center">{setting}</Typography>
      </MenuItem>
    ))}
  </Menu>
</Toolbar>

      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Register New App</DialogTitle>
          <DialogContent>
            <TextField
              label="App Name"
              fullWidth
              value={appName}
              onChange={e => setAppName(e.target.value)}
              sx={{ margin: '16px 0' }}
            />
            <Select
              label="App Type"
              value={appType}
              onChange={e => setAppType(e.target.value)}
              fullWidth
              sx={{ marginBottom: '16px' }}
            >
              <MenuItem value="CRM">CRM</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAppRegistration} color="primary">
              Register
            </Button>
          </DialogActions>
        </Dialog>
    

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
   
    <Users/>
    
      </Box>
    </Box>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
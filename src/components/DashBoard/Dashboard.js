
import React,{useState,useEffect} from 'react';
import {
  AppBar,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DataGrid } from '@mui/x-data-grid';

import ListItemButton from '@mui/material/ListItemButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get, push, set, serverTimestamp, onValue } from 'firebase/database';
import { setSelectedApp,setSelectedAppID } from '../../store/Actions'; 
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { setActiveContent} from '../../store/Actions'; 

import { useSelector, useDispatch } from 'react-redux';
import { db,  auth } from '../../store/firebase';
import { setMobileOpen} from '../../store/Actions'; 
import {signOut as firebaseSignOut } from 'firebase/auth';
import TaskTable from '../Tasks/TaskTable';
import Users from '../Users/index';
import Tickets from '../Tickets/ticket';
import Profile from '../Profile';
import Finance from '../Finance';
import Shamba from '../Shamba';
import WhatsappRegistrationGuide from '../whatsapp/steps';
import { useNavigate,  } from 'react-router-dom';

const Layout = () => {

  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const selectedAppData = useSelector(state => state.app.selectedAppData);
  let items = [
    { label: 'Home', path: '/', navigate: true },
    { isDivider: true }, // Add a divider
    { label: 'Tasks', path: '/tasks', navigate: false },
    { label: 'Tickets', path: '/tickets', navigate: false },
    { isDivider: true }, 
    { label: 'Profile', path: '/Profile', navigate: false },
    { isDivider: true }, // Add a divider
  ]; 
   
const settings = [ 'Logout'];
  const [user] = useAuthState(auth);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [navItems, setNavItems] = React.useState(items);

  const [apps, setApps] = useState([]);
  const selectedApp = useSelector(state => state.app.selectedApp);
  const [loading, setLoading] = useState(false);
  const DB = useSelector((state) => state.app.DB);
  const DB1 = useSelector((state) => state.app.DB1);
  
  // const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 210;
  const dispatch = useDispatch(); 
  const navigate = useNavigate();


  const activeContent = useSelector(state => state.app.activeContent);
let mobileOpen = useSelector(state => state.app.mobileOpen);

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
  
      const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };
      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };

      const menuSelection=(v)=>{
        setSelectedApp(v)
      }
   
      const checkUserIsOwner = (selectedApp) => {
        return new Promise((resolve, reject) => {
          // Create a reference to the selected app's data
          const appRef = ref(db, `${DB1}/AppsById/${selectedApp}`);
          // console.log("appData",`${DB1}/AppsById/${selectedApp}`)
          // Retrieve the selected app's data
          get(appRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                // App data exists
                const appData = snapshot.val();
              
                // Check if the user is the owner (by comparing the owner field to user.uid)
                const isOwner = appData.owner === user.uid;
      
                // Resolve the promise with the result (true if user is the owner, false if not)
                resolve(isOwner);
              } else {
                // App data doesn't exist
                resolve(false);
              }
            })
            .catch((error) => {
              // Handle error retrieving app data
              console.error(`Error retrieving app data: ${error.message}`);
              // Reject the promise with the error
              reject(error);
            });
        });
      };
      
      useEffect(() => {
        if(!selectedApp){
          
          navigate("/");
        }
        if (user) {
         user.getIdTokenResult()
         .then((idTokenResult) => {
            // Confirm the user is an Admin.
            checkUserIsOwner(selectedAppID)
    .then((isOwner) => {
    // Use the isAdmin value (true or false) here
        if (isOwner) {
          console.log('User is an admin.');
          
          let items = [
            { label: 'Home', path: '/', navigate: true },
            // { label: 'Admin', path: '/admin', navigate: true },
            { isDivider: true }, // Add a divider
            { label: 'Users', path: '/users', navigate: false },
            { label: 'Tasks', path: '/tasks', navigate: false },
            { label: 'Tickets', path: '/tickets', navigate: false },
          
            { label: 'Finance', path: '/finance', navigate: false },
            { label: 'Whatsapp', path: '/whatsapp', navigate: false },
            { isDivider: true }, // Add a divider
          ]; 
          
        console.log("selectedAppData: ",JSON.stringify(selectedAppData))
         
          setNavItems(items)
        } else {
          console.log('User is not an admin.');
        }
        if(selectedAppData.selectedOption=="land"){
          items = [
            { label: 'Home', path: '/', navigate: true },
            { label: 'Users', path: '/users', navigate: false },
            // { label: 'Admin', path: '/admin', navigate: true },
            { isDivider: true }, // Add a divider
            { label: 'Shamba', path: '/shamba', navigate: false },
            { isDivider: true }, // Add a divider
          ]; 
        }
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
            
         })
         .catch((error) => {
           console.log(error);
         });
          setLoading(true); // Set loading state to true initially
          const appsRef = ref(db, `${DB}/apps/${user.uid}`);
          // console.log(`${DB}/apps/${user.uid}`)
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
      const handleUserItemClick = (content) => {
        console.log(content)
        dispatch(setActiveContent(content)); // Dispatch your action with the parameter
      };
   
function CustomDrawer() {
  return (
    <>
    <Toolbar />
    <Divider />
    <List>
      {navItems.map((item, index) => (
        <div key={index}>
        {item.isDivider && <Divider />}
       
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.navigate) {
                  navigate(item.path);
                } else {
                  // Handle the click action for items where navigate is false
                  // For example, you can call handleUserItemClick(item.label)
                  handleUserItemClick(item.label);
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        </div>
      ))}
    </List>
    </>
  );
}
const drawer=CustomDrawer()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const [newAppName, setNewAppName] = useState('');
  

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
 
  

  return (
    <Box sx={{ display: isMobile ? 'initial' : 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
       
       <Box sx={{ flexGrow: 1 }}></Box>
          {/* <Button color="inherit" onClick={openNewAppDialog}>
  Add New App +
</Button> */}


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
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
            {drawer}
        </Drawer>
      )}
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
      <Box component="main" sx={{
          ml: { sm: `${drawerWidth}px` }, flexGrow: 1, p: 1 }}>
        <Toolbar />
        <Container maxWidth="lg">
          {/* <Typography variant="h5" component="h1" gutterBottom>
         {activeContent}
          </Typography> */}
          <div style={{ height: 400, width: '100%' }}>
          {activeContent == 'Tasks' && <TaskTable />}
        {activeContent === 'Users' && <Users />}
        {activeContent === 'users' && <Users />}
        {activeContent === 'Tickets' && <Tickets />}
        {activeContent === 'Profile' && <Profile />}
        {activeContent === 'Finance' && <Finance />}
        {activeContent === 'Shamba' && <Shamba />}
        {activeContent === 'Whatsapp' && <WhatsappRegistrationGuide />}
            {/* <DataGrid rows={rows} columns={columns} /> */}
          </div>
        </Container>
      </Box>
     

    </Box>
  );
};

export default Layout;

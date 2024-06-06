import React, { useState,useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Navigation from '../Navigation';
import { Box } from '@mui/system';
import MultiStepDialog from './MultiStepDialog';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SignInForm from './SignInForm';
import CreateCRMAppForm from './CreateCRMAppForm';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from "../../store/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import LinearProgress from '@mui/material/LinearProgress';
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import the CopyToClipboard component// Import the CopyToClipboard component
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import the SyntaxHighlighter component
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageIcon from '@mui/icons-material/ManageAccounts';
import GenerateIcon from '@mui/icons-material/Refresh'

import { ref, get, remove, set, serverTimestamp, onValue,update} from 'firebase/database';
import { db, DB,  } from '../../store/firebase';
import { useDispatch, useSelector} from 'react-redux';
import { updateDB,updateDBPath,setSelectedApp,setSelectedAppID,setSelectedAppData } from '../../store/Actions';
import { useNavigate,  useLocation } from 'react-router-dom';

const steps = ['Sign In', 'Create CRM App'];

function Landing() {
  
  const [dialogOpen, setDialogOpen] = useState(false); // Set to true to show dialog by default
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const dbPath = useSelector((state) => state.app.DB);
  const navigate = useNavigate(); // Initialize useNavigate
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); 
  const [deleteApp, setIsDeleteApp] = useState(null); // To track successful deletion

  const handleOpenDeleteDialog = (app) => {
    setDeleteDialogOpen(true);
    setIsDeleteApp(app)
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setIsDeleteApp(null)
  };
  const [user] = useAuthState(auth);
  useEffect(() => {
    setLoading(true)
      if (user) {
        // setDialogOpen(true)
        setActiveStep(1)
      }else{
        setActiveStep(0)
      }
  
      // setLoading(false)
  }, [user]);


  const handleDeleteApp = (app) => {
    const appId=app.id;
    // Reference to the app node in the database
    const appRef = ref(db, `${DB}/Apps/${user.uid}/${appId}`);

    // Delete the app node
    remove(appRef)
      .then(() => {
        setIsDeleted(true);
        // Optionally, you can show a success message here
        console.log('App deleted successfully.');
      })
      .catch((error) => {
        // Handle any errors that occur during deletion
        console.error('Error deleting app:', error);
      })
      .finally(() => {
        // After deletion, close the dialog
        handleCloseDeleteDialog();
      });
  };
  
  useEffect(() => {
    
    setLoading(true)
    if(user){
    const appsRef = ref(db, `${DB}/Apps/${user.uid}`);
    console.log( `${DB}/Apps/${user.uid}`)
    const unsubscribeApps = onValue(appsRef, snapshot => {
      if (snapshot.exists()) {
        const agentsData = snapshot.val();
        const MyappsArray = Object.entries(agentsData || {}).map(([agentId, agentData]) => ({
          id: agentId,
          ...agentData,
        }));
        console.log(MyappsArray)
        setApps(MyappsArray);
        // setLoading(false)
      }
    });
    setLoading(false)
    return () => {
      unsubscribeApps();
    };
  }else{
    setApps([]);
    setLoading(false)
  }
  
  // setLoading(false)
  
  }, [user]);
  const handleNext = (data) => {
    if (activeStep === 0) {
      setUserData(data);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const CodeSnippet = ({ code }) => {
    return (
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
         
        </div>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {code}  
        </SyntaxHighlighter>
        
      </div>
    );
  };
  const handleUpdateDB =  (app) => {
    const newDBPath = `crm/${user.uid}/${app.appName}/${app.id}`;
    try {
      dispatch(updateDBPath(newDBPath));
      dispatch(setSelectedApp(app.appName));
      dispatch(setSelectedAppID(app.id));
      dispatch(setSelectedAppData(app));
      
      // Now that the DB path is updated, navigate to the desired location
      console.log(dbPath);
      navigate(`/dashboard`); 
    } catch (error) {
      console.error('Error updating DB path:', error);
    }
  };

  function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }
    return randomCode;
  }
  
  // Function to generate a unique alphanumeric code
  function generateUniqueAlphanumericCode() {
    // Generate a random alphanumeric code of a specified length (e.g., 10 characters)
    const randomCode = generateRandomCode(10);
  
    // Get the current timestamp in milliseconds
    // const timestamp = new Date().getTime();
  
    // Combine the random code and timestamp to create a unique code
    const uniqueCode = `${randomCode}`;
  
    return uniqueCode;
  }
  

/// Function to refresh the code for a specific app
function refreshCode(appId, oldAppCode) {
  const appRef = ref(db, `${DB}/Apps/${user.uid}/${appId}`);
  const oldPathRef = ref(db, `${DB}/paths/${oldAppCode}`);
  // Generate a new unique code
  const newCode = generateUniqueAlphanumericCode();
  
  const newPathRef = ref(db, `${DB}/paths/${newCode}`);

  // Check if an entry with the oldAppCode exists in {DB}/paths
  get(oldPathRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // If it exists, delete the old entry
        remove(oldPathRef)
          .then(() => {
            // Create a new entry in {DB}/paths with the new code
            const newPathData = {
              a: user.uid,
              b: appId,
            };
            set(newPathRef, newPathData)
              .then(() => {
                // Update the appCode field in the database
                const updates = {};
                updates[`appCode`] = newCode;

                // Perform the update
                update(appRef, updates)
                  .then(() => {
                    console.log(`Code refreshed for app with ID: ${appId}`);
                  })
                  .catch((error) => {
                    console.error(`Error updating appCode: ${error.message}`);
                  });
              })
              .catch((error) => {
                console.error(`Error creating new path: ${error.message}`);
              });
          })
          .catch((error) => {
            console.error(`Error deleting old path: ${error.message}`);
          });
      } else {
        // If it doesn't exist, create a new entry in {DB}/paths with the new code
        const newPathData = {
          a: user.uid,
          b: appId,
        };
        set(newPathRef, newPathData)
          .then(() => {
            // Update the appCode field in the database
            const updates = {};
            updates[`appCode`] = newCode;

            // Perform the update
            update(appRef, updates)
              .then(() => {
                console.log(`Code refreshed for app with ID: ${appId}`);
              })
              .catch((error) => {
                console.error(`Error updating appCode: ${error.message}`);
              });
          })
          .catch((error) => {
            console.error(`Error creating new path: ${error.message}`);
          });
      }
    })
    .catch((error) => {
      console.error(`Error checking for old path: ${error.message}`);
    });
}


  return (
    <div>
      <Navigation />
      <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
    
      <Box pt={8} pl={4} pr={4}>
        <Grid container spacing={3} style={{marginBottom:'20px'}}>
           
    
          <Grid item xs={12} md={6}>
            <Card elevation={5}>
              <CardContent style={{ textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Welcome to Our CRM App!
                </Typography>
                <Typography variant="body1" paragraph>
                  Create your own CRM app to manage clients, tasks, and tickets seamlessly.
                </Typography>
                <Typography variant="body1" paragraph>
                  With our easy-to-use tools, you can tailor your CRM app to your business needs.
                </Typography>
                <Typography variant="body1">
                  Click the button below to get started and create your own CRM app now.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                  {user?<>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Create CRM App
                  </Button></>:<>
                  <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                   Sign in
                  </Button></>}
                 
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {user?<></>:<>
          <Grid item xs={12} md={6}>
            <Card elevation={5}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Sign in as a User
                </Typography>
                <Typography variant="body1" paragraph>
                  Sign in to your existing  App to manage your clients, tasks, and tickets.
                </Typography>
                <Typography variant="body1">
                  Click the button below to sign in and access your  App.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/signin"
                  >
                    Sign In
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid></>}
          </Grid>
        <Grid container spacing={3}>
          {apps.map(app => (
             <Grid
             item
             xs={12}
             md={4}
             key={app.id}
           >
          <Card elevation={5}>
            <CardContent style={{ textAlign: 'left' }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                    <Typography variant="h6" gutterBottom>
                {app.appName}
              </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={1}
                >
        
     
    <Button variant="contained" color="primary" 
    style={{ cursor: 'pointer' }}
    onClick={() => handleUpdateDB(app)}
    >
      <ManageIcon />
      <Typography variant="caption" color="inherit">
        Manage
      </Typography>
    </Button>
                  </Box>
                  </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={1}
                >
                  <CopyToClipboard text={app.appCode}>
                    <Button
                      variant='text'
                      color="primary"
                      style={{ minWidth: 0, padding: '0px' }}
                    >
                      <FileCopyIcon fontSize="small" />
                      
                    </Button>
                  </CopyToClipboard>
                  
                  <CodeSnippet
            code={`${app.appCode}`}
          />
                </Box>
                <IconButton
                  onClick={() => refreshCode(app.id,app.appCode)}
                  color="red"
                >
                  <GenerateIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={1}
                >
        
     
    <Button variant="contained" color="primary" 
    style={{ cursor: 'pointer' }}
    // onClick={() => handleDeleteApp(app.id)}
    onClick={() => handleOpenDeleteDialog(app)}
    >
      <DeleteIcon />
      <Typography variant="caption" color="inherit">
        Delete
      </Typography>
    </Button>
                  </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
        </Grid>
      </Box>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete App"}</DialogTitle>
        <DialogContent>
        <>
              <DialogContentText id="alert-dialog-description">
              {deleteApp ? `Are you sure you want to delete the app ${deleteApp.appName}? This action is irreversible, and all data will be lost.` : 'Are you sure you want to delete this app? This action is irreversible, and all data will be lost.'}
            </DialogContentText>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={() => handleDeleteApp(deleteApp)} color="primary" autoFocus>
                  Yes, Delete
                </Button>
              </DialogActions>
            </>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Multi-Step Dialog
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && <SignInForm onNext={handleNext} />}
          {activeStep === 1 && <CreateCRMAppForm userData={userData} onBack={handleBack} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Landing;

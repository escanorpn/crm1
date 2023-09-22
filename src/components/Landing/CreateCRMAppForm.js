import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ref, push, set , serverTimestamp, get,child } from 'firebase/database';
import { db, DB, auth } from '../../store/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function CreateCRMAppForm({ userData, onBack, onClose }) {
  const [user] = useAuthState(auth);
  const [appName, setAppName] = useState('');
  const [number, setNumber] = useState('');
  const [numUsers, setNumUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    if (!user) {
      setSnackbarMessage('You need to sign in to create a CRM app.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    setLoading(true);

    if (validateData()) {
      if (user) {
      
       await checkMaxApps();
      }
    }

    setLoading(false);
  };

  const validateData = () => {
    if (!appName || !number) {
      setSnackbarMessage('App Name and Number are required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };
  const checkMaxApps = async () => {
    try {
      let maxApps = 5;
      const dbRef = ref(db);
  
      get(child(dbRef, `${DB}/Admins/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          maxApps = snapshot.val().maxApps;
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
  
      const userAppsSnapshot = await get(child(dbRef, `${DB}/Apps/${user.uid}`));
      
      if (userAppsSnapshot.exists()) {
        const userAppsData = userAppsSnapshot.val();
        
        if (Object.keys(userAppsData).length >= maxApps) {
          setSnackbarMessage(`You have reached the maximum allowed apps: ${maxApps}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } else {
          checkAppExistence();
        }
      } else {
        checkAppExistence();
      }
    } catch (error) {
      console.error('Error checking max apps:', error);
    }
  };
  
  
  const checkAppExistence = async () => {
    try {
      const dbRef = ref(db);
      const appsRef = child(dbRef, `${DB}/Apps/${user.uid}`);
  
      const appSnapshot = await get(appsRef);
      const appData = appSnapshot.val();
  
      let appExists = false;
  
      for (const uid in appData) {
        if (appData[uid].appName === appName) {
          appExists = true;
          break;
        }
      }
  
      if (appExists) {
        setSnackbarMessage('An app with the same name already exists.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        uploadDataToDatabase();
      }
    } catch (error) {
      console.error('Error checking app existence:', error);
    }
  };
  
  
  const uploadDataToDatabase = () => {
    const appData = { ...userData, appName, number, numUsers };
  
    // Get a new database reference for the CRM apps collection
    const userAppsRef = ref(db, `${DB}/Apps/${user.uid}`);
  
    // Push the app data to the user's app collection with a generated key
    const newUserAppRef = push(userAppsRef);
    
    // Set the app data at the generated key
    set(newUserAppRef, appData)
      .then(() => {
        setSnackbarMessage('CRM App created successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
        const md={appName}
        // Create the app reference based on appName
        const appsByIdRef = ref(db, `${DB}/AppsById/${newUserAppRef.key}`);
        set(appsByIdRef, md)
          .then(() => {
            // App reference by name created successfully
            setSnackbarMessage('CRM ppp created successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onClose();
            console.log('CRM ppp created successfully.')
          })
          .catch((error) => {
            // Handle error creating the app reference by name
            console.error(`Error creating app reference by name: ${error.message}`);
          });
      })
      .catch((error) => {
        setSnackbarMessage(`Error uploading CRM App: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };
  

  // const uploadDataToDatabase = () => {
  //   const appData = { ...userData, appName, number, numUsers };

  //   // Get a new database reference for the CRM apps collection
  //   const userAppsRef = ref(db, `${DB}/Apps/${user.uid}`);

  //   // Push the app data to the user's app collection with a generated key
  //   const newUserAppRef = push(userAppsRef);
  //   set(newUserAppRef, appData)
  //     .then(() => {
  //       setSnackbarMessage('CRM App created successfully.');
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  //       onClose()
  //     })
  //     .catch((error) => {
  //       setSnackbarMessage(`Error uploading CRM App: ${error.message}`);
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //     });
  // };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
      
      <TextField
        label="App Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        required
      />
      <TextField
        label="Number of users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        required
      />
      {/* <Typography gutterBottom>Number of Users</Typography> */}
      {/* <Slider
        value={numUsers}
        onChange={(e, newValue) => setNumUsers(newValue)}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={0}
        max={40}
      /> */}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Create CRM App
        </Button>
      </Box>
     
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </form>
  );
}

export default CreateCRMAppForm;

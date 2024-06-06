import React, { useEffect, useState } from "react";
import { Container, Button, Card, CardContent, TextField, Link, Typography, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { auth } from "../store/firebase";
import { signInWithEmailLink, GoogleAuthProvider, signInWithRedirect,sendSignInLinkToEmail } from "firebase/auth";
import Navigation from './Navigation';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import GoogleIcon from '@mui/icons-material/Google';
import { ref, get, remove, set, push} from 'firebase/database';
import { db, DB,  } from '../store/firebase';
import { useDispatch, useSelector} from 'react-redux';
import { updateDB,updateDBPath,setSelectedApp,setSelectedAppID } from '../store/Actions';
import { useAuthState } from 'react-firebase-hooks/auth';
const provider = new GoogleAuthProvider();
const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get the current location
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const isEmailSent = queryParams.get("email") === "sent"; // Check if email=sent

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const dbPath = useSelector((state) => state.app.DB);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };  
  const handleGoogleSignIn1 = () => {
    signInWithRedirect(auth, provider);
  };


  const handleEmailSignIn = () => {
    setLoading(true);
    const actionCodeSettings = {
      url: `${window.location.origin}/validate?email=sent`, // Include email=sent in the URL
      handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        setLoading(false);
        setSnackbarMessage("Check your email for the sign-in link.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate(`/signin?email=sent`); // Navigate with the query parameter
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  const handleUpdateDB =  (app) => {
    const newDBPath = `crm/${app.a}/${app.appName}/${app.b}`;
    console.log(newDBPath)
    try {
      dispatch(updateDBPath(newDBPath));
      dispatch(setSelectedApp(app.appName));
      dispatch(setSelectedAppID(app.b));
      
      // Now that the DB path is updated, navigate to the desired location
      console.log(dbPath);
      navigate(`/dashboard`); 
    } catch (error) {
      console.error('Error updating DB path:', error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      
      if (user) {
       console.log( `${DB}/users/${user.uid}`)
        const userRef = ref(db, `${DB}/users/${user.uid}`);
        get(userRef)
          .then((snapshot) => {
            setLoading(true); // Set loading to true while checking user data
         
            if (!snapshot.exists()) {
              // User data doesn't exist, prompt for app code
              const appCode = prompt("Please enter the app code:");
              if (appCode) {
                const appPathRef = ref(db, `${DB}/paths/${appCode}`);
                get(appPathRef)
                  .then((appPathSnapshot) => {
                    if (appPathSnapshot.exists()) {
                      // App code exists, retrieve app data
                      const appData = appPathSnapshot.val();
                      const { a, b } = appData;
  
                      // Retrieve appName, a, and b from {DB}/Apps/a/b
                      const appRef = ref(db, `${DB}/Apps/${a}/${b}`);
                      get(appRef)
                        .then((appSnapshot) => {
                          if (appSnapshot.exists()) {
                            // App data exists, retrieve appName
                            const { appName } = appSnapshot.val();
  
                            // Store app data in user's profile
                            const userData = {
                              appName,
                              a,
                              b,
                            };
  
                            set(userRef, userData)
                              .then(() => {
                                // Data stored, navigate to home and update the database path
                                handleUpdateDB(userData);
                                // console.log('go home');
  
                                // Store user details in {DB}/a/appName/b/agents
                                const agentsRef = ref(db, `${DB}/${a}/${appName}/${b}/agents`);
                                const userDetail = {
                                  name: user.displayName || '', // Assuming user's display name is available
                                  email: user.email || '', // Assuming user's email is available
                                  role: 'user',
                                  uid:user.uid,
                                };
                                const newUserRef = push(agentsRef); // Generate a unique key for the user entry
                                set(newUserRef, userDetail)
                                  .then(() => {
                                    console.log('User details stored in agents');
                                    setLoading(false); // Set loading to false
                                  })
                                  .catch((error) => {
                                    // Handle error while storing user details
                                    setLoading(false); // Set loading to false
                                    console.error('Error storing user details in agents:', error);
                                  });
                              })
                              .catch((error) => {
                                // Handle error
                                setLoading(false); // Set loading to false
                                console.error('Error storing app data in user profile:', error);
                              });
                          } else {
                            console.log("App data not found.");
                            setLoading(false); // Set loading to false
                          }
                        })
                        .catch((error) => {
                          // Handle error
                          setLoading(false); // Set loading to false
                          console.error(error);
                        });
                    } else {
                      // App code provided is not correct
                      console.log("App code is not correct. Please consult the app admin.");
                      setLoading(false); // Set loading to false
                    }
                  })
                  .catch((error) => {
                    // Handle error
                    setLoading(false); // Set loading to false
                    console.error(error);
                  });
              } else {
                // User canceled entering the app code
                setLoading(false); // Set loading to false
              }
            } else {
              // User data exists, retrieve it and update the database path
              get(userRef)
                .then((userSnapshot) => {
                  if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    handleUpdateDB(userData);
                    console.log('go home');
                  } else {
                    console.log("User data not found.");
                  }
                  setLoading(false); // Set loading to false
                })
                .catch((error) => {
                  // Handle error
                  setLoading(false); // Set loading to false
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            // Handle error
            setLoading(false); // Set loading to false
            console.error(error);
          });
      }
    });
  
    // Remember to return the unsubscribe function
    return () => {
      unsubscribe();
    };
  }, []);
  
  
  

  return (
    <div>
      <Navigation />

      <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
      <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
        {isEmailSent ? ( // Conditionally render based on email=sent
          <Card elevation={5}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Sent
              </Typography>
              <Typography>
                An email with the sign-in link has been sent to your email address. Please check your email to sign in.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="contained" color="primary" component={RouterLink} to="/signin">
                  Back
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card elevation={5}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sign in with Email Link
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="contained" color="primary" onClick={handleEmailSignIn}>
                  Send Sign-In Link
                </Button>
              </Box>
              <Typography variant="body2" sx={{ marginTop: "1rem" }}>
                Don't have an account?{" "}
                <Link component={RouterLink} to="/signup">
                  Sign up
                </Link>
              </Typography>
            </CardContent>
          </Card>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn1}
          >
            Sign in with Google
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
      </Container>
    </div>
  );
};

export default Login;

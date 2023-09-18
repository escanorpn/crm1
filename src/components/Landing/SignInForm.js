import React, { useEffect, useState } from "react";
import { Container, Button, Card, CardContent, TextField, Link, Typography, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { auth } from "../../store/firebase";
import { signInWithEmailLink, GoogleAuthProvider, signInWithRedirect,sendSignInLinkToEmail } from "firebase/auth";
import Navigation from '../Navigation';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import GoogleIcon from '@mui/icons-material/Google';
const provider = new GoogleAuthProvider();
const Signin = () => {
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // navigate('/home'); // Change '/home' to your actual home route
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div>
      {/* <Navigation /> */}

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

export default Signin;

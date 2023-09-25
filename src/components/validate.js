import React, { useState, useEffect } from "react";
import { Container, Button, Card, CardContent, TextField, Typography, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updateProfile } from "firebase/auth";
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';

const Validate = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
useEffect(()=>{
setLoading(true);
},[])
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDisplayNameSubmit = async () => {
    if (displayName.trim() === "") {
      setError("Display name cannot be empty");
      return;
    }

    setError(null);
    setLoading(true);

    const auth = getAuth();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        
        if (result && result.user) {
          if (result.user.displayName) {
            setLoading(false);
            navigate('/home');
          } else {
            await updateProfile(result.user, { displayName });
            setLoading(false);
            navigate('/home');
          }
        }
      } catch (error) {
        setLoading(false);
        setError("An error occurred while signing in with the email link.");
      }
    }
  };

  return (
    <div>
      <Navigation />

      <LinearProgress style={{ visibility: loading ? "visible" : "hidden" }} />
      <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sign in with Email Link
            </Typography>
         
              <React.Fragment>
                <TextField
                  label="Display Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button variant="contained" color="primary" onClick={handleDisplayNameSubmit}>
                    Complete Sign-Up
                  </Button>
                </Box>
              </React.Fragment>
         
          </CardContent>
        </Card>
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

export default Validate;

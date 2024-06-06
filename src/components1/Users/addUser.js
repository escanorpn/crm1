import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ref, push, update } from 'firebase/database';
import { db,  } from '../../store/firebase';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UserForm() {
  const [editedAgent, setEditedAgent] = useState({
    name: '',
    email: '',
    role: 'user', // Default role
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Retrieve selectedAppID from the Redux store
  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const DB = useSelector(state => state.app.DB);

  const handleSave = () => {
    console.log('nana')

    if (!editedAgent.name || !editedAgent.email) {
      showSnackbar('Please fill in all fields.', 'error');
      return;
    }
    // return
    // Assuming the email doesn't exist yet, add the user to the selected app
    if (selectedAppID) {
      const agentsRef = ref(db, `${DB}/agents/${selectedAppID}`);
      const newAgentKey = push(agentsRef).key; // Generate a new key for the new agent
      const newAgentData = { ...editedAgent, id: newAgentKey };

      setEditedAgent({}); // Clear the form after saving

      update(ref(db, `${DB}/agents/${selectedAppID}/${newAgentKey}`), newAgentData)
        .then(() => {
          showSnackbar('New agent added successfully.', 'success');
        })
        .catch(error => {
          showSnackbar('Error adding new agent.', 'error');
        });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card className="agent-form-card">
      <CardContent>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
     
          <TextField
          required
            size="small"
            label="Name"
            value={editedAgent.name}
            onChange={(e) =>
              setEditedAgent({ ...editedAgent, name: e.target.value })
            }
          />
          <TextField
          required
            size="small"
            label="Email"
            value={editedAgent.email}
            onChange={(e) =>
              setEditedAgent({ ...editedAgent, email: e.target.value })
            }
          />
      </div>
      <div>
      <TextField
      required
          id="ROles"
          select
          label="Role"
          defaultValue="user"
          helperText="Please select Role"
          variant="standard"
          value={editedAgent.role}
          onChange={(e) =>
            setEditedAgent({ ...editedAgent, role: e.target.value })
          }
        >
         
            <MenuItem value="user">User</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
     
        </TextField>
        <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
      </div>
      <div>
   
      </div>
    </Box>
        <div className="agent-form">
        
        
         
        </div>
      </CardContent>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </Card>
  );
}

export default UserForm;

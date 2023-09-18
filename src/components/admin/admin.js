import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, Visibility as VisibilityIcon, Add as AddIcon } from "@mui/icons-material";
import { functions } from "../../store/firebase"; // Import Firebase functions
import { httpsCallable } from "firebase/functions";
import DeleteIcon from '@mui/icons-material/Delete'

const Admin = () => {
  const [adminData, setAdminData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [claimsUser, setClaimsUser] = useState(null);
  const [selectedUid, setSelectedUid] = useState("");
  const [customClaimKey, setCustomClaimKey] = useState("");
  const [customClaimValue, setCustomClaimValue] = useState("");
  const [customClaims, setCustomClaims] = useState([]);
  const [userClaims, setUserClaims] = useState([]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getAdminData = async () => {
    try {
      const addMessage = httpsCallable(functions, "adminData");
      const result = await addMessage({ text: "messageText" });
      const data = result.data;
      console.log(data);
      setAdminData(result.data);
    } catch (error) {
      const message = error.message;
      console.error("Error loading data:", error);
      setSnackbarMessage("Error loading data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditCustomClaim = (uid) => {
    setSelectedUid(uid);
    setOpenDialog(true);
  };

  const handleViewCustomClaims = (uid) => {
    setSelectedUid(uid);
    setViewDialog(true);
    getCustomClaims(uid);
  };

  const handleAddCustomClaim = async () => {
    const customClaim = { [customClaimKey]: customClaimValue }; // Use [] to create a dynamic key
    console.log(customClaim, customClaimKey, customClaimValue);
    try {
      const addCustomClaim = httpsCallable(functions, "addCustomClaim");
      const response = await addCustomClaim({
        uid: claimsUser.uid,
        // customClaim: customClaim,
        customClaimKey:customClaimKey,
        customClaimValue:customClaimValue
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity(response.data.success ? "success" : "success");
      setSnackbarOpen(true);
      setOpenDialog(false);
      setCustomClaimKey("");
      setCustomClaimValue("");
      getCustomClaims(claimsUser.uid);
    } catch (error) {
      console.error("Error adding custom claim:", error);
      setSnackbarMessage("Error adding custom claim.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
};

  const getCustomClaims = async (uid) => {
    try {
      const getClaims = httpsCallable(functions, "getCustomClaims");
      const result = await getClaims({ uid });
      const data = result.data;
      const customClaims=data.customClaims;
      const customClaimsArray = Object.keys(customClaims).map((key) => {
        return { key, value: customClaims[key] };
      });
      console.log('claimsData:', customClaimsArray)
      setUserClaims( customClaimsArray);
    } catch (error) {
      console.error("Error getting custom claims:", error);
    }
  };
// Function to delete a custom claim by UID and key
const handleDeleteCustomClaim = async (claimKey) => {
    try {
      const deleteClaim = httpsCallable(functions, "deleteCustomClaim");
      const response = await deleteClaim({ uid: selectedUid, key: claimKey });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity(response.data.success ? "success" : "error");
      setSnackbarOpen(true);
      getCustomClaims(selectedUid); // Refresh custom claims after deletion
    } catch (error) {
      console.error("Error deleting custom claim:", error);
      setSnackbarMessage("Error deleting custom claim.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
 
  useEffect(() => {
    getAdminData();
  }, []);

  return (
    <Container>
      <h1>Admin Dashboard</h1>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
          {adminData && adminData.length > 0 ? (
            adminData.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.uid}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditCustomClaim(user.uid)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleViewCustomClaims(user.uid)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() =>{setClaimsUser(user);
                     setAddDialog(true)} }>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))):<>No Data</>}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Custom Claims</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Custom Claim Key</InputLabel>
          
            <Select
                value={customClaimKey}
                onChange={(e) => setCustomClaimKey(e.target.value)}
                >
                 {userClaims && userClaims.length > 0 ? (
            userClaims.map((claim, index) => (
                    <MenuItem key={claim.key} value={claim.key}>
                    {claim.key}
                    </MenuItem>
                ))) : (
                    <p>No custom claims available for this user.</p>
                    )}
                </Select>

          </FormControl>
          <TextField
            label="Custom Claim Value"
            fullWidth
            value={customClaimValue}
            onChange={(e) => setCustomClaimValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddCustomClaim}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)}>
        <DialogTitle>Custom Claims</DialogTitle>
        <DialogContent>
          <List>
            {userClaims && userClaims.length > 0 ? (
            userClaims.map((claim, index) => (
                <div key={index}>
                  <ListItem key={index}>
        <ListItemText primary={claim.key}  />
        <ListItemText  secondary={claim.value.toString()} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={() => handleDeleteCustomClaim(claim.key)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
                {index < userClaims.length - 1 && <Divider />}
                </div>
            ))
            ) : (
            <p>No custom claims available for this user.</p>
            )}
          </List>
        </DialogContent>
        <DialogActions>
  <Button onClick={() => setViewDialog(false)}>Close</Button>
</DialogActions>

      </Dialog>
      <Dialog open={Boolean(addDialog)} onClose={() => setAddDialog(false)}>
        <DialogTitle>Add Custom Claim</DialogTitle>
        {claimsUser && claimsUser!=null ?(
            <>
                <DialogTitle> Name: {claimsUser.displayName}</DialogTitle>
                <DialogTitle> Id: {claimsUser.uid}</DialogTitle>
            </>
        ):(<></>)}
        <DialogContent>
          <TextField
            label="Custom Claim Key"
            fullWidth
            value={customClaimKey}
            onChange={(e) => setCustomClaimKey(e.target.value)}
          />
          <TextField
            label="Custom Claim Value"
            fullWidth
            value={customClaimValue}
            onChange={(e) => setCustomClaimValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddCustomClaim}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,Chip 
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/WhatsApp';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ref, onValue, push, update, remove, serverTimestamp, set } from 'firebase/database'; // Import appropriate Firebase database methods
import { db,  auth } from '../../store/firebase'; // Adjust this import based on your Firebase setup
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate,  } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SendIcon from '@mui/icons-material/Send';
import ReplyTableCell from './ReplyTableCell';
import axios from 'axios';

function TicketTable() {
    const DB = useSelector(state => state.app.DB);
    const navigate = useNavigate();
  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const user = auth.currentUser;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketData, setNewTicketData] = useState({
    query: '',
    contact: '',
    status: 'open', // Default status
    assigned: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editedTicket, setEditedTicket] = useState(selectedTicket || {});
  const [changes, setChanges] = useState([]);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [ticketLogs, setTicketLogs] = useState(null);
  const [chatOpen, setChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello, how can I help you?', sender: 'other' },
    { id: 2, text: 'I have a question about your product.', sender: 'user' },
    { id: 3, text: 'Sure, what would you like to know?', sender: 'other' },
    // Add more messages here
  ])
  
  const mUrl = useSelector((state) => state.app.mUrl);
  const handleChatOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setChat(true);
  };

  const handleChatCloseDialog = () => {
    setChat(false);
  };

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };
  
  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      const newMessage = {
        id: chatMessages.length + 1,
        text: messageInput,
        sender: 'user', // Assuming the user is sending the message
      };

      setChatMessages([...chatMessages, newMessage]);
      setMessageInput('');
    }
  };
  const StatusUpdate=(status)=>{
    console.log(mUrl)
    const postData = {
      tid: selectedTicket.id,        
      status: status,
    };
    console.log(JSON.stringify(postData))
    // Make a POST request to your PHP script
    axios.post(mUrl+'?apicall=status', postData)
      .then(response => {
        console.log(response);
        // Handle the response if needed
      })
      .catch(error => {
        console.error('status failed:', error);
        // Handle the error if needed
      });
  }
    // Update the editedTicket state when selectedTicket changes
    useEffect(() => {
        setEditedTicket(selectedTicket || {});
      }, [selectedTicket]);
    
      const handleFieldChange = (field, newValue) => {
        setEditedTicket((prevEditedTicket) => ({
          ...prevEditedTicket,
          [field]: newValue,
        }));
        if(field=='status'){
          console.log('status change',newValue)
          console.log(selectedTicket.id)
          StatusUpdate(newValue)
        }
      
        const oldValue = selectedTicket ? selectedTicket[field] : '';
        const userName = user.displayName || user.email;
      
        if (oldValue !== newValue) {
         
          const change = {
            displayName: userName,
            uid: user.uid,
            timestamp: serverTimestamp(),
            field,
            oldValue,
            newValue,
          };
      
          // Upload the log entry to Firebase Realtime Database
        //   db.ref(`{DB}/tickets/logs`).push(logEntry);
      
          setChanges((prevChanges) => [...prevChanges, change]);  
          console.log(`${userName}: ${field} changed from ${oldValue} to ${newValue}`);
        }
      };
  useEffect(() => {  
    if(!user){
        navigate('/signin') 
    }

  }, [user]);

  useEffect(() => {
    if (selectedAppID) {
      const ticketsRef = ref(db, `${DB}/tickets`);
      const agentsRef = ref(db, `${DB}/agents`);

      const unsubscribeTickets = onValue(ticketsRef, snapshot => {
        if (snapshot.exists()) {
          const ticketsData = snapshot.val();
          const ticketArray = Object.entries(ticketsData).map(([ticketId, ticketData]) => ({
            id: ticketId,
            ...ticketData,
          }));
          console.log(ticketArray)
          setTickets(ticketArray);
        } else {
          setTickets([]);
        }
        setLoading(false);
      });

      const unsubscribeAgents = onValue(agentsRef, snapshot => {
        if (snapshot.exists()) {
          const agentsData = snapshot.val();
          const agentArray = Object.entries(agentsData).map(([agentId, agentData]) => ({
            id: agentId,
            ...agentData,
          }));
        //   console.log(agentArray)
          setAgents(agentArray);
        } else {
          setAgents([]);
        }
      });

      return () => {
        unsubscribeTickets();
        unsubscribeAgents();
      };
    }
  }, [selectedAppID]);

  const handleLogsDialogOpen = (ticket) => {
    // Set the current ticket in the local state variable
    setTicketLogs(ticket);
    setOpenLogsDialog(true);
  };

  const handleLogsDialogClose = () => {
    // Clear the local state variable when closing the dialog
    setTicketLogs(null);
    setOpenLogsDialog(false);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewTicketData({
      query: '',
      contact: '',
      status: 'open',
      assigned: '',
    });
  };

  const handleAddTicket = async () => {
    try {
      const newTicketRef = push(ref(db, `${DB}/tickets`));
      const createdBy = {
        uid: user.uid,
        displayName: user.displayName,
      };
      const timestamp = serverTimestamp();
      await set(newTicketRef, {
        ...newTicketData,
        createdAt: timestamp,
        createdBy: createdBy,
      });
      setSnackbarMessage('Ticket added successfully');
      setSnackbarOpen(true);
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding ticket:', error);
      setSnackbarMessage('Error adding ticket');
      setSnackbarOpen(true);
    }
  };

  const handleEditDialogOpen = ticket => {
    setSelectedTicket(ticket);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedTicket(null);
  };

  const handleEditTicket = async () => {
    setLoading(true)
    if (!selectedTicket) {
        setLoading(false)
      return;
    }
   

    try {
      const ticketRef = ref(db, `${DB}/tickets/${selectedTicket.id}`);
      await update(ticketRef, {
        query: selectedTicket.query,
        contact: selectedTicket.contact,
        status: selectedTicket.status,
        assigned: selectedTicket.assigned,
      });
      setSnackbarMessage('Ticket edited successfully');
      setSnackbarOpen(true);
      handleEditDialogClose();
      setLoading(false)
      
      try {
        const logsetRef = ref(db, `${DB}/tickets/${selectedTicket.id}/logs`);
    
        // Create an array to hold the changes
        const ticketChanges = [];
    
        // Iterate through the changes and build the array
        changes.forEach((change) => {
          ticketChanges.push(change);
        });
    
        // Update the ticket with the changes
        await update(logsetRef, {
          ...ticketChanges,
        });
        console.log('logged properly')
        setSnackbarMessage('Logs added successfully');
        setSnackbarOpen(true);
        handleEditDialogClose();
        
        setLoading(false)
      } catch (error) {
        console.error('Error editing ticket:', error);
        setSnackbarMessage('Error editing ticket');
        setSnackbarOpen(true);
        
        setLoading(false)
      }
    } catch (error) {
      console.error('Error editing ticket:', error);
      setSnackbarMessage('Error editing ticket');
      setSnackbarOpen(true);
      setLoading(false)
    }
  };

  const handleDeleteTicket = async ticketId => {
    try {
      const ticketRef = ref(db, `${DB}/tickets/${ticketId}`);
      await remove(ticketRef);
      setSnackbarMessage('Ticket deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setSnackbarMessage('Error deleting ticket');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  if (!selectedAppID) {
    return (
      <Typography variant="body1">
        Please create or select an app in the drawer.
      </Typography>
    );
  }

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }
 
  return (
    <div>
      <Card className="agent-card">
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Query</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned</TableCell>
                  <TableCell>Logs</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets ? tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    
                 
                      
                    <TableCell>  
                    <IconButton onClick={() => handleEditDialogOpen(ticket)}>
                          <EditIcon />
                        </IconButton>
                        </TableCell>
                    <TableCell>  
                      <IconButton onClick={() => handleChatOpenDialog(ticket)}>
                      
                      {ticket && ticket.qns ? (
                        <Badge badgeContent={ticket.qns} color="error">
                          <ReplyIcon color="error" /> 
                        </Badge>
                      ) : (
                        <ReplyIcon color="" />
                      )}

                        </IconButton></TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                    <TableCell>{ticket.query}</TableCell>
                    <TableCell>{ticket.contact}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.assigned}</TableCell>
                    <TableCell>    
                       
                        <IconButton onClick={()=>{handleLogsDialogOpen(ticket)}}>
                            {ticket.logs ? (
                            <Badge badgeContent={ticket.logs.length} color="error">
                                <AssignmentIcon color="error" /> 
                            </Badge>
                            ) : (
                            <AssignmentIcon /> 
                            )}
                    </IconButton>
                    </TableCell>
                    <TableCell>
                      {/* {user.uid === ticket.createdBy.uid && (
                        <>
                          <IconButton onClick={() => handleDeleteTicket(ticket.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )} */}
                          <IconButton onClick={() => handleDeleteTicket(ticket.id)}>
                            <DeleteIcon />
                          </IconButton>
                    </TableCell>
                  </TableRow>
                )
                ):(<></>)}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDialogOpen}
        startIcon={<AddIcon />}
        style={{ marginTop: '16px' }}
      >
        Add Ticket
      </Button>
      
      <ReplyTableCell open={chatOpen} onClose={handleChatCloseDialog} ticket={selectedTicket}/>

     
  
<Dialog open={openLogsDialog} onClose={handleLogsDialogClose}>
  {/* <DialogTitle>Logs</DialogTitle> */}
  <IconButton
    // edge="end"
    color="inherit"
    onClick={handleLogsDialogClose}
    style={{ position: 'absolute', top: 0, right: 0 }}
  >
    <CloseIcon />
  </IconButton>
  <DialogContent>
    {ticketLogs && ticketLogs.logs.length > 0 ? (
      <>
        <Typography variant="caption" gutterBottom>
          Created by: {ticketLogs.createdBy.displayName}
          <br />
          Created at: {new Date(ticketLogs.createdAt).toLocaleString()}
        </Typography>
        {ticketLogs.logs.map((log, index) => (
          <div key={index}>
               <Card className="agent-card">
        <CardContent>
            <Typography variant="caption">
              {/* <Chip
                // label={`${log.displayName} made change on ${log.field}, ${log.oldValue} -> ${log.newValue}`}
                label={`${log.displayName}`}
                color="primary" // You can adjust the color as needed
                style={{ marginRight: '4px' }}
              /> */}
              {log.displayName} changed {log.field}, {log.oldValue} - {log.newValue} at {new Date(log.timestamp).toLocaleString()}
            </Typography>
            </CardContent>
            </Card>
          </div>
        ))}
      </>
    ) : (
      <p>No logs available</p>
    )}
  </DialogContent>
</Dialog>


      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add New Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Query"
            value={newTicketData.query}
            onChange={e => setNewTicketData({ ...newTicketData, query: e.target.value })}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Contact"
            value={newTicketData.contact}
            onChange={e => setNewTicketData({ ...newTicketData, contact: e.target.value })}
            margin="normal"
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newTicketData.status}
              onChange={e => setNewTicketData({ ...newTicketData, status: e.target.value })}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned</InputLabel>
            <Select
              value={newTicketData.assigned}
              onChange={e => setNewTicketData({ ...newTicketData, assigned: e.target.value })}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {agents.map(agent => (
                <MenuItem key={agent.id} value={agent.name}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTicket} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent>
        <TextareaAutosize
          rowsMin={3}
          placeholder="Query"
          value={editedTicket.query || ''}
          onChange={(e) => {
            setSelectedTicket({ ...selectedTicket, query: e.target.value });
            handleFieldChange('query', e.target.value)}}
          style={{ width: '100%', marginBottom: '16px' }}
        />
        <TextField
          label="Contact"
          value={editedTicket.contact || ''}
          onChange={(e) => {
            setSelectedTicket({ ...selectedTicket, contact: e.target.value });
            handleFieldChange('contact', e.target.value)}}
          margin="normal"
          fullWidth
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={editedTicket.status || ''}
            onChange={(e) => {
                
                setSelectedTicket({ ...selectedTicket, status: e.target.value });
                handleFieldChange('status', e.target.value)}}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Assigned</InputLabel>
          <Select
            value={editedTicket.assigned || ''}
            onChange={(e) => {
                setSelectedTicket({ ...selectedTicket, assigned: e.target.value });
                handleFieldChange('assigned', e.target.value)}}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.name}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleEditTicket(editedTicket)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}

export default TicketTable;

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { db, auth } from '../../store/firebase';
import { ref, onValue, push, set, serverTimestamp, update} from 'firebase/database';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

import WhatsappIcon from '@mui/icons-material/WhatsApp';
import BotIcon from '@mui/icons-material/HeadsetMic';

const ReplyTableCell = ({ open, onClose, ticket }) => {
    const selectedAppID = useSelector((state) => state.app.selectedAppID);
    const mUrl = useSelector((state) => state.app.mUrl);
  const DB = useSelector((state) => state.app.DB);
  const user = auth.currentUser;
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Add a null check for ticket
  const chatRef = ticket ? ref(db, `${DB}/tickets/${ticket.id}/chats`) : null;
  const ticketRef = ticket ? ref(db, `${DB}/tickets/${ticket.id}`) : null;


  
  useEffect(() => {
    setChatMessages([])
    if (open) {
      setOpen(true);
      if (ticketRef) {
        const updates = {};
        updates[`qns`] = 0;
  
        update(ticketRef, updates)
          .then(() => {
            console.log('qns updated to 0');
          })
          .catch((error) => {
            console.error('Error updating qns:', error);
          });
        }
    } else {
      setOpen(false);
    }

    if (open && chatRef) {
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setChatMessages(Object.values(data));
        }
      });

      // Clean up the subscription when unmounted
      return () => {
        unsubscribe();
      };
    }
  }, [open]);

  const [isOpen, setOpen] = useState(open);

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    // let mUrl="http://localhost/crm/api.php";
    if (messageInput.trim() !== '' && chatRef) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: messageInput,
        type: 'Agent',
        sender: user.displayName || 'Agent',
        timestamp: serverTimestamp(),
      };

      push(chatRef, newMessage); // Use push to add a new message

      setMessageInput('');
      const postData = {
        selectedAppID: selectedAppID,        
        recipientWAID: ticket.contact,
        responseMessage:messageInput
      };
      console.log(JSON.stringify(postData))
      // Make a POST request to your PHP script
      axios.post(mUrl+'?apicall=sms', postData)
        .then(response => {
          console.log('Sms sent successful');
          // Handle the response if needed
        })
        .catch(error => {
          console.error('Sms failed:', error);
          // Handle the error if needed
        });
      if (chatMessages.length < 2) {
        // Prepare the data to send to the PHP script
        const postData = {
          tid: ticket.id,            // Replace with the actual ticket ID
          recipientWAID: ticket.contact,  // Replace with the actual contact
        };
        console.log(postData)
        // Make a POST request to your PHP script
        axios.post(mUrl+'?apicall=tid', postData)
          .then(response => {
            console.log('Ticket update successful');
            // Handle the response if needed
          })
          .catch(error => {
            console.error('Ticket update failed:', error);
            // Handle the error if needed
          });
      }
    
    }
  };

  const handleEditMessage = (messageId) => {
    const editedMessage = chatMessages.find((message) => message.id === messageId);
    setMessageInput(editedMessage.text);
    setEditingMessageId(messageId);
  };

  const handleSaveEditedMessage = () => {
    if (editingMessageId !== null && messageInput.trim() !== '' && chatRef) {
      const updatedMessages = chatMessages.map((message) =>
        message.id === editingMessageId ? { ...message, text: messageInput } : message
      );

      set(chatRef, updatedMessages); // Use set to update the messages

      setMessageInput('');
      setEditingMessageId(null);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Chat</DialogTitle>
        <IconButton
          color="inherit"
          onClick={handleCloseDialog}
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
       
            <List>
                {chatMessages.map((message) => (
             <ListItem
             key={message.id}
             className={`message ${
               message.sender === 'user' ? 'user-message' : 'other-message'
             }`}
           >
          <Card
  className={`agent-card ${
    message.createdBy === 'whatsapp' ? 'whatsapp-card' : 'bot-card'
  }`}
  style={{
    margin: message.createdBy === 'whatsapp' ? '0 0 0 auto' : '0 auto 0 0',
    padding: '0', // Remove padding
  }}
>
  <CardContent>
                 <div className="message-content">
                   <div className="message-header">
                     <div className="message-icon">
                       {message.createdBy === 'whatsapp' ? (
                         // Display WhatsApp logo
                         <div className="whatsapp-message">
                           <WhatsappIcon style={{ fontSize: '16px' }} />
                         </div>
                       ) : (
                         // Display Bot logo
                         <div className="bot-message">
                           <BotIcon style={{ fontSize: '16px' }} />
                         </div>
                       )}
                     </div>
                     <div className="timestamp">
                       <Typography style={{ fontSize: '11px' }} color="textSecondary">
                         {message.sender} - {new Date(message.timestamp).toLocaleString()}
                       </Typography>
                     </div>
                   </div>
                   <div className="message-text" style={{ paddingBottom: '8px' }}>
                     <Typography variant="body2">{message.text}</Typography>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </ListItem>
           
            
            
           
                ))}
            </List>
        <Box display="flex">
            <TextField
            label={editingMessageId !== null ? 'Edit your message' : 'Type a message'}
            variant="outlined"
            fullWidth
            value={messageInput}
            onChange={handleMessageInputChange}
            />
            <IconButton
            onClick={editingMessageId !== null ? handleSaveEditedMessage : handleSendMessage}
            color="primary"
            >
            {editingMessageId !== null ? <SendIcon /> : <SendIcon />}
            </IconButton>
        </Box>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default ReplyTableCell;





import React, { useState,useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Switch from '@mui/material/Switch'; // Step 1: Import the Switch component
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const BusinessCodeCard = () => {
  const whatsappNumber = process.env.REACT_APP_PHONE_NUMBER;
  const DB = useSelector(state => state.app.DB);
  const selectedAppID = useSelector((state) => state.app.selectedAppID);
  const mUrl = useSelector((state) => state.app.mUrl);
  const [isCopied, setIsCopied] = useState(false);
  const [phoneNumberSelected, setPhoneNumberSelected] = useState(false); // Step 2: Initialize switch state
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);  
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(whatsappNumber);
  const [checked, setChecked] = React.useState(true);
  useEffect(() => { handleValidation(); }, []);
  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
  };

  const openWhatsAppChat = () => {
    const message = `apid=${selectedAppID}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneNumberSelection = () => {
    setPhoneNumberSelected(!phoneNumberSelected); // Step 4: Toggle switch state
    if (!phoneNumberSelected) {
      handleValidation(); // Call handleValidation when the switch is turned on
    }
  };

  const handleValidation = async () => {

    const phoneNumberId = process.env.REACT_APP_PHONE_NUMBER_ID;
    const phoneNumber = process.env.REACT_APP_PHONE_NUMBER;
    const token = process.env.REACT_APP_TOKEN;
  
    setLoading(true); // Set a loading state (assuming this is used for UI feedback)
    console.log(DB); // Log the value of DB (assuming it's a variable in your scope)
    console.log(selectedAppID, phoneNumber); // Log selectedAppID and phoneNumber
  
    try {
      const md={
        
        Token: token, // Pass the Token
        'Phone-Number-ID': phoneNumberId, // Pass the phoneNumberId
        Version: 'v17.0',
        status: 'verified',
        phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-numeric characters from phoneNumber
        PhoneNumber: phoneNumber, // Pass the original phoneNumber
        selectedAppID: selectedAppID, // Pass selectedAppID
        path: DB,
      }
      console.log(JSON.stringify(md)+mUrl + '?apicall=whatsapp1')
      // Make an HTTP POST request using Axios
      const response = await axios.post(mUrl + '?apicall=whatsapp1', {
        Token: token, // Pass the Token
      'Phone-Number-ID': phoneNumberId, // Pass the phoneNumberId
      Version: 'v17.0',
      status: 'verified',
      phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-numeric characters from phoneNumber
      PhoneNumber: phoneNumber, // Pass the original phoneNumber
      selectedAppID: selectedAppID, // Pass selectedAppID
      path: DB,});
  
      if (response.status === 200) {
        // If the HTTP request is successful (status code 200)
        setSnackbarMessage('Validation data saved successfully'); // Display a success message
        setSnackbarOpen(true); // Open a snackbar to show the message
        console.log(response); // Log the response data (you may want to extract and use specific data)
      } else {
        // If the HTTP request is not successful
        console.error('Error saving validation data:', response.data); // Log an error message
        setSnackbarMessage('Error saving validation data'); // Display an error message
        setSnackbarOpen(true); // Open a snackbar to show the error message
      }
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      console.error('Error saving validation data:', error); // Log an error message
      setSnackbarMessage('Error saving validation data'); // Display an error message
      setSnackbarOpen(true); // Open a snackbar to show the error message
    } finally {
      setLoading(false); // Set the loading state to false (assuming this is used for UI feedback)
    }
  };
  const handleChange = (event) => {
    setChecked(event.target.checked);
    handleValidation();
  };

  return (
    <>
     
     <Card style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h5" component="div">
            Business Code
          </Typography>
          
        </CardContent>
      </Card>
     <Card style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
         
          <Typography variant="body2" color="text.secondary">
            {selectedAppID}
          </Typography>
          <CopyToClipboard text={selectedAppID} onCopy={handleCopy}>
            <Button
              variant="outlined"
              color="primary"
              style={{ minWidth: 0, padding: '4px' }}
            >
              <FileCopyIcon fontSize="small" />
              Copy
            </Button>
          </CopyToClipboard>
          {isCopied && <span style={{ color: 'green' }}>Copied!</span>}
        </CardContent>
      </Card>
      <Card style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Switch
  checked={checked}
  onChange={handleChange}
  inputProps={{ 'aria-label': 'controlled' }}
  label="Activate"
/>
        
          <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group"> Phone Number</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handlePhoneNumberSelection}
      >
        <FormControlLabel value={whatsappNumber} control={<Radio />} label={whatsappNumber} />
      </RadioGroup>
    </FormControl>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        onClick={openWhatsAppChat}
        style={{ marginTop: '10px' }}
      >
        Chat on WhatsApp
      </Button>
    </>
  );
};

export default BusinessCodeCard;

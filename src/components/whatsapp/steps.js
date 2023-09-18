import React, { useState,useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Container,
  Button,
  TextField,
  LinearProgress,
  Snackbar,
  Tabs,
  Tab, 
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  ref,
  push,
  serverTimestamp,
  set, 
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
} from 'firebase/database'; // Import Firebase database methods
import { db, } from '../../store/firebase'; // Adjust this import based on your Firebase setup
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import the CopyToClipboard component
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import the SyntaxHighlighter component
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import axios from 'axios';

function WhatsappRegistrationGuide() {
  const DB = useSelector(state => state.app.DB);
  const selectedAppID = useSelector((state) => state.app.selectedAppID);
  const [activeStep, setActiveStep] = useState(0);
  const [token, setToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added phone number state
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedNumber, setVerifiedNumber] = useState('');
  const [tabsValue, setTabsValue] = useState(0); // For managing the active tab
  const [features, setFeatures] = useState({
    collectTickets: false,
    sendPromotionalMessages: false,
    // Add more features here
  });


  // Listen to database changes for verified number
  useEffect(() => {
    if (selectedAppID) {
      const dataRef = ref(db, `${DB}/whatsapp/${selectedAppID}`);
    //   const agentsRef = ref(db, `${DB}/agents/${selectedAppID}`);

      const unsubscribe = onValue(dataRef, snapshot => {
        if (snapshot.exists()) {
            console.log('snapshot')
          const data = snapshot.val();
          setVerifiedNumber(data.PhoneNumber);
        } else {
          setVerifiedNumber('');
        }

      });

      return () => {
        unsubscribe();
      };
    } else {
      setVerifiedNumber('');
    }
  }, [selectedAppID]);


  const updateAccount = (key, value) => {
    const updatedFeatures = { ...features, [key]: value };
    setFeatures(updatedFeatures);
  
    // Update Realtime Database
    const dataRef = ref(db, `${DB}/whatsapp/${selectedAppID}`);
    const updates = { [key]: value };
    
    update(dataRef, updates, (error) => {
      if (error) {
        console.error('Error updating account features:', error);
      } else {
        console.log('Account features updated successfully.');
      }
    });
  };
  
  


  const handleTabChange = (event, newValue) => {
    setTabsValue(newValue);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

// Handle validation using Axios
const handleValidation = async () => {
  setLoading(true);
  console.log(DB)
console.log(selectedAppID,phoneNumber)
  try {
      const response = await axios.post('http://localhost/crm/api.php?apicall=whatsapp', {
          Token: token,
          'Phone-Number-ID': phoneNumberId,
          Version: 'v17.0',
          status: 'unverified',
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          verificationCode: verificationCode,
          PhoneNumber: phoneNumber,
          selectedAppID: selectedAppID,
          path: DB,
      });

      if (response.status === 200) {
          setSnackbarMessage('Validation data saved successfully');
          setSnackbarOpen(true);
          console.log(response)
      } else {
          console.error('Error saving validation data:', response.data);
          setSnackbarMessage('Error saving validation data');
          setSnackbarOpen(true);
      }
  } catch (error) {
      console.error('Error saving validation data:', error);
      setSnackbarMessage('Error saving validation data');
      setSnackbarOpen(true);
  } finally {
      setLoading(false);
  }
};
  // const handleValidation = async () => {
  //   setLoading(true);

  //   try {
  //     const dataRef = ref(db, `${DB}/whatsapp/${selectedAppID}`);
  //     const timestamp = serverTimestamp();

  //     await set(dataRef, {
  //       Token: token,
  //       'Phone-Number-ID': phoneNumberId,
  //       Version: 'v17.0',
  //       status: 'unverified',
  //       phoneNumber:phoneNumber.replace(/\D/g, ''),
  //       verificationCode:verificationCode,
  //       serverTimestamp: timestamp,
  //       PhoneNumber: phoneNumber, // Save phone number in the database
  //     });

  //     setSnackbarMessage('Validation data saved successfully');
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     console.error('Error saving validation data:', error);
  //     setSnackbarMessage('Error saving validation data');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
  const generateWhatsAppUrl = () => {
    // const adminNumber='254775478701'
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    return `https://wa.me/${cleanedPhoneNumber}`;
  };

  const CodeSnippet = ({ code }) => {
    return (
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <CopyToClipboard text={code}>
            <Button
              variant="outlined"
              color="primary"
              style={{ minWidth: 0, padding: '4px' }}
            >
              <FileCopyIcon fontSize="small" />
              Copy
            </Button>
          </CopyToClipboard>
        </div>
        <SyntaxHighlighter language="javascript" style={docco}>
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const steps = [
 
    {
        label: 'Integrate WhatsApp API into Your Application',
        content:
        <div>
          <Typography>
            Follow the integration guide provided by WhatsApp to add the WhatsApp API functionality to your application.
            Use the link below:
          </Typography>
          <CodeSnippet
            code={`https://crm.lmglobalexhibitions.com/?metad=${selectedAppID}`}
          />
          <Button
            variant="outlined"
            color="secondary"
            href="https://developer.whatsapp.com/business/api"
            target="_blank"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Go to Resource
          </Button>
        </div>,
      },
      {
        label: 'Validate WhatsApp Integration',
        content: (
          <div>
            <TextField
              label="Token"
              fullWidth
              margin="normal"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <TextField
              label="Phone-Number-ID"
              fullWidth
              margin="normal"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
            />
            <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
            <TextField
            label="4-Digit Code"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            error={verificationCode.length !== 4} // Set error state if code length is not 4
            helperText={
                verificationCode.length !== 4 ? 'Enter a 4-digit code' : ''
            }
            inputProps={{
                maxLength: 4,
                inputMode: 'numeric',
                pattern: '[0-9]*', // Only allow numeric input
            }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidation}
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
              {loading ? <LinearProgress sx={{ width: '100%' }} /> : 'Validate'}
            </Button>
          </div>
        ),
      },
   
    {
      label: 'Generate WhatsApp URL',
      content: (
        <div>
          <Typography>
            Click the button below to generate a WhatsApp URL then send the bellow code to the number.
          </Typography>
          <CodeSnippet
            code={`passCode=${verificationCode}`}
          />
          <Button
            variant="contained"
            color="primary"
            href={generateWhatsAppUrl()}
            target="_blank"
            sx={{ marginTop: 2 }}
          >
            Generate WhatsApp URL
          </Button>
        </div>
      ),
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  return (
    <Container maxWidth="md">
    <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
      <Tabs
        value={tabsValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Steps" />
        <Tab label="My Account" />
      </Tabs>
      <div>
        {tabsValue === 0 && (
            <>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      
          <Typography sx={{ marginTop: 2 }}>
            {steps[activeStep].content}
          </Typography>
          </>
        )}
        {tabsValue === 1 && (
          <div>
             <Container>
      <Typography variant="h6">My Account</Typography>
      {verifiedNumber ? (
        <div>
          <Typography>
            Your account is verified with the phone number: {verifiedNumber}
          </Typography>
          <Typography>
            You can now access the following features:
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={features.collectTickets}
                onChange={() => updateAccount('collectTickets', !features.collectTickets)}
              />
            }
            label="Collect Tickets"
          />
          <Typography>
            Enable this switch to start collecting tickets from customers.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={features.sendPromotionalMessages}
                onChange={() => updateAccount('sendPromotionalMessages', !features.sendPromotionalMessages)}
              />
            }
            label="Send Promotional Messages"
          />
          <Typography>
            Enable this switch to send promotional messages to your customers.
          </Typography>
          {/* Add more feature switches and explanations as needed */}
        </div>
      ) : (
        <Typography>
          Your account is not yet verified. Please complete the verification process to access these features.
        </Typography>
      )}
    </Container>
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ marginTop: 2 }}
          disabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
        <Button
          onClick={handleBack}
          sx={{ marginTop: 2, marginLeft: 2 }}
          disabled={activeStep === 0}
        >
          Back
        </Button>
      </div>
    </Paper>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      message={snackbarMessage}
    />
  </Container>
  );
}

export default WhatsappRegistrationGuide;

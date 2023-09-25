import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { auth, fdb } from '../../store/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FileCopyIcon from '@mui/icons-material/FileCopy'; // Import copy icon
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Finance = () => {
  const [financeData, setFinanceData] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setError('Not logged in');
      setSnackbarOpen(true);
    }
  }, [user]);

  const calculateDaysRemaining = (expirationTimestamp) => {
    if (expirationTimestamp && expirationTimestamp.seconds) {
      const expirationDate = new Date(expirationTimestamp.seconds * 1000);
      const currentDate = new Date();
      const timeDifference = expirationDate - currentDate;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return daysRemaining > 0 ? daysRemaining : 0;
    }
    return '0';
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    } else {
      return 'N/A';
    }
  };

  const copyBillCode = (billCode) => {
    // Function to copy the bill code to the clipboard
    navigator.clipboard.writeText(billCode);
  };

  const truncateBillCode = (billCode, length) => {
    if (billCode && billCode.length > length) {
      return billCode.substring(0, length) + '...';
    }
    return billCode;
  };

  const handleCardClick = (propertyId) => {
    // Handle card click to navigate to Units component if unitCount is not 0 or N/A
    const selectedProperty = financeData.find((finance) => finance.id === propertyId);
console.log(propertyId,financeData)
    if (selectedProperty && selectedProperty.unitCount !== 'N/A' && selectedProperty.unitCount !== 0) {
      // history.push(`/units/${propertyId}`);
    }
  };
  const fetchData = () => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(fdb, 'kjani', 'Entity', user.uid),
        (snapshot) => {
          const data = [];
          snapshot.forEach((snap) => {
            const finance = snap.data();
            // Add the document ID (pid) to the data
            const financeWithPid = { ...finance, pid: snap.id };
            data.push(financeWithPid);
          });
          console.log('Data: ', data);
          setFinanceData(data);
        },
        (error) => {
          console.log('Error fetching finance data:', error);
          setError(
            'Failed to fetch finance data. Please check your network connection.'
          );
          setSnackbarOpen(true);
        }
      );
  
      return () => unsubscribe();
    } else {
      console.log('Not logged in');
      setError('Not logged in');
      setSnackbarOpen(true);
      return;
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>Finance Data</h1>
      <Grid container spacing={2}>
        {financeData.map((finance, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleCardClick(finance.id)}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {finance.name ? finance.name : 'N/A'}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {finance.location ? (
                    <Chip icon={<LocationOnIcon />} label={finance.location} />
                  ) : (
                    'N/A'
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Expiration Date: {formatTimestamp(finance.ExpirationDate)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Period: {finance.Period ? finance.Period : '0'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bill Code:{' '}
                  {finance.billCode ? (
                    <>
                      <span>
                        {truncateBillCode(finance.billCode, 5)}
                      </span>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton
                          aria-label="copy"
                          onClick={() => copyBillCode(finance.billCode)}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    'N/A'
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {finance.status ? finance.status : 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {finance.ExpirationDate ? (
                    <>
                      <AccessTimeIcon /> Days Remaining:{' '}
                      {calculateDaysRemaining(finance.ExpirationDate)}
                    </>
                  ) : (
                    'N/A'
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unit Count: {finance.unitCount !== undefined ? finance.unitCount : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </div>
  );
};

export default Finance;

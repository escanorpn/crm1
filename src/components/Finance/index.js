import React, { useState, useEffect } from 'react';
import {
  Grid,
  Snackbar,
  Breadcrumbs,
  Link,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { NavigateNext } from '@mui/icons-material';
import { auth, fdb } from '../../store/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import Entity from './Entity';
import Units from './Units';
import Payments from './Payments'; // Import the Payments component

const Finance = () => {
  const [financeData, setFinanceData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]); // State for Payments data
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const [showPayments, setShowPayments] = useState(false); // State to show Payments
  const user = auth.currentUser;
  const [selectedProperty, setSelectedProperty] = useState(null);
  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setError('Not logged in');
      setSnackbarOpen(true);
    }
  }, [user]);

  useEffect(() => {
    if (showUnits) {
      fetchUnitData();
    }
    if (showPayments) {
      fetchPaymentsData(); // Fetch Payments data when showPayments is true
    }
  }, [showUnits, selectedProperty, showPayments]); // Add showPayments to the dependency array

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
    navigator.clipboard.writeText(billCode);
  };

  const truncateBillCode = (billCode, length) => {
    if (billCode && billCode.length > length) {
      return billCode.substring(0, length) + '...';
    }
    return billCode;
  };

  const handleCardClick = (selectedProperty) => {
    if (selectedProperty && selectedProperty.unitCount !== 'N/A' && selectedProperty.unitCount !== 0) {
      setSelectedProperty(selectedProperty);
      setShowUnits(true);
      setShowPayments(false); // Hide Payments when clicking on a property
    }
  };

  const handlePaymentsClick = (selectedProperty) => {
    setShowPayments(true);
    setSelectedProperty(selectedProperty);
    setShowUnits(false); // Hide Units when clicking on Payments
  };

  const fetchUnitData = async () => {
    if (user && selectedProperty) {
      try {
        const unitCollectionRef = collection(
          fdb,
          'kjani',
          'Entity',
          user.uid,
          selectedProperty.pid,
          'Units'
        );
        const unitSnapshot = await getDocs(unitCollectionRef);
        const unitData = unitSnapshot.docs.map((doc) => doc.data());
        setUnitData(unitData);
      } catch (error) {
        console.error('Error fetching unit data:', error);
        setError('Failed to fetch unit data. Please check your network connection.');
        setSnackbarOpen(true);
      }
    }
  };

  const fetchPaymentsData = async () => {
    if (user && selectedProperty) {
      try {
        const paymentsCollectionRef = collection( // Change the collection path to fetch Payments data
          fdb,
          'kjani',
          'Entity',
          user.uid,
          selectedProperty.pid,
          'payments' // Assuming 'payments' is the correct subcollection name
        );
        const paymentsSnapshot = await getDocs(paymentsCollectionRef);
        const paymentsData = paymentsSnapshot.docs.map((doc) => doc.data());
        setPaymentsData(paymentsData); // Set Payments data in state
      } catch (error) {
        console.error('Error fetching Payments data:', error);
        setError('Failed to fetch Payments data. Please check your network connection.');
        setSnackbarOpen(true);
      }
    }
  };
  const fetchData = () => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(fdb, 'kjani', 'Entity', user.uid),
        (snapshot) => {
          if (!snapshot || snapshot.empty) {
            // Handle the case when the snapshot is empty or undefined
            console.log('Snapshot is empty or undefined');
            return;
          }
  
          const data = [];
          snapshot.forEach((snap) => {
            const finance = snap.data();
            const financeWithPid = { ...finance, pid: snap.id };
            data.push(financeWithPid);
          });
  
          setFinanceData(data);
        },
        (error) => {
          console.error('Error fetching finance data:', error);
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
      {showUnits || showPayments ? ( // Show breadcrumb only if showUnits or showPayments is true
        <div>
          <h2>{showUnits ? 'Units Data' : 'Payments Data'}</h2>
          <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: "15px" }}>
            <StyledBreadcrumb
              onClick={() => {
                setShowUnits(false);
                setShowPayments(false);
              }}
              label="Finance Data"
              icon={<HomeIcon fontSize="small" />}
            />
            {showUnits && (
              <StyledBreadcrumb
                label="Units"
                // onClick={handlePaymentsClick} 
              />
            )}
            {showPayments && (
              <StyledBreadcrumb
                label="Payments"
                // onClick={() => setShowPayments(true)}
              />
            )}
          </Breadcrumbs>
        </div>
      ) : (
        <h3>Entity Data</h3>
      )}
      <Grid container spacing={2}>
        {showUnits ? (
          unitData.map((unit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Units unit={unit} />
            </Grid>
          ))
        ) : showPayments ? (
          paymentsData.map((payment, index) => (
            <Grid item xs={12} sm={12} md={4} key={index}>
              <Payments payment={payment} />
            </Grid>
          ))
        ) : (
          financeData.map((finance, index) => (
            <Grid item xs={12} sm={12} md={4} key={index}>
              <Entity
                data={finance}
                handlePaymentsClick={handlePaymentsClick}
                handleCardClick={handleCardClick}
                copyBillCode={copyBillCode}
                calculateDaysRemaining={calculateDaysRemaining}
                formatTimestamp={formatTimestamp}
                truncateBillCode={truncateBillCode}
              />
            </Grid>
          ))
        )}
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

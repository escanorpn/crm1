import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';

const Units = ({ unit }) => {
  // Function to group SMS data by month and calculate total amount
  const groupSmsDataByMonth = () => {
    if (!unit || !unit.smsData || unit.smsData.length === 0) {
      // Handle the case when unit or smsData is empty or undefined
      return { smsDataByMonth: {}, totalAmount: 0 };
    }

    const smsDataByMonth = {};
    let totalAmount = 0;

    unit.smsData.forEach((sms) => {
      const dateParts = sms.date.split('/');
      const monthKey = `${dateParts[1]}/${dateParts[2]}`;

      if (!smsDataByMonth[monthKey]) {
        smsDataByMonth[monthKey] = {
          month: new Date(`${dateParts[2]}-${dateParts[1]}-01`).toLocaleString('en-us', { month: 'short' }) + ' ' + dateParts[2],
          smsList: [],
          totalAmount: 0,
        };
      }

      const amount = parseFloat(sms.amount.replace(/,/g, ''));
      smsDataByMonth[monthKey].smsList.push(sms);
      smsDataByMonth[monthKey].totalAmount += amount;
      totalAmount += amount;
    });

    return { smsDataByMonth, totalAmount };
  };

  const { smsDataByMonth, totalAmount } = groupSmsDataByMonth();

  return (
    <>
      {unit && (
        <Card key={unit.id}>
          <CardContent>
            <Chip
              icon={<HomeIcon />}
              label={<Typography variant="body2">{unit.name ? unit.name : 'N/A'}</Typography>}
              size="small"
              style={{ marginBottom: '8px' }}
            />
            <List dense>
              {unit.tenantName && (
                <ListItem>
                  <ListItemText
                    primary={<Typography variant="caption" color="textSecondary">Tenant Name: {unit.tenantName}</Typography>}
                  />
                </ListItem>
              )}
              {unit.tenantMobileNumber && (
                <ListItem>
                  <ListItemText
                    primary={<Typography variant="caption" color="textSecondary">Tenant Mobile Number: {unit.tenantMobileNumber}</Typography>}
                  />
                </ListItem>
              )}
              <ListItem>
                <ListItemText
                  primary={<Typography variant="caption" color="textSecondary">Occupied: {unit.occupied ? 'Yes' : 'No'}</Typography>}
                />
              </ListItem>
            </List>
            <div style={{ marginTop: '7px', marginBottom: '8px' }}>
              {Object.values(smsDataByMonth).map((monthData) => (
                <Accordion key={monthData.month} style={{ marginTop: '8px' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="caption" color="textSecondary" style={{ paddingRight: '8px' }}>
                      {monthData.month}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total: {monthData.totalAmount.toFixed(2)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {monthData.smsList.map((sms) => (
                        <ListItem key={sms._id} style={{ padding: '4px 0' }}>
                          <ListItemText primary={`${sms.date}: ${sms.amount}`} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
            <Chip label={`Overall Total Amount: ${totalAmount.toFixed(2)}`} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Units;

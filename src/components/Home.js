import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Navigation from './Navigation';
function Home() {
  return (
    <div className="app">
       <Navigation />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Welcome to Our CRM App!
              </Typography>
              <Typography variant="body1" paragraph>
                This is a powerful CRM application that allows you to manage your clients, tasks, and tickets seamlessly.
              </Typography>
              <Typography variant="body1">
                Click the button below to get started and navigate to the dashboard.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/dashboard"
                sx={{ marginTop: 2 }}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more cards here */}
      </Grid>
    </div>
  );
}

export default Home;

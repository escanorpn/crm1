import React from 'react';
import { Box, Container, Grid, Typography, Link, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Facebook, Twitter, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        // backgroundColor: 'primary.main',
        // color: 'white',
        pt: 6,
        pb: 6,
        backgroundImage: 'url(assets/images/shape/pattern-8.png)',
        backgroundSize: 'cover',
        boxShadow: "2px -5px 20px 3px black",
        marginTop:"55px"
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Member Of
            </Typography>
            {/* Uncomment and replace with your image */}
            {/* <img src="assets/images/asdasdq.png" alt="Member Image" /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Our Services
            </Typography>
            <List>
              {['3D Stall Design', 'Exhibition Stand Design', 'Exhibitions Booth Design', 'Exhibition Stall Fabrication', 'Exhibition Stand Building', 'Exhibition Booth Construction'].map((service, index) => (
                <ListItem key={index}>
                  <ListItemText primary={service} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <List>
              {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Ludhiana'].map((location, index) => (
                <ListItem key={index}>
                  <ListItemText primary={location} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Details
            </Typography>
            <Typography variant="body1" paragraph>
              G66, 3rd floor, Sarita Vihar Road near Kalindi Kunj New Delhi-110025
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Call Us : " secondary={<Link href="tel:+91 9560484091" color="inherit">+91-9560484091</Link>} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Call Us : " secondary={<Link href="tel:+91 9899921643" color="inherit">+91-9899921643</Link>} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Mail us : " secondary={<Link href="mailto:info@artemim.in" color="inherit">info@artemim.in</Link>} />
              </ListItem>
            </List>
            <Box>
              <IconButton color="inherit" href="https://www.facebook.com/artemimexhibitions/">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com/ArtemimExhibit1">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="https://api.whatsapp.com/send?phone=9560484091&amp;text=Artemim%20Exhibitions">
                <WhatsApp />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ backgroundColor: '#626262', py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="inherit" align="center">
            LMG All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;

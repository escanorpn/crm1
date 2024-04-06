import React from "react";
import { Card, Typography, Grid, TextField, Button } from "@mui/material";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const ContactUs = () => (
  <div className="navigation-top">
    <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
      {/* <Typography variant="h6" style={{ textAlign: "center" }}>Contact Us</Typography>
      <Typography variant="body1" style={{ textAlign: "center" }}>Email: example@example.com</Typography>
      <Typography variant="body1" style={{ textAlign: "center" }}>Phone: +1 123-456-7890</Typography> */}

      {/* Google Map */}
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBWOKuh22JCvair9EPYCCV3m3CMrsAPX6Q' }} // Replace with your own API key
          defaultCenter={{ lat: -1.3071414382149036, lng: 36.83061428585001 }}
          defaultZoom={15}
        >
          <AnyReactComponent
            lat={-1.3071414382149036}
            lng={36.83061428585001}
            text="LMG" />
        </GoogleMapReact>
      </div>

      {/* Contact Information Cards */}
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <Card style={{ padding: "16px", textAlign: "center" }}>
            <Typography variant="h6">WhatsApp Number</Typography>
            <Typography variant="body1">+254700695522</Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ padding: "16px", textAlign: "center" }}>
            <Typography variant="h6">Call</Typography>
            <Typography variant="body1">+254700695522</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Contact Form */}
      <Card style={{ padding: "16px", marginTop: "20px" }}>
        <Typography variant="h6" style={{ marginBottom: "16px" }}>Contact Us</Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Name" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="E-mail" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone Number" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Message" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">Submit</Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Card>
  </div>
);

export default ContactUs;

import React from "react";
import { Card, Typography, Grid, TextField, Button } from "@mui/material";
import GoogleMapReact from 'google-map-react';
import { maps } from "../../store/firebase";
import Navigation from "./Navigation";

const Pin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="red"
  >
    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.379 0-2.5-1.121-2.5-2.5s1.121-2.5 2.5-2.5 2.5 1.121 2.5 2.5-1.121 2.5-2.5 2.5z"/>
  </svg>
);

const AnyReactComponent = ({ lat, lng, text }) => (
  <div style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}>
    <Pin />
    <Typography style={{color:"#000"}}><b>{text}</b></Typography>
  </div>
);

const ContactUs = () => (
  <div className="navigation-top" style={{ width: "100%", minHeight: "99vh", overflow: "auto" ,background: "linear-gradient(193deg, rgb(79, 126, 181), rgb(0 0 0) 74%)"}}>
   <Navigation  />
    <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: maps }}
          defaultCenter={{ lat: -1.3071414382149036, lng: 36.83061428585001 }}
          defaultZoom={15}
        >
          <AnyReactComponent
            lat={-1.3071414382149036}
            lng={36.83061428585001}
            text="LMG"
          />
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

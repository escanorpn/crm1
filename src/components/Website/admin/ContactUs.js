import React from "react";
import { Card, Typography } from "@mui/material";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const ContactUs = () => {

  return (
    <div className="navigation-top">
      <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
        <Typography variant="h6" style={{ textAlign: "center" }}>Contact Us</Typography>
        <Typography variant="body1" style={{ textAlign: "center" }}>Email: example@example.com</Typography>
        <Typography variant="body1" style={{ textAlign: "center" }}>Phone: +1 123-456-7890</Typography>
        
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
              text="Your Location"
            />
          </GoogleMapReact>
        </div>
      </Card>
    </div>
  );
};

export default ContactUs;

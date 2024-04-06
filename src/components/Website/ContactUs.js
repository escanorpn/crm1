import React from "react";
import { Card, Typography } from "@mui/material";
import Navigation from "./Navigation";
const ContactUs = () => {

  return (
    
    <div className="navigation-top">
    <Navigation  />
    <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
      <Typography variant="h6" style={{ textAlign: "center" }}>Contact Us</Typography>
      <Typography variant="body1" style={{ textAlign: "center" }}>Email: example@example.com</Typography>
      <Typography variant="body1" style={{ textAlign: "center" }}>Phone: +1 123-456-7890</Typography>
    </Card>
    </div>
  );
};

export default ContactUs;

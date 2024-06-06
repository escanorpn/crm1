import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Snackbar, Box, LinearProgress, Grid } from "@mui/material";
import { ref, get, set } from "firebase/database";
import { db } from "../../store/firebase";
import AddBoxIcon from "@mui/icons-material/AddBox";

const ContactInfo = ({ DB }) => {
  const [emails, setEmails] = useState(["", ""]);
  const [phoneNumbers, setPhoneNumbers] = useState(["", ""]);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [socialMediaHandles, setSocialMediaHandles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [contactInfoExists, setContactInfoExists] = useState(false);

  useEffect(() => {
    // Load existing contact information when component mounts
    const contactInfoRef = ref(db, `${DB}/contactInfo`);
    get(contactInfoRef)
      .then((snapshot) => {
        const existingContactInfo = snapshot.val();
        if (existingContactInfo) {
          setEmails(existingContactInfo.emails || ["", ""]);
          setPhoneNumbers(existingContactInfo.phoneNumbers || ["", ""]);
          setWhatsAppNumber(existingContactInfo.whatsAppNumber || "");
          setSocialMediaHandles(existingContactInfo.socialMediaHandles || []);
          setContactInfoExists(true);
        }
      })
      .catch((error) => {
        console.error("Error loading contact information:", error);
      });
  }, [DB]);

  const handleAddContactInfo = () => {
    if (DB && (emails.some((email) => email.trim() !== "") || phoneNumbers.some((number) => number.trim() !== "") || whatsAppNumber.trim() !== "")) {
      setIsLoading(true);

      const contactInfoRef = ref(db, `${DB}/contactInfo`);
      const newContactInfo = {
        emails,
        phoneNumbers,
        whatsAppNumber: whatsAppNumber.trim(),
        socialMediaHandles,
      };

      set(contactInfoRef, newContactInfo)
        .then(() => {
          setSnackbarMessage("Contact information added successfully!");
        })
        .catch((error) => {
          console.error("Error adding contact information:", error);
          setSnackbarMessage("Error adding contact information");
        })
        .finally(() => {
          setIsLoading(false);
          setSnackbarOpen(true);
        });
    }
  };

  const handleDeleteContactInfo = () => {
    if (DB) {
      setIsLoading(true);

      const contactInfoRef = ref(db, `${DB}/contactInfo`);
      set(contactInfoRef, null)
        .then(() => {
          setSnackbarMessage("Contact information deleted successfully!");
          setEmails(["", ""]);
          setPhoneNumbers(["", ""]);
          setWhatsAppNumber("");
          setSocialMediaHandles([]);
          setContactInfoExists(false);
        })
        .catch((error) => {
          console.error("Error deleting contact information:", error);
          setSnackbarMessage("Error deleting contact information");
        })
        .finally(() => {
          setIsLoading(false);
          setSnackbarOpen(true);
        });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email 1"
              fullWidth
              value={emails[0]}
              onChange={(e) => setEmails([e.target.value, emails[1]])}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email 2"
              fullWidth
              value={emails[1]}
              onChange={(e) => setEmails([emails[0], e.target.value])}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number 1"
              fullWidth
              value={phoneNumbers[0]}
              onChange={(e) => setPhoneNumbers([e.target.value, phoneNumbers[1]])}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number 2"
              fullWidth
              value={phoneNumbers[1]}
              onChange={(e) => setPhoneNumbers([phoneNumbers[0], e.target.value])}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="WhatsApp Number"
              fullWidth
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
            />
          </Grid>
          {/* Add more fields for social media handles as needed */}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={handleAddContactInfo}
          disabled={isLoading}
        >
          {contactInfoExists ? "Update Contact Information" : "Add Contact Information"}
        </Button>
        {contactInfoExists && (
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={handleDeleteContactInfo}
            disabled={isLoading}
          >
            Delete Contact Information
          </Button>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </CardContent>
    </Card>
  );
};

export default ContactInfo;

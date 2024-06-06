import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Snackbar, Box, LinearProgress } from "@mui/material";
import { ref, push, set, onValue, off, get } from "firebase/database";
import { db } from "../../store/firebase";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AddHeroSectionText = ({ DB }) => {
  const [heroText, setHeroText] = useState("");
  const [name, setName] = useState(""); // Added state for the name
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Load existing hero text when component mounts
    const heroTextRef = ref(db, `${DB}/heroSection/texts`);

    // Separate function for onValueCallback logic
    const onValueCallback = (snapshot) => {
      const existingHeroText = snapshot.val();
      if (existingHeroText) {
        setHeroText(existingHeroText.text || "");
        setName(existingHeroText.name || ""); // Set name if available
      }
    };

    // Use once instead of onValue to read data only once
    get(heroTextRef).then((snapshot) => {
      onValueCallback(snapshot);
    });

    return () => {
      // Cleanup: Unsubscribe from onValue when component unmounts
      off(heroTextRef, onValueCallback);
    };
  }, [DB]);

  const handleAddHeroText = () => {
    if (DB && heroText.trim() !== "") {
      setIsLoading(true);

      const heroTextRef = ref(db, `${DB}/heroSection/texts`);

      // Check if hero text already exists
      get(heroTextRef).then((snapshot) => {
        const existingHeroText = snapshot.val();
        if (existingHeroText) {
          // Update existing hero text
          set(heroTextRef, { text: heroText, name }) // Include name in the update
            .then(() => {
              setSnackbarMessage("Hero text updated successfully!");
            })
            .catch((error) => {
              console.error("Error updating hero text:", error);
              setSnackbarMessage("Error updating hero text");
            })
            .finally(() => {
              setIsLoading(false);
              setSnackbarOpen(true);
            });
        } else {
          // Add new hero text
          const newHeroTextRef = push(heroTextRef);
          set(newHeroTextRef, { text: heroText, name }) // Include name in the new entry
            .then(() => {
              setSnackbarMessage("Hero text added successfully!");
            })
            .catch((error) => {
              console.error("Error adding hero text:", error);
              setSnackbarMessage("Error adding hero text");
            })
            .finally(() => {
              setIsLoading(false);
              setSnackbarOpen(true);
            });
        }
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
        <TextField
          label="Name" // New text field for name
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Hero Section Text"
          fullWidth
          value={heroText}
          onChange={(e) => setHeroText(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={handleAddHeroText}
          disabled={isLoading}
        >
          {heroText.trim() !== "" ? "Update Hero Text" : "Add Hero Text"}
        </Button>

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

export default AddHeroSectionText;

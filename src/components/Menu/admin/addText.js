import React, { useState, useEffect } from "react";
import { TextField, Button} from "@mui/material";
import { ref, set, get } from "firebase/database";
import { db } from "../../../store/firebase";
import { useSelector } from "react-redux";

const DatabaseTextField = ({ path, multiline, value, type }) => {
  const [editedText, setEditedText] = useState(value || "");
  const [existingData, setExistingData] = useState(null);
  const DB = useSelector((state) => state.app.DB);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSnapshot = await get(ref(db, path));
        if (dataSnapshot.exists()) {
          setExistingData(dataSnapshot.val());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [path]);

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleSave = () => {
    console.log('submitting');
    if (existingData) {
      // If data exists, update it
      set(ref(db, `${DB}/${path}`), { ...existingData, [type]: editedText })
        .then(() => {
          console.log("Data updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    } else {
      // If data doesn't exist, set a new value
      set(ref(db, `${DB}/${path}`), { [type]: editedText })
        .then(() => {
          console.log("New data set successfully!");
        })
        .catch((error) => {
          console.error("Error setting new data:", error);
        });
    }
  };

  return (
    <>
    <TextField
      label="Edit Text"
      fullWidth
      multiline={multiline}
      value={editedText}
      onChange={handleTextChange}
      onBlur={handleSave}
    />
    {/* <Button onClick={handleSave}>Save</Button> */}
    </>
  );
};

export default DatabaseTextField;

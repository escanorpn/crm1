import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Box,
  LinearProgress,
  TextField,
} from "@mui/material";
import { CardActions } from "@mui/material";
import {
  ref,
  push,
  set,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../../store/firebase";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import {
  IconButton,
  Grid,
  Typography,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Upload";
import MapIcon from "@mui/icons-material/MapRounded"
import DeleteIcon from "@mui/icons-material/Delete";

const AddShambaForm = () => {
  const DB = useSelector((state) => state.app.DB);
  const [newShamba, setNewShamba] = useState({
    images: [],
    location: "",
    price: 0,
    iframeSrc: "",
    latitude: null, // Add latitude
    longitude: null, // Add longitude
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLocating, setLocating] = useState(false);
  const [isLocated, setLocated] = useState(false);

  const clearNewShamba = () => {
    setNewShamba({
      images: [],
      location: "",
      price: 0,
      iframeSrc: "",
      latitude: null,
      longitude: null,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setNewShamba({
        ...newShamba,
        images: [...newShamba.images, ...newImages],
      });
    },
  });

  const handleAddShamba = async () => {
    setIsUploading(true);

    try {
      const downloadURLs = [];

      for (const image of newShamba.images) {
        const imageFile = image.file;
        const imageRef = storageRef(storage, `shamba_images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(imageRef, imageFile);

        uploadTask.on("state_changed", (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await uploadTask;

        const downloadURL = await getDownloadURL(imageRef);
        downloadURLs.push(downloadURL);
      }

      const shambaWithImages = {
        ...newShamba,
        images: downloadURLs,
      };

      const newShambaRef = push(ref(db, `${DB}/shamba`));
      await set(newShambaRef, shambaWithImages);
      clearNewShamba();
      setUploadProgress(0);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading images: ", error);
      setIsUploading(false);
    }
  };

  const handleGetLocation = () => {
    setLocating(true)
    // Check if Geolocation is available
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setNewShamba({
          ...newShamba,
          latitude,
          longitude,
        });
      });
      setLocated(true)
      setLocating(false)
    } else {
        setLocating(false)
      console.error("Geolocation is not available in this browser.");
    }
  };

  return (
    <Card>
      {isUploading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      <CardContent>
        <div {...getRootProps()} style={dropzoneStyles}>
          <input {...getInputProps()} />
          <p>Drag and drop images here, or click to select images.</p>
        </div>

        {newShamba.images && newShamba.images.length > 0 && (
          <div>
            <Grid container spacing={2}>
              {newShamba.images.map((image, index) => (
                <Grid item key={index}>
                  <div style={uploadedImageContainerStyles}>
                    <img
                      src={image.url}
                      alt={`Image ${index}`}
                      style={imageStyles}
                    />
                    <IconButton
                      onClick={() => {
                        const images = [...newShamba.images];
                        images.splice(index, 1);
                        setNewShamba({ ...newShamba, images });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
            {newShamba.iframeSrc && (
          <iframe
            src={newShamba.iframeSrc}
            width="640"
            height="480"
            title="Google Map"
          />
        )}
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Location"
              value={newShamba.location}
              onChange={(e) =>
                setNewShamba({ ...newShamba, location: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Price"
              type="number"
              value={newShamba.price}
              onChange={(e) =>
                setNewShamba({ ...newShamba, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Iframe Source"
              value={newShamba.iframeSrc}
              onChange={(e) =>
                setNewShamba({ ...newShamba, iframeSrc: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddShamba}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Add Shamba"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color= {isLocated ? "secondary" : "primary"}
              startIcon={<MapIcon />}
              onClick={handleGetLocation}
            >
            {isLocating ? "Loading..." : " Locate Me"}
            </Button>
          </Grid>
        </Grid>
      
      </CardContent>
    </Card>
  );
};

const dropzoneStyles = {
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

const uploadedImageContainerStyles = {
  position: "relative",
};

const imageStyles = {
  maxWidth: "100px",
  maxHeight: "100px",
  objectFit: "cover",
};

export default AddShambaForm;

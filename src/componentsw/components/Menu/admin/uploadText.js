import React, { useState } from "react";
import { Card, CardContent, Box, IconButton, LinearProgress, Grid, Button, TextField } from "@mui/material";
import { ref as storageRef, uploadBytes, getDownloadURL,  } from "firebase/storage";
import { ref, push, onValue,set } from "firebase/database";
import { db, storage } from "../../../store/firebase";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import { useSelector } from "react-redux";
import BackupIcon from "@mui/icons-material/Backup";

const Upload = ({
  path,
  acceptedFiles,
  defaultImages,
  multiple = false,
}) => {
  const DB = useSelector((state) => state.app.DB);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [text, setText] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFiles,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    },
  });

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const downloadURLs = [];

      for (const file of uploadedFiles) {
        const fileRef = storageRef(storage, `uploads/${Date.now()}_${file.name}`);
        const downloadURL = await uploadFileAndGetDownloadURL(fileRef, file);
        downloadURLs.push(downloadURL);
      }

      // Update Firebase Realtime Database with the download URLs, text, and form fields
      const filesRef = ref(db, `${DB}/${path}`);
      for (const downloadURL of downloadURLs) {
        const uniqueKey = push(filesRef).key; // Generate a unique key
        await set(ref(db, `${DB}/${path}/${uniqueKey}`), {
          downloadURL,
          text,
          name: itemName,
          description: itemDescription,
          price: itemPrice
        });
      }

      setIsUploading(false);
      setUploadMessage("Upload completed successfully!");
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading files: ", error);
    }
  };

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleTextSubmit = () => {
    handleUpload();
  };

  const uploadFileAndGetDownloadURL = async (fileRef, file) => {
    return new Promise(async (resolve, reject) => {
      const uploadTask = uploadBytes(fileRef, file);

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(fileRef);
        resolve(downloadURL);
      } catch (error) {
        reject(error);
      }
    });
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
          <p>Drag and drop files here, or click to select files.</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <Grid container spacing={2}>
              {uploadedFiles.map((file, index) => (
                <Grid item key={index}>
                  <div style={uploadedFileContainerStyles}>
                    {file.type.includes("image") ? (
                      <img src={URL.createObjectURL(file)} alt={`Image ${index}`} style={imageStyles} />
                    ) : (
                      <video src={URL.createObjectURL(file)} alt={`Video ${index}`} controls style={videoStyles} />
                    )}
                    <IconButton
                      onClick={() => {
                        const files = [...uploadedFiles];
                        files.splice(index, 1);
                        setUploadedFiles(files);
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
      </CardContent>
      <CardContent>
        <span>{uploadMessage}</span>
      </CardContent>

      {/* Text fields for name, description, and price */}
      <CardContent>
        <TextField
          label="Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          fullWidth
          multiline
        />
        <TextField
          label="Price"
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleTextSubmit}>Submit Text</Button>
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

const uploadedFileContainerStyles = {
  position: "relative",
};

const imageStyles = {
  maxWidth: "100px",
  maxHeight: "100px",
  objectFit: "cover",
};

const videoStyles = {
  maxWidth: "100px",
};

export default Upload;

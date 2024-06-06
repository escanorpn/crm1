import React, { useState } from "react";
import { Card, CardContent, Box, IconButton, LinearProgress, Grid } from "@mui/material";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, push, set,onValue } from "firebase/database";
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
  const [uploadedFiles, setUploadedFiles] = useState(defaultImages || []);

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
  
      // Add the new download URLs to Firebase Realtime Database under "banner" path
      const databaseRef = ref(db, `${DB}/${path}`);
      downloadURLs.forEach(async (downloadURL, index) => {
        const newImageRef = push(databaseRef);
        await set(newImageRef, { downloadURL });
      });
  
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading files: ", error);
    }
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
        <IconButton onClick={handleUpload}>
          <PublishIcon />
        </IconButton>
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

import React, { useState } from "react";
import { Card, CardContent, Box, LinearProgress, TextField, Button, Grid } from "@mui/material";
import { ref, push, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../store/firebase";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AddPortfolioForm = () => {
  const DB = useSelector((state) => state.app.DB);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    name: "",
    link: "",
    files: [], // Store uploaded files here
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const clearNewPortfolioItem = () => {
    setNewPortfolioItem({
      name: "",
      link: "",
      files: [],
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setNewPortfolioItem({
        ...newPortfolioItem,
        files: [...newPortfolioItem.files, ...newFiles],
      });
    },
  });

  const handleAddPortfolioItem = async () => {
    setIsUploading(true);

    try {
      const downloadURLs = [];

      for (const file of newPortfolioItem.files) {
        const fileRef = storageRef(storage, `portfolio_items/${Date.now()}_${file.file.name}`);
        const downloadURL = await uploadFileAndGetDownloadURL(fileRef, file.file);
        downloadURLs.push(downloadURL);
      }

      const portfolioItemWithFiles = {
        ...newPortfolioItem,
        files: downloadURLs,
      };

      const newPortfolioItemRef = push(ref(db, `${DB}/portfolio`));
      await set(newPortfolioItemRef, portfolioItemWithFiles);
      clearNewPortfolioItem();
      setUploadProgress(0);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading files: ", error);
      setIsUploading(false);
    }
  };

  const uploadFileAndGetDownloadURL = async (fileRef, file) => {
    return new Promise(async (resolve, reject) => {
      const uploadTask = uploadBytes(fileRef, file);

      // uploadTask.on("state_changed", (snapshot) => {
      //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   setUploadProgress(progress);
      // });

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

        {newPortfolioItem.files && newPortfolioItem.files.length > 0 && (
          <div>
            <Grid container spacing={2}>
              {newPortfolioItem.files.map((file, index) => (
                <Grid item key={index}>
                  <div style={uploadedFileContainerStyles}>
                    {file.file.type.includes("image") ? (
                      <img src={file.url} alt={`Image ${index}`} style={imageStyles} />
                    ) : (
                      <video src={file.url} alt={`Video ${index}`} controls style={videoStyles} />
                    )}
                    <Button
                      onClick={() => {
                        const files = [...newPortfolioItem.files];
                        files.splice(index, 1);
                        setNewPortfolioItem({ ...newPortfolioItem, files });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <TextField
          label="Name"
          fullWidth
          value={newPortfolioItem.name}
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, name: e.target.value })}
        />

        <TextField
          label="Link"
          fullWidth
          value={newPortfolioItem.link}
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, link: e.target.value })}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={handleAddPortfolioItem}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Add Portfolio Item"}
        </Button>
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

export default AddPortfolioForm;

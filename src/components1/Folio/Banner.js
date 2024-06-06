import React, { useState,useEffect } from "react";
import { Card, CardContent, Box, IconButton,LinearProgress,  Grid, Button} from "@mui/material";
import { ref, set, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../store/firebase";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import { useSelector } from "react-redux";
import BackupIcon from "@mui/icons-material/Backup";

const Banner = () => {
    const DB = useSelector((state) => state.app.DB);
    const [isUploading, setIsUploading] = useState(false);
  const [bannerImage, setBannerImage] = useState({
    name: "",
    link: "",
    files: [],
  });
  const [bannerURL, setBannerURL] = useState("");
  
  useEffect(() => {
    const bannerPath = ref(db, `${DB}/portfolio/banner`);
   
        // Retrieve the banner URL
    onValue(bannerPath, (snapshot) => {
      const bannerData = snapshot.val();
      if (bannerData && bannerData.banner_img) {
        setBannerURL(bannerData.banner_img);
      } else {
        setBannerURL(""); // Set to an empty string if no banner_img is found
      }
    });
  }, [DB]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setBannerImage({
        ...bannerImage,
        files: [...bannerImage.files, ...newFiles],
      });
    },
  });


  const handleReplaceBanner = async () => {
    setIsUploading(true)
    try {
        let bannerURL = "";

        for (const file of bannerImage.files) {
        
          console.log(bannerImage)
          // Upload the new banner image
          const newBannerRef = storageRef(storage, `portfolio_items/banners/${Date.now()}_${bannerImage.name}`);

        //   const downloadURL = await uploadFileAndGetDownloadURL(fileRef, file.file);
        //   downloadURLs.push(downloadURL);
          bannerURL = await uploadFileAndGetDownloadURL(newBannerRef, file.file);
        }
 
     
  console.log(bannerURL)
      // Set the new banner URL to the specified path in the database
      const bannerPath = ref(db, `${DB}/portfolio/banner`);
      await set(bannerPath, { banner_img: bannerURL });
      setBannerImage(bannerURL);
      setIsUploading(false)
    } catch (error) {
        setIsUploading(false)
      console.error("Error replacing banner: ", error);
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
      <img
        src={bannerURL} // Replace with your actual banner image URL
        alt="Banner Image"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <CardContent>
      <div {...getRootProps()} style={dropzoneStyles}>
          <input {...getInputProps()} />
          <p>Drag and drop files here, or click to select files.</p>
        </div>

        {bannerImage.files && bannerImage.files.length > 0 && (
          <div>
            <Grid container spacing={2}>
              {bannerImage.files.map((file, index) => (
                <Grid item key={index}>
                  <div style={uploadedFileContainerStyles}>
                    {file.file.type.includes("image") ? (
                      <img src={file.url} alt={`Image ${index}`} style={imageStyles} />
                    ) : (
                      <video src={file.url} alt={`Video ${index}`} controls style={videoStyles} />
                    )}
                    <Button
                      onClick={() => {
                        const files = [...bannerImage.files];
                        files.splice(index, 1);
                        setBannerImage({ ...bannerImage, files });
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
        {/* <IconButton onClick={handleDeleteBanner}>
                <DeleteIcon />
              </IconButton> */}
              <IconButton onClick={handleReplaceBanner}>
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
export default Banner;

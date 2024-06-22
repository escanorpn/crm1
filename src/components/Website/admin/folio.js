import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, onValue, remove } from "firebase/database";
import { db } from "../../../store/firebase";
import { useSelector } from "react-redux";
import Upload from './upload';
import UploadText from './uploadText';
import DatabaseTextField from './addText';
import Add from '@mui/icons-material/Add';

const FolioPage = () => {
  const DB = useSelector((state) => state.app.DB);
  const [multiline, setMultiline] = useState(false);
  const [type, setType] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openUploadText, setOpenUploadText] = useState(false);

  const [open, setOpen] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [dialogText, setDialogText] = useState("");
  const [imageData, setImageData] = useState([]);
  

 
  const handleClose = () => {
    setOpen(false);
  };
  const AddAPhoto=()=>{
    setOpen(true);
   console.log("adding photo") 
  }
  const editButton={
    borderRadius: "50px",
    boxShadow: "2px 6px 20px 1px black",
    paddingRight: "0",
    minWidth: "22px"
  }
  const deleteButton={
    borderRadius: "50px",
    boxShadow: "2px 6px 20px 1px black",
    paddingRight: "0",
    minWidth: "22px"
  }
  useEffect(() => {
    const fetchData = async () => {
        const path = "samples";
      const databaseRef = ref(db, `${DB}/samples`);
      onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        const imageDataArray = [];
        for (const key in data) {
          const { downloadURL, text } = data[key];
          imageDataArray.push({ key, downloadURL, text });
        }
        setImageData(imageDataArray);
      });
    };
    fetchData();
  }, [DB]);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const databaseRef = ref(db, `${DB}/folio_banner`);
        onValue(databaseRef, (snapshot) => {
          const data = snapshot.val() || {};
          const imagesArray = Object.entries(data).map(([key, item]) => ({ key, downloadURL: item.downloadURL }));
          setBannerImages(imagesArray);
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData1();
  }, [DB]);

  const handleDeleteCard = async (index, key) => {
    try {
      await remove(ref(db, `${DB}/samples` + '/' + key));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };


  const AddAPhotoText = () => {
    setOpenUploadText(true);
  };

  const closeUploadText = () => {
    setOpenUploadText(false);
  };
 
  const handleDeleteImage = async (key) => {
    try {
      // Remove the corresponding data from the database using the unique key
      await remove(ref(db, `${DB}/folio_banner` + '/' + key));
      console.log("Data deleted successfully!");
      
      // Update the bannerImages state to reflect the deletion
      // setBannerImages((prevImages) => prevImages.filter((image) => image.key !== key));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  
  return (
    <div style={{ width: "100%", minHeight: "100vh", overflow: "auto" }}>
        
    <Dialog style={{  width:"-webkit-fill-available"}} open={open} onClose={handleClose}>
        <DialogTitle>Add Photo</DialogTitle>
        <DialogContent>
          <Card style={{ padding: "16px", maxHeight: "90vh", marginLeft: "auto", marginRight: "auto" }} className="img-card">
            <Upload
              path="folio_banner"
              acceptedFiles="image/*"
              defaultImages={[]}
              multiple={true}
            />
          </Card>
        </DialogContent>
      </Dialog>
      {/* <div
  style={{
    width: "100%",
    height: "70vh",
    background: bannerImages[0] && bannerImages[0].downloadURL ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerImages[0].downloadURL}')` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
</div> */}
<div
 style={{
  width: "100%",
  height: "70vh",
  background: bannerImages[0] && bannerImages[0].downloadURL ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerImages[0].downloadURL}')` : "none",
  backgroundSize: "cover", // Ensures the whole image is displayed
  backgroundPosition: "center", // Centers the image
  backgroundAttachment: "fixed", // Makes the background image fixed
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundRepeat: "no-repeat" // Prevents repeating the image
}}

  >
    {/* Your content here */}
    <Typography variant="h4" style={{ color: "white", textAlign: "center" }}>
      <b>Portfolio</b>
    </Typography>
  </div>


      <Button style={editButton} variant="contained" startIcon={<Add style={{color:"#a90505"}} />} onClick={() => AddAPhoto()}></Button>
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", overflowY: 'auto', maxHeight: '70vh' }}>
  {bannerImages.map((image) => (
    <div key={image.key} style={{ margin: "10px", textAlign: "center" }}>
      <img src={image.downloadURL} alt={`Image ${image.key}`} style={{ width: "200px", height: "auto", marginBottom: "10px" }} />
      <Button style={deleteButton} variant="contained" startIcon={<DeleteIcon style={{color:"#a90505"}} />} onClick={() => handleDeleteImage(image.key)}></Button>
    </div>
  ))}
</div>
      <Card style={{ width: "100%", margin: "auto", marginTop: 20 }}>
        <CardContent style={{ padding: "20px", textAlign: "center" }}>
        </CardContent>
       
        <Dialog style={{ width: "-webkit-fill-available" }} open={openUploadText} onClose={closeUploadText}>
          <DialogTitle>Add Photo</DialogTitle>
          <DialogContent>
            <Card style={{ padding: "16px", maxHeight: "90vh", marginLeft: "auto", marginRight: "auto" }} className="img-card">
              <UploadText
                path="samples"
                acceptedFiles="image/*"
                defaultImages={[]}
                multiple={true}
              />
            </Card>
          </DialogContent>
        </Dialog>
        <Button style={editButton}  variant="contained" startIcon={<Add style={{color:"#a90505"}} />} onClick={AddAPhotoText}></Button>
        

        <Grid container spacing={2} justifyContent="center" style={{ margin: "auto", marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
  {imageData.map((image, index) => (
    <Grid item key={index}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Dark overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", borderRadius: "8px", display: "none", transition: "0.3s" }}></div>
        
        {/* Image */}
        <img
          src={image.downloadURL}
          alt={`Card ${index + 1}`}
          style={{ width: "100%", height: "auto", borderRadius: "8px", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.target.parentNode.querySelector('.text-overlay').style.display = "block";
          }}
          onMouseLeave={(e) => {
            e.target.parentNode.querySelector('.text-overlay').style.display = "none";
          }}
        />
        
        {/* Text */}
        <div className="text-overlay" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1, color: "white", textAlign: "center", display: "none", transition: "0.3s", padding: "10px", background: "rgba(0, 0, 0, 0.7)", }}>
          <Typography variant="body1">{image.text}</Typography>
        </div>
        
        {/* Delete Button */}
        <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 1 }}>
          <Button
            style={deleteButton}
            variant="contained"
            startIcon={<DeleteIcon style={{ color: "#a90505" }} />}
            onClick={() => handleDeleteCard(index, image.key)}
          ></Button>
        </div>
      </div>
    </Grid>
  ))}
</Grid>


      </Card>
    </div>
  );
};

export default FolioPage;

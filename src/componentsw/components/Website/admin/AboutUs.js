import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DatabaseTextField from './addText';
import { ref, push, onValue,remove } from "firebase/database";
import { db, storage } from "../../../store/firebase";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Upload from './upload';

// import Navigation from "./Navigation";

const AboutUs = () => {
  const DB = useSelector((state) => state.app.DB);
  const [multiline, setMultiline] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [dialogText, setDialogText] = useState("")
  const [type, setType] = useState("");
  const [editedHeading, setEditedHeading] = useState("Exhibition Stall Designers In Delhi, India");
  const [editedDescription, setEditedDescription] = useState("India's Best Exhibition s");
  const [editedParagraph, setEditedParagraph] = useState("Artemim,");
  const [open, setOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.location.hash = "#" + page;
  };
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };
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
  const handleDialoEdit= (text,type, multiline)=>{
    setDialogText(text)
    setType(type)
    setMultiline(multiline)
    setIsEditDialogOpen(true);
  }
  useEffect(() => {
    const fetchHeadingData = () => {
      const headingRef = ref(db, `${DB}/who_we_are`);
      onValue(headingRef, (snapshot) => {
        const headingData = snapshot.val();
        if (headingData) {
          setEditedHeading(headingData.who_we_are);
        }
      });
    };
    const fetchHeadingData2 = () => {
      const headingRef = ref(db, `${DB}/mission`);
      onValue(headingRef, (snapshot) => {
        const headingData = snapshot.val();
        if (headingData) {
          setEditedDescription(headingData.mission);
        }
      });
    };

    const fetchParagraphData = () => {
      const paragraphRef = ref(db, `${DB}/Why_Le_Meilleur`);
      onValue(paragraphRef, (snapshot) => {
        const paragraphData = snapshot.val();
        if (paragraphData) {
          setEditedParagraph(paragraphData.Why_Le_Meilleur);
        }
      });
    };

    fetchHeadingData();
    fetchParagraphData();
    fetchHeadingData2();
  
  }, [DB]);
  
  const handleDeleteImage = async (key) => {
    try {
      // Remove the corresponding data from the database using the unique key
      await remove(ref(db, `${DB}/about_banner` + '/' + key));
      console.log("Data deleted successfully!");
      
      // Update the bannerImages state to reflect the deletion
      // setBannerImages((prevImages) => prevImages.filter((image) => image.key !== key));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const databaseRef = ref(db, `${DB}/about_banner`);
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
  const AddAPhoto=()=>{
    setOpen(true);
   console.log("adding photo") 
  }
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="navigation-top">
    {/* <Navigation handleNavigation={handleNavigation} /> */}
       
    <Dialog style={{  width:"-webkit-fill-available"}} open={open} onClose={handleClose}>
        <DialogTitle>Add Photo</DialogTitle>
        <DialogContent>
          <Card style={{ padding: "16px", maxHeight: "90vh", marginLeft: "auto", marginRight: "auto" }} className="img-card">
            <Upload
              path="about_banner"
              acceptedFiles="image/*"
              defaultImages={[]}
              multiple={true}
            />
          </Card>
        </DialogContent>
      </Dialog>
      
<div
    style={{
      width: "100%",
      height: "70vh",
      background: bannerImages[0] && bannerImages[0].downloadURL ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerImages[0].downloadURL}')` : "none",
      
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundSize: "cover",
      
    }}
  >
    {/* Your content here */}
    <Typography variant="h4" style={{ color: "white", textAlign: "center" }}>
      <b>About Us</b>
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

    <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px"   }} className="img-card">
      <Typography variant="h2" style={{ textAlign: "center",marginTop:"-5px",textAlign: "center", textShadow: "1px 1px 2px #d76563",fontWeight: "600",color: "#fff",fontSize: "22px;" }}>About Us</Typography>
    </Card>

    <Card style={{ width: "100%", margin: "auto", marginTop: 20 }}>
        <CardContent style={{ padding: "20px", textAlign: "center" }}>
          {/* Edit Button for Heading and Paragraph */}
          <IconButton
            style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
            onClick={() => {
              // Handle edit button click
              console.log("Edit Heading and Paragraph");
            }}
          >
            <EditIcon />
          </IconButton>

          <Typography    
      variant="body1"
      contentEditable
      style={{
        lineHeight: "1.7",
        textAlign: "left",
        padding: "30px 10px",
        maxWidth: "1100px",
        margin: "auto"
      }}>
      <span dangerouslySetInnerHTML={{ __html: editedHeading }}></span>
        
      {/* Edit Button for Heading */}
      <Button style={editButton} variant="contained" startIcon={<EditIcon />} onClick={() => handleDialoEdit(editedHeading, "who_we_are", true)}></Button>
    </Typography>
         

    <Typography    
      variant="body1"
      contentEditable
      style={{
        lineHeight: "1.7",
        textAlign: "left",
        padding: "30px 10px",
        maxWidth: "1100px",
        margin: "auto"
      }}>
      <span dangerouslySetInnerHTML={{ __html: editedDescription }}></span>
        
      {/* Edit Button for Heading */}
      <Button style={editButton} variant="contained" startIcon={<EditIcon />} onClick={() => handleDialoEdit(editedDescription, "mission", true)}></Button>
    </Typography>
        
         

          <Typography
            variant="body1"
            contentEditable
            style={{
              lineHeight: "1.7",
              textAlign: "left",
              padding: "30px 10px",
              maxWidth: "1100px",
              margin: "auto"
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: editedParagraph }}></span>
            
            <Button style={editButton}  variant="contained" startIcon={<EditIcon />} onClick={()=>handleDialoEdit(editedParagraph,"Why_Le_Meilleur",true)}></Button>
          </Typography>
         

        </CardContent>
            {/* Edit Dialog */}
            <Dialog style={{  width:"-webkit-fill-available"}} open={isEditDialogOpen} onClose={handleCloseEditDialog}>
              <DialogTitle>Edit Text</DialogTitle>
              <DialogContent>
              <DatabaseTextField
                path={type}
                multiline={multiline}
                value={dialogText}
                // onChange={(newValue) => handleInputChange(newValue)}
                type={type}
                fullWidth
              />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                
              </DialogActions>
            </Dialog>
            </Card>
            
    </div>
  );
};

export default AboutUs;

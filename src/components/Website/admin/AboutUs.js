import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DatabaseTextField from './addText';
import { ref, push, onValue,remove } from "firebase/database";
import { db, storage } from "../../../store/firebase";
import { useSelector } from "react-redux";

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
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
  return (
    <div className="navigation-top">
    {/* <Navigation handleNavigation={handleNavigation} /> */}
  
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

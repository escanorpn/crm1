import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ref, push, onValue,remove } from "firebase/database";
import { db, storage } from "../../store/firebase";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";

// import Navigation from "./Navigation";

const AboutUs = () => {
  const DB = useSelector((state) => state.app.DB);

  const [editedHeading, setEditedHeading] = useState("Exhibition Stall Designers In Delhi, India");
  const [editedDescription, setEditedDescription] = useState("India's Best Exhibition s");
  const [editedParagraph, setEditedParagraph] = useState("Artemim,");
  

 
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
    <div  className="navigation-top" style={{ width: "100%", minHeight: "99vh", overflow: "auto" }}>
    <Navigation  />
  
    <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
      <Typography variant="h2" style={{ textAlign: "center",marginTop:"-5px",textAlign: "center", textShadow: "1px 1px 2px #d76563",fontWeight: "600",color: "#fff",fontSize: "22px;" }}>About Us</Typography>
    </Card>

    <Card style={{ width: "100%", margin: "auto", marginTop: 20 }}>
        <CardContent style={{ padding: "20px", textAlign: "center" }}>
 

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
            
          </Typography>
         

        </CardContent>
          
            </Card>
            
    </div>
  );
};

export default AboutUs;

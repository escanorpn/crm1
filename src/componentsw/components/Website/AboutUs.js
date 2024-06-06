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
  const [bannerImages, setBannerImages] = useState([]);
  

 
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
<div className="navigation-top" style={{ 
  width: "100%", 
  minHeight: "99vh", 
  overflow: "auto", 
  background: "linear-gradient(146deg, rgb(44, 62, 80) 8%, #1e1e1e 12%, white 25%, rgb(30, 30, 30) 9%, rgb(30, 30, 30) 92%, #1e1e1e 7%, black 98%, rgb(44, 62, 80) 1%) center center/ cover fixed"

}}>
    <Navigation  />
  
    {/* <Card style={{ padding: "16px", maxWidth: "900px", margin: "auto", marginTop: "80px" }} className="img-card">
      <Typography variant="h2" style={{ textAlign: "center",marginTop:"-5px",textAlign: "center", textShadow: "1px 1px 2px #63d799",fontWeight: "600",color: "#fff",fontSize: "22px;" }}>About Us</Typography>
    </Card> */}

    <div
    style={{
      width: "100%",
      height: "50vh",
      background: bannerImages[0] && bannerImages[0].downloadURL ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerImages[0].downloadURL}')` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Your content here */}
    <Typography variant="h4" style={{ color: "white", textAlign: "center" }}>
      <b>About Us</b>
    </Typography>
  </div>
    <Card style={{ width: "100%", margin: "auto", marginTop: 3 }}>
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

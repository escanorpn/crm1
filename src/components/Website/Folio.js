import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography } from "@mui/material";

import { ref, onValue, remove } from "firebase/database";
import { db } from "../../store/firebase";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import Footer from "./Footer";

const FolioPage = () => {
  const DB = useSelector((state) => state.app.DB);

  const [open, setOpen] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);

  const [imageData, setImageData] = useState([]);
  

 

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



 
 

  
  return (<div className="navigation-top" style={{ 
    width: "100%", 
    minHeight: "99vh", 
    overflow: "auto", 
    background: "linear-gradient(146deg, rgb(44, 62, 80) 8%, #1e1e1e 12%, white 25%, rgb(30, 30, 30) 9%, rgb(30, 30, 30) 92%, #1e1e1e 7%, black 98%, rgb(44, 62, 80) 1%) center center/ cover fixed"
  
  }}>
 
    <Navigation  />
    
      <div
  style={{
    width: "100%",
    height: "10vh",
    // background: bannerImages[0] && bannerImages[0].downloadURL ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerImages[0].downloadURL}')` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {/* Your content here */}
</div>
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
      <b>Portfolio</b>
    </Typography>
  </div>



      <Card style={{ width: "100%", margin: "auto", marginTop: 3, }}>
        <CardContent style={{ padding: "20px", textAlign: "center"}}>
       
       

        <Grid container spacing={2} justifyContent="center" style={{ margin: "auto", marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px", paddingLeft:"12px", paddingRight:"12px" ,background:"linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed" }}>
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
        
    
      </div>
    </Grid>
  ))}
</Grid>
<Footer/>
</CardContent>

      </Card>
    </div>
  );
};

export default FolioPage;

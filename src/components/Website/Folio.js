import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "../../store/firebase";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import Footer from "./Footer";

const FolioPage = () => {
  const DB = useSelector((state) => state.app.DB);

  const [bannerImages, setBannerImages] = useState([]);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
    const fetchBannerData = async () => {
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
    fetchBannerData();
  }, [DB]);

  const bannerStyle = {
    width: "100%",
    height: "50vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const bannerImageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: bannerImages[0] && bannerImages[0].downloadURL 
      ? `url(${bannerImages[0].downloadURL})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    opacity: 0.5,
    // zIndex: -1,
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 0,
    
  };

  const contentStyle = {
    zIndex: 1,
    color: "white",
    textAlign: "center",
  };

  return (
    <div className="navigation-top" style={{ 
      width: "100%", 
      minHeight: "99vh", 
      overflow: "auto", 
      background: "linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed"
    }}>
      <Navigation />
      
      <div style={bannerStyle}>
        <div style={bannerImageStyle}></div>
        <div style={overlayStyle}></div>
        <div style={contentStyle}>
          <Typography variant="h4">
            <b>Portfolio</b>
          </Typography>
        </div>
      </div>

      <Card style={{ width: "100%", margin: "auto", marginTop: 3 }}>
        <CardContent style={{ padding: "20px", textAlign: "center"}}>
          <Grid container spacing={2} justifyContent="center" style={{ margin: "auto", marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px", paddingLeft:"12px", paddingRight:"12px", background:"linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed" }}>
            {imageData.map((image, index) => (
              <Grid item key={index}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={image.downloadURL}
                    alt={`Card ${index + 1}`}
                    style={{ width: "100%", height: "auto", borderRadius: "8px", cursor: "pointer", transition: "transform 0.3s, opacity 0.3s" }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.opacity = "0.7";
                      e.target.parentNode.querySelector('.text-overlay').style.display = "block";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.opacity = "1";
                      e.target.parentNode.querySelector('.text-overlay').style.display = "none";
                    }}
                  />
                  <div className="text-overlay" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1, color: "white", textAlign: "center", display: "none", transition: "0.3s", padding: "10px", background: "rgba(0, 0, 0, 0.7)" }}>
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

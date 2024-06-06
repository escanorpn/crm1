import React, { useState,useEffect } from "react";
import { Typography, Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { ref, push, onValue,remove } from "firebase/database";
import { db, storage } from "../../store/firebase";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import { CssBaseline, Container, Box } from '@mui/material';
import SlickCarousel from './SlickCarousel';

const HomePage = () => {
  const DB = useSelector((state) => state.app.DB);
  const [editedHeading, setEditedHeading] = useState("Loading...");
  const [editedDescription, setEditedDescription] = useState("Loading...");
  const [editedParagraph, setEditedParagraph] = useState("Loading...");

  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchHeadingData = () => {
      console.log("DB: ",DB)
      const headingRef = ref(db, `${DB}/h1`);
      onValue(headingRef, (snapshot) => {
        const headingData = snapshot.val();
        if (headingData) {
          setEditedHeading(headingData.h1);
        }
      });
    };
    const fetchHeadin2gData = () => {
      const headingRef = ref(db, `${DB}/h2`);
      onValue(headingRef, (snapshot) => {
        const headingData = snapshot.val();
        if (headingData) {
          setEditedDescription(headingData.h2);
        }
      });
    };

    const fetchParagraphData = () => {
      const paragraphRef = ref(db, `${DB}/p1`);
      onValue(paragraphRef, (snapshot) => {
        const paragraphData = snapshot.val();
        if (paragraphData) {
          setEditedParagraph(paragraphData.p1);
        }
      });
    };
    const fetchData =  () => {
      const databaseRef = ref(db, `${DB}/samples`);
      onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        const imageDataArray = [];
        console.log("data:  "+JSON.stringify(data))
        // Iterate through the retrieved data and store in imageDataArray
        for (const key in data) {
          const { downloadURL, text } = data[key];
          imageDataArray.push({ key, downloadURL, text }); // Include key in imageDataArray
        }
        setImageData(imageDataArray);
        console.log("JSON_imageDataArray:  "+JSON.stringify(imageDataArray))
      });
    };
    fetchHeadingData();
    fetchParagraphData();
    fetchHeadin2gData();
    fetchData();
    // Cleanup function to remove the event listeners
    // return () => {
    //   ref(db, `${DB}/h1`).off();
    //   ref(db, `${DB}/p1`).off();
    // };
  }, [DB]);
  // Define an array of captions
  const captions = [
    "Caption 1",
    "Caption 2",
    "Caption 3",
    "Caption 4"
  ];
  const items = [
    {
      type: 'image',
      content: 'https://via.placeholder.com/800x400',
    },
    {
      type: 'text',
      content: 'This is a text slide',
    },
    {
      type: 'card',
      content: {
        image: 'https://via.placeholder.com/800x400',
        title: 'Card Title',
        description: 'This is a description for the card slide',
      },
    },
  ];
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const databaseRef = ref(db, `${DB}/banner`);
        onValue(databaseRef, (snapshot) => {
          const data = snapshot.val() || {};
          
          // Convert the object of image URLs to an array of objects containing key and downloadURL
          const imagesArray = Object.entries(data).map(([key, item]) => ({ key, downloadURL: item.downloadURL }));
    
          // Set the state variable with the retrieved image data
          setBannerImages(imagesArray);
          console.log(imagesArray)
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, [DB]);





  return (
    <div style={{ width: "100%", maxHeight: "99vh", overflow: "auto",background:"linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed"}}>

        
{/* Render the images using the Carousel component */}
<Carousel
  animation="slide"
  navButtonsAlwaysVisible={true}
  indicatorContainerProps={{
    style: {
      display: "none",
    },
  }}
  className="fullscreen-carousel"
  style={{
    width: "100%",
    height: "70vh", // Adjust the height as needed
    backgroundSize: "cover",
    backgroundPosition: "center center",
  }}
>
  {/* Map through the image URLs and create carousel items */}
  {bannerImages.map((image, index) => (
    <img
      key={index}
      src={image.downloadURL}
      alt={`Image ${index + 1}`}
      style={{ width: "100%", height: "90vh", objectFit: "cover" }}
    />
  ))}
</Carousel> 
    
    
      {/* Full-width card below the carousel */}
      <Card style={{ width: "100%", margin: "auto", marginTop: 20,background:"linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed" }}>
        <CardContent style={{ padding: "20px", textAlign: "center", maxWidth: "1100px", margin: "auto", background:"linear-gradient(124deg, #646464 9%, #282828 5%, #282828 94%, rgb(100 100 100) 77%) center center / cover fixed"}}>

          <Typography variant="h3" gutterBottom>
          <b>{editedHeading}</b>
          </Typography>
         

          <Typography variant="h5" gutterBottom>
          {editedDescription}
         
          </Typography>
         

          <Typography
            variant="body1"
            contentEditable
            style={{
              lineHeight: "1.7",
              textAlign: "left",
              padding: "30px 10px",
             
          
            }}
          >
             {editedParagraph}
       
          </Typography>
         

        </CardContent>
        <Typography style={{ padding: "10px", textAlign: "center" }} variant="h3" >
          <b>Samples</b>
          </Typography>
        <Grid container spacing={3} justifyContent="center" style={{ margin: "auto", marginTop: "20px" }}>
  {imageData.map((image, index) => (
    <Grid item xs={12} sm={6} md={4} key={index} style={{maxWidth:"350px"}}  >
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
<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Container sx={{ flexGrow: 1, p: 3 }}>
        <SlickCarousel items={items} />
      </Container>
    </Box>

<Footer/>
      </Card>
    </div>
  );
};

export default HomePage;

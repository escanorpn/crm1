import React, { useState,useEffect } from "react";
import { Typography, Card, CardContent, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import Upload from './upload';
import UploadText from './uploadText'
import DatabaseTextField from './addText';
import AddAPhoto from '@mui/icons-material/AddPhotoAlternate';
// import AddAPhoto from '@mui/icons-material/AddAPhoto';
import Add from '@mui/icons-material/Add';
import { ref, push, onValue,remove } from "firebase/database";
import { db, storage } from "../../../store/firebase";
import { useSelector } from "react-redux";

const HomePage = () => {
  const DB = useSelector((state) => state.app.DB);
  const [multiline, setMultiline] = useState(false);

  const [type, setType] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUploadText, setOpenUploadText] = useState(false);
  const [editedHeading, setEditedHeading] = useState("Exhibition Stall Designers In Delhi, India");
  const [editedDescription, setEditedDescription] = useState("India's Best Exhibition s");
  const [editedParagraph, setEditedParagraph] = useState("Artemim, a company with the expertise in booth designing, construction and displays in Exhibitions and Conferences. With the experience in this industry for more than a decade, the founders of the company have created their own space of reaching client's expectations with utmost dedication and creativity. The vision of the company is equality between expectation and reality. The team of qualified professionals are well versed with their expertise and techniques of delivering best level of services starting with designing and delivering the project at its best. Our target is to reach the eye of millions of people with the best creative designs and displays at Exhibitions.");
  const [dialogText, setDialogText] = useState("")
  // Define an array of image URLs
  const imageUrls1 = [
    "https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_640.jpg",
    "https://media.istockphoto.com/id/1146517111/photo/taj-mahal-mausoleum-in-agra.jpg?s=612x612&w=0&k=20&c=vcIjhwUrNyjoKbGbAQ5sOcEzDUgOfCsm9ySmJ8gNeRk=&s"
  ];

  const [imageUrls, setImageUrl] = useState([imageUrls1]);
  useEffect(() => {
    const fetchHeadingData = () => {
      const headingRef = ref(db, `${DB}/h1`);
      onValue(headingRef, (snapshot) => {
        const headingData = snapshot.val();
        if (headingData) {
          setEditedHeading(headingData.h1);
        }
      });
    };
    const fetchHeadingData2 = () => {
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

    fetchHeadingData();
    fetchParagraphData();
    fetchHeadingData2();

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
const handleCloseEditDialog = () => {
  setIsEditDialogOpen(false);
};
const handleDialoEdit= (text,type, multiline)=>{
  setDialogText(text)
  setType(type)
  setMultiline(multiline)
  setIsEditDialogOpen(true);
}
const handleSaveEdit = () => {
  setIsEditDialogOpen(false);

};
const AddAPhoto=()=>{
  setOpen(true);
 console.log("adding photo") 
}
const AddAPhotoText=()=>{
  setOpenUploadText(true);
 console.log("adding photo") 
}
const closeUploadText=()=>{
  setOpenUploadText(false);
}

  const handleClose = () => {
    setOpen(false);
  };
  const [imageData, setImageData] = useState([]);
const path="samples";
  useEffect(() => {
    const fetchData = async () => {
      const databaseRef = ref(db, `${DB}/${path}`);
      onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        const imageDataArray = [];
    
        // Iterate through the retrieved data and store in imageDataArray
        for (const key in data) {
          const { downloadURL, text } = data[key];
          imageDataArray.push({ key, downloadURL, text }); // Include key in imageDataArray
        }
        setImageData(imageDataArray);
        console.log("JSON_imageDataArray:  "+JSON.stringify(imageDataArray))
      });
    };
    

    fetchData();

    // Cleanup function to remove the event listener

  }, []);

  const handleDeleteCard = async (index,image, key) => {
    try {
      // console.log(image);
      // Remove the corresponding data from the database
      await remove(ref( db, `${DB}/${path}` + '/' + key));
      console.log("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
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
  
  const handleDeleteImage = async (key) => {
    try {
      // Remove the corresponding data from the database using the unique key
      await remove(ref(db, `${DB}/banner` + '/' + key));
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
              path="banner"
              acceptedFiles="image/*"
              defaultImages={[]}
              multiple={true}
            />
          </Card>
        </DialogContent>
      </Dialog>
 
     
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
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ))}
</Carousel> 
      <Button style={editButton} variant="contained" startIcon={<Add style={{color:"#a90505"}} />} onClick={() => AddAPhoto()}></Button>
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", overflowY: 'auto', maxHeight: '70vh' }}>
  {bannerImages.map((image) => (
    <div key={image.key} style={{ margin: "10px", textAlign: "center" }}>
      <img src={image.downloadURL} alt={`Image ${image.key}`} style={{ width: "200px", height: "auto", marginBottom: "10px" }} />
      <Button style={deleteButton} variant="contained" startIcon={<DeleteIcon style={{color:"#a90505"}} />} onClick={() => handleDeleteImage(image.key)}></Button>
    </div>
  ))}
</div>

      
      {/* Full-width card below the carousel */}
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

          <Typography variant="h3" gutterBottom>
          <b>{editedHeading}</b>
            
            {/* Edit Button for Heading */}
            <Button style={editButton}  variant="contained" startIcon={<EditIcon />} onClick={()=>handleDialoEdit(editedHeading,"h1",true)}></Button>
          </Typography>
         

          <Typography variant="h5" gutterBottom>
          {editedDescription}
              {/* Edit Button for Description */}
   <Button style={editButton}  variant="contained" startIcon={<EditIcon />} onClick={()=>handleDialoEdit(editedDescription,"h2",true)}></Button>
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
             {editedParagraph}
            <Button style={editButton}  variant="contained" startIcon={<EditIcon />} onClick={()=>handleDialoEdit(editedParagraph,"p1",true)}></Button>
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
        <Dialog style={{  width:"-webkit-fill-available"}} open={openUploadText} onClose={closeUploadText}>
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
      <Button style={editButton} variant="contained" startIcon={<Add style={{color:"#a90505"}} />} onClick={() => AddAPhotoText()}></Button>
      {/* Cards below the paragraph */}
    <Grid container spacing={2} justifyContent="center" style={{ margin: "auto", marginTop: "20px" }}>



           {imageData.map((image, index) => (
           <Grid item xs={12} sm={6} md={4} key={index}>
           <Card>
             <img src={image.downloadURL} alt={`Card ${index + 1}`} style={{ width: "100%", height: "auto" }} />
             <CardContent style={{ textAlign: "center" }}>
               <Typography variant="body1">{image.text}</Typography>
               
            {/* <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteCard(index)}></Button> */}
               <Button style={deleteButton} variant="contained" startIcon={<DeleteIcon style={{color:"#a90505"}} />} onClick={() => handleDeleteCard(index,image,image.key)}></Button>
             </CardContent>
           </Card>
         </Grid>
      ))}
    </Grid>
      </Card>
    </div>
  );
};

export default HomePage;

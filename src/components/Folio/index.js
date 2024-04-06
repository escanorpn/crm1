import React, { useState, useEffect } from "react";
import { ref, push, remove, onValue, set } from "firebase/database";
import { ref as storageRef, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from "../../store/firebase";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getDownloadURL } from "firebase/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddPortfolioForm from "./AddPortfolioForm";
import AddServicesForm from "./AddServicesForm";
import AddHeroSectionText  from "./AddHeroSectionText";
import ContactInfo  from "./ContactInfo";
import Banner from "./Banner";
import Carousel from "react-material-ui-carousel";
const Portfolio = () => {
  const DB = useSelector((state) => state.app.DB);
  const [portfolio, setPortfolio] = useState([]);
  // const [openDialog, setOpenDialog] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    name: "",
    link: "",
    files: [],
    additionalField1: "",
    additionalField2: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const portfolioRef = ref(db, `${DB}/portfolio`);
    onValue(portfolioRef, (snapshot) => {
      const portfolioData = snapshot.val();
      if (portfolioData) {
        const portfolioArray = Object.keys(portfolioData).map((key) => ({
          id: key,
          ...portfolioData[key],
        }));
        setPortfolio(portfolioArray);
      } else {
        setPortfolio([]);
      }
    });
  }, [DB]);

  const handleAddPortfolioItem = () => {
    const portfolioRef = ref(db, `${DB}/portfolio`);
    const newPortfolioItemRef = push(portfolioRef);
    const portfolioItem = { ...newPortfolioItem };

    uploadFiles(portfolioItem.files)
      .then((fileUrls) => {
        portfolioItem.files = fileUrls;

        set(newPortfolioItemRef, portfolioItem)
          .then(() => {
            // setOpenDialog(false);
            setNewPortfolioItem({
              name: "",
              link: "",
              files: [],
              additionalField1: "",
              additionalField2: "",
            });
          })
          .catch((error) => {
            console.error("Error adding portfolio item:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  const handleDeletePortfolioItem = (id, files) => {
    if (files) {
      files.forEach((fileUrl) => {
        const fileRef = storageRef(storage, fileUrl);
        deleteObject(fileRef)
          .then(() => {
            console.log("File deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      });
    }

    const portfolioRef = ref(db, `${DB}/portfolio/${id}`);
    remove(portfolioRef)
      .then(() => {
        console.log(`Portfolio item with ID ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Error deleting Portfolio item with ID ${id}:`, error);
      });
  };

  const uploadFiles = (files) => {
    const fileUrls = [];
    const promises = files.map((file) => {
      const fileRef = storageRef(storage, `portfolio/${Date.now()}_${file.name}`);
      return uploadBytes(fileRef, file)
        .then(() => {
          return getDownloadURL(fileRef);
        })
        .then((url) => {
          fileUrls.push(url);
          const progress = (fileUrls.length / files.length) * 100;
          setUploadProgress(progress);
        });
    });

    return Promise.all(promises).then(() => fileUrls);
  };

  return (
    <div>
       <Card style={{ padding: "16px", maxheight: "10vh", marginLeft: "auto", marginRight: "auto",  }} className="img-card">
       <Banner/>
       </Card>
    
      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Add Portfolio Item
      </Button> */}
 <Card style={{ padding: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
      <Grid container spacing={2}>
        {portfolio &&
          portfolio.length > 0 &&
          portfolio.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Card>
              <Carousel
                  animation="slide"
                  navButtonsAlwaysVisible={true}
                  indicatorContainerProps={{
                    style: {
                      display: "none",
                    },
                  }}
                >
                  {item.files && item.files.length > 0 ? (
                    item.files.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Image ${index}`}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "200px",
                        }}
                       
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </Carousel>
                {/* Display portfolio item content here */}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.link}
                  </a>
                </CardContent>
                {/* Display portfolio item images here */}
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      handleDeletePortfolioItem(item.id, item.files)
                    }
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
      </Card>
      <Card style={{ padding: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
      <AddHeroSectionText DB={DB}/>
      </Card>
     
      <Card style={{ padding: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
        
      <Typography variant="h6" style={{ textAlign: "center" }}>Samples</Typography>
      <AddPortfolioForm/>
      </Card>
      
      <Card style={{ padding: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
      <Typography variant="h6" style={{ textAlign: "center" }}>Services</Typography>
      <AddServicesForm/>
      </Card>
       
      <Card style={{ padding: "16px", maxWidth: "900px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
      <ContactInfo  DB={DB}/>
      </Card>
      
    
      
      <style>{`
        @media screen and (min-width: 48em) {
          .navigation-top {
            font-size: 14px;
            font-size: 0.875rem;
            left: 0;
            position: absolute;
            right: 0;
            width: 100%;
            z-index: 3;
          }
        }

        .bannerImage {
          left: 0;
          object-fit: cover;
          top: 0;
          width: 99%;
          position: fixed;
          z-index: -1;
        }
        .custom-card {
          // box-shadow: 7px 19px 20px 9px #9ec8c121;
          box-shadow: 3px 9px 20px 10px #000101;
        }
        
        .img-card {
          box-shadow:  3px 7px 12px 0px #a7d0c9;
          // box-shadow: 7px 19px 20px 9px #9ec8c121;
          // box-shadow: 6px 20px 20px 2px #000101;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;

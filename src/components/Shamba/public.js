import React, { useState, useEffect } from "react";
import {
  ref,
  push,
  set,
  remove,
  onValue,
  query,
  orderByKey,
  limitToLast,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import MapIcon from "@mui/icons-material/Map"
import { db, auth, storage } from "../../store/firebase";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  LinearProgress,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Carousel from "react-material-ui-carousel";
import { useSelector } from "react-redux";
import AddShambaForm from "./AddShambaForm"; // Import the AddShambaForm component

const Shamba = () => {
  const [shambas, setShambas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State for opening/closing the dialog
  const [iframeSrcToShow, setIframeSrcToShow] = useState(""); // State to store the iframe src to show
  const [dbError, setDbError] = useState(false); // State to handle DB retrieval error

  useEffect(() => {
 
    const urlHash = window.location.hash;
    const dbParam = urlHash.match(/DB=([^&]+)/);
    let  DB = "";
    if (dbParam) {
      // The value of DB parameter is stored in dbParam[1]
      DB =  dbParam[1];
      console.log("DB parameter:", dbParam[1]);
    } else {
      console.log("DB parameter not found in the URL hash");
    }
    
    
    if (DB) {
      const shambaRef = ref(db, `${DB}/shamba`);
      const shambaQuery = query(shambaRef, orderByKey(), limitToLast(10));
      onValue(shambaQuery, (snapshot) => {
        const shambaData = snapshot.val();
        if (shambaData) {
          const shambasArray = Object.keys(shambaData).map((key) => ({
            id: key,
            ...shambaData[key],
          }));
          setShambas(shambasArray);
          setDbError(false); // Data retrieved successfully
        } else {
          setShambas([]);
          setDbError(true); // Data is empty
        }
      });
    } else {
      setDbError(true); // DB parameter not found in URL
    }
  }, []);

  const handleEditShamba = (id, updatedShamba) => {
    // Implement logic to open an edit form with the existing data
    // Once edited, call this function with the updated data
  };



  const openIframeDialog = (iframeSrc) => {
    setIframeSrcToShow(iframeSrc);
    setOpenDialog(true);
  };

  const closeIframeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {dbError ? (
        <Card>
          {/* Display an error card with an SVG */}
          <CardContent>
            <svg
              width="100"
              height="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="40" stroke="red" strokeWidth="3" fill="white" />
              <text x="25" y="60" fill="red">DB Error</text>
            </svg>
            <Typography variant="body1">Bad URL or Data Not Found</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <hr />
          <Grid container spacing={2}>
            {shambas &&
              shambas.length > 0 &&
              shambas.map((shamba) => (
                <Grid item key={shamba.id} xs={12} sm={6} md={4} lg={3}>
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
                    {shamba.images && shamba.images.length > 0 ? (
                      shamba.images.map((image, index) => (
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
                  <CardContent>
                  {shamba.location && (
                      <div>
                      <Chip
                        // icon={<HomeIcon />}
                        label={<Typography variant="body2">{shamba.location ? shamba.location : 'N/A'}</Typography>}
                        size="small"
                        style={{ marginBottom: '8px' }}
                        onClick={() => openIframeDialog(shamba.iframeSrc)}
                      />
                    </div>
                  )}
                  
                  {shamba.latitude &&( <Typography variant="caption" color="textSecondary">
                  lattitude: {shamba.latitude} 
                        </Typography>)}
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="textSecondary">
                        Price: Ksh {shamba.price.toLocaleString()}
                      </Typography>
                      }
                    />
                     <div>
            <Typography variant="caption" color="textSecondary">
              Map:{' '}
              {shamba.iframeSrc? (
                <>
                  <Tooltip title="Show map">
                    <IconButton
                      aria-label="map"
                      onClick={() => openIframeDialog(shamba.iframeSrc)}
                    >
                      <MapIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                'N/A'
              )}
            </Typography>
          </div>
          {shamba.longitude &&( <Typography variant="caption" color="textSecondary">
                  longitude: {shamba.longitude}
                        </Typography>)}
                  </CardContent>
                  <CardActions>
                  
                  </CardActions>
                </Card>
              </Grid>
              ))}
          </Grid>
          <Dialog
            open={openDialog}
            onClose={closeIframeDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Google Map</DialogTitle>
            <DialogContent>
              <iframe
                src={iframeSrcToShow}
                width="640"
                height="480"
                title="Google Map"
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Shamba;

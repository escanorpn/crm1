import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../store/firebase";
import {
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  Paper,
  Grid,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useSelector } from "react-redux";

const Public = () => {
  const DB = useSelector((state) => state.app.DB);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [bannerURL, setBannerURL] = useState("");
  const [contactInfo, setContactInfo] = useState(null);
  const [heroText, setHeroText] = useState("");
  const [entityName, setEntityName] = useState("");

  useEffect(() => {
    const portfolioRef = ref(db, `${DB}/portfolio`);
    const bannerPath = ref(db, `${DB}/portfolio/banner`);
    const contactInfoRef = ref(db, `${DB}/contactInfo`);
    const heroTextRef = ref(db, `${DB}/heroSection/texts`);
    const servicesRef = ref(db, `${DB}/services`);
    onValue(servicesRef, (snapshot) => {
      const servicesData  = snapshot.val();
      if (servicesData ) {
        const servicesArray = Object.keys(servicesData ).map((key) => ({
          id: key,
          ...servicesData [key],
        }));
        setServices(servicesArray);
      } else {
        setServices([]);
      }
    });

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

    onValue(bannerPath, (snapshot) => {
      const bannerData = snapshot.val();
      if (bannerData && bannerData.banner_img) {
        setBannerURL(bannerData.banner_img);
      } else {
        setBannerURL("");
      }
    });

    onValue(contactInfoRef, (snapshot) => {
      const contactInfoData = snapshot.val();
      setContactInfo(contactInfoData);
    });

    onValue(heroTextRef, (snapshot) => {
      const heroTextData = snapshot.val();
      if (heroTextData) {
        setHeroText(heroTextData.text || "");
        setEntityName(heroTextData.name || "");
      }
    });
  }, [DB]);

  return (
    <div>
      <CssBaseline />
      <Container
        style={{
          marginTop: "40vh",
          width: "100%",
          maxWidth: "3000px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingRight: "5px",
          paddingLeft: "5px",
        }}
      >
        <style>{`
          .custom-card {
            box-shadow: 7px 19px 20px 9px #9ec8c121;
          }
        `}</style>
        <AppBar position="static" className="navigation-top">
          <Toolbar>
            <Typography variant="h6">{entityName}</Typography>
          </Toolbar>
        </AppBar>
        <img src={bannerURL} alt="Banner Image" className="bannerImage" />
        <Paper style={{ padding: "10px", paddingBottom: "30px", marginTop: "40px" }}>
          <Card style={{ padding: "16px", maxWidth: "300px", marginLeft: "auto", marginRight: "auto",  marginTop: "80px"}} className="img-card">
            {heroText && (
              <CardContent>
                <Typography variant="h6">Hero Section Text</Typography>
                <Typography>{heroText}</Typography>
              </CardContent>
            )}
          </Card>
   
          <Typography variant="h5" style={{ marginTop: "72px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>Services</Typography>
            <Grid container spacing={2}>
              {services &&
                services.length > 0 &&
                services.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={3} lg={3}>
                    {(item.link || item.files || item.name) && (
                      <Card key={item.id} className="img-card" style={{ marginBottom: "16px" , }}>
                        {item.files && (
                          <Carousel
                            animation="slide"
                            navButtonsAlwaysVisible={false}
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
                                className="circular-image"
                           
                              />
                              
                              ))
                            ) : (
                              <></>
                            )}
                          </Carousel>
                        )}
                        <CardContent>
                          {item.name && (
                            <Typography variant="h6" style={{ fontWeight: "bold" }}>
                              {item.name}
                            </Typography>
                          )}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.link}
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                ))}
            </Grid>
      
        
          <Typography variant="h5" style={{ marginTop: "72px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>Samples</Typography>
          <Grid container spacing={2}>
            {portfolio &&
              portfolio.length > 0 &&
              portfolio.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={4}>
                  {(item.link || item.files || item.name) && (
                    <Card key={item.id} className="img-card" style={{ marginBottom: "16px" }}>
                      {item.files && (
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
                            <></>
                          )}
                        </Carousel>
                      )}
                      <CardContent>
                        {item.name && (
                          <Typography variant="h6" style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Typography>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.link}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              ))}
          </Grid>
          {contactInfo && (
            <CardContent >
              <Typography variant="h5" style={{ textAlign: "center", marginTop: "72px", marginBottom: "15px",  fontWeight: "bold"}}>Contact Information</Typography>

              <Grid container spacing={2}>
                {/* Emails */}
                {contactInfo.emails && contactInfo.emails.length > 0 && (
                  <Grid item xs={12} sm={4}>
                    <Typography>Emails:</Typography>
                    {contactInfo.emails.map((email, index) => (
                      <Typography key={index}>{email}</Typography>
                    ))}
                  </Grid>
                )}

                {/* Phone Numbers */}
                {contactInfo.phoneNumbers && contactInfo.phoneNumbers.length > 0 && (
                  <Grid item xs={12} sm={4}>
                    <Typography>Phone Numbers:</Typography>
                    {contactInfo.phoneNumbers.map((phoneNumber, index) => (
                      <Typography key={index}>{phoneNumber}</Typography>
                    ))}
                  </Grid>
                )}

                {/* WhatsApp Number */}
                {contactInfo.whatsAppNumber && (
                  <Grid item xs={12} sm={4}>
                    <Typography>WhatsApp Number:</Typography>
                    <Typography>{contactInfo.whatsAppNumber}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          )}

        </Paper>
      </Container>
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
          //  box-shadow:  3px 7px 12px 0px #a7d0c9;
          box-shadow: 6px 20px 20px 2px #000101;
        }
        .circular-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          clip-path: circle(50% at 50% 50%);
        }
      `}</style>
    </div>
  );
};

export default Public;

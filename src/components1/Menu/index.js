import React, { useState } from "react";
import { Card, Grid, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Navigation from "./Navigation";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import HomePage from "./Home";
const LMG = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.location.hash = "#" + page;
  };

  return (
    <div>
      {/* Full-width Navigation Bar */}
      <div className="navigation-top">
        <Navigation handleNavigation={handleNavigation} />
      </div>

      {/* Content based on Current Page */}
      {currentPage === "home" && <HomePage/> }

      {currentPage === "about" && <AboutUs />}
      {currentPage === "contact" && <ContactUs />}

      {/* Styling */}
      <style>
        {`
          .navigation-top {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #333;
            z-index: 999;
          }
        `}
      </style>
    </div>
  );
};

export default LMG;

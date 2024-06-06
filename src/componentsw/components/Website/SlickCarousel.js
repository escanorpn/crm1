import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const SlickCarousel = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', mt: 4 }}>
    
    </Box>
  );
};

export default SlickCarousel;

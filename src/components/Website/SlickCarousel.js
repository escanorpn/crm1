import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { isMobile } from 'react-device-detect';

const SlickCarousel = ({ items }) => {
  const deviceType = isMobile ? 'mobile' : 'desktop';

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5 // Adjust the number of items per view based on your requirement
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  const itemStyle = {
    maxWidth: '150px', // Adjust max width as needed
    maxHeight: '50px',
    // margin: '0 15px', // Adjust the margin value as needed
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Box sx={{ width: '90%', margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 2 }}>
        Brands Trust Us
      </Typography>
      <Carousel 
      arrows={false} 
        swipeable={false}
        draggable={true}
        showDots={false}
        responsive={responsive}
        infinite={true}
        autoPlay={deviceType !== "mobile"}
        autoPlaySpeed={2000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={200}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {items.map((item, index) => (
          <Box key={index} style={itemStyle}>
            {item.type === 'image' && (
              <img src={item.content} alt={`slide-${index}`} style={{ width: '100%', height: 'auto' }} />
            )}
            {item.type === 'text' && (
              <Typography variant="h4" component="div" style={{ textAlign: 'center' }}>
                {item.content}
              </Typography>
            )}
            {item.type === 'card' && (
              <Card style={{ maxWidth: '150px', maxHeight: '50px' }}>
                <CardMedia
                  component="img"
                  height="50"
                  image={item.content.image}
                  alt={`card-slide-${index}`}
                  style={{ maxHeight: '50px' }}
                />
                <CardContent style={{ maxHeight: '50px' }}>
                  <Typography variant="h5" component="div">
                    {item.content.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.content.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default SlickCarousel;
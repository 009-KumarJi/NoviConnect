import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import {Typography, Button, Container, createTheme, Box} from '@mui/material';
import nFImg1 from '../assets/images/not-found/not-found.jpg';
import nFImg2 from '../assets/images/not-found/not-found-1.jpg';
import nFImg3 from '../assets/images/not-found/not-found-2.jpg';
import nFImg4 from '../assets/images/not-found/not-found-3.jpg';
import nFImg5 from '../assets/images/not-found/not-found-4.jpg';
import nFImg6 from '../assets/images/not-found/not-found-5.jpg';
import nFImg7 from '../assets/images/not-found/not-found-6.jpg';
import nFImg8 from '../assets/images/not-found/not-found-7.jpg';
import {colorPalette} from "../constants/color.js";

const NotFound = () => {
  const images = [nFImg1, nFImg2, nFImg3, nFImg4, nFImg5, nFImg6, nFImg7, nFImg8];
  const [selectedImage, setSelectedImage] = useState(nFImg1);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setSelectedImage(images[randomIndex]);
    }, 3000);
  }, [images]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box width={"100vw"} height={"100vh"} sx={{backgroundColor: `rgb(7, 0, 42)`}} >
      <Container maxWidth="sm" style={{ textAlign: 'center', paddingTop: '3rem', color: `${colorPalette().CP9}` }}>
        <img src={selectedImage} alt="Not Found" style={{ width: '100%', maxWidth: '300px' }} />
        <Typography variant="h2" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" style={{ paddingBottom: '1rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome} style={{bgcolor: `${colorPalette(0.6).CP5}`}}>
          Go to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
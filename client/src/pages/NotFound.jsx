import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Typography, Button, Container, createTheme, ThemeProvider as MuiThemeProvider} from '@mui/material';
import nFImg1 from '../assets/images/not-found/not-found.jpg';
import nFImg2 from '../assets/images/not-found/not-found-1.jpg';
import nFImg3 from '../assets/images/not-found/not-found-2.jpg';
import nFImg4 from '../assets/images/not-found/not-found-3.jpg';
import nFImg5 from '../assets/images/not-found/not-found-4.jpg';
import nFImg6 from '../assets/images/not-found/not-found-5.jpg';
import nFImg7 from '../assets/images/not-found/not-found-6.jpg';
import nFImg8 from '../assets/images/not-found/not-found-7.jpg';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const NotFound = () => {
  const images = [nFImg1, nFImg2, nFImg3, nFImg4, nFImg5, nFImg6, nFImg7, nFImg8];
  const [selectedImage, setSelectedImage] = useState(nFImg1);
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setSelectedImage(images[randomIndex]);
    }, 3000);

    return () => clearInterval(interval); // This represents the cleanup function.
  }, [images]);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Container maxWidth="sm" style={{textAlign: 'center', marginTop: '3rem'}}>
        <img src={selectedImage} alt="Not Found" style={{width: '100%', maxWidth: '300px'}}/>
        <Typography variant="h2" style={{marginTop: '1.5rem', marginBottom: '1rem'}}>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" style={{marginBottom: '1rem'}}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go to Home
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default NotFound;


// Path: client/src/pages/NotFound.jsx
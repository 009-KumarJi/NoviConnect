import React from 'react'
import AppLayout from "../components/layout/AppLayout.jsx";
import {Box, Typography} from "@mui/material";
import {colorPalette, textDark} from "../constants/color.js";

const Home = () => {
  return (
    <Box
      bgcolor={colorPalette(0.3).CP8}
      height={"100%"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="auto"
      whiteSpace="nowrap"
    >
  <Typography p="2rem" variant="h1" fontWeight="bolder" textAlign="center" color={textDark}>
    NoviConnect
  </Typography>
</Box>
  )
}
export default AppLayout()(Home);

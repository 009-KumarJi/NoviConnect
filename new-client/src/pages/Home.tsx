import React from 'react'
import AppLayout from "../components/layout/AppLayout.jsx";
import {Box, Stack, Typography} from "@mui/material";
import {userTheme} from "../constants/userTheme.constant.js";

const Home = () => {
  return (
    <Box
      sx={{background: userTheme.gradient}}
      height={"100%"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="auto"
      p={3}
    >
      <Stack
        spacing={2}
        sx={{
          p: {xs: 4, md: 6},
          borderRadius: "2rem",
          background: "linear-gradient(180deg, rgba(16, 27, 44, 0.9) 0%, rgba(10, 18, 30, 0.92) 100%)",
          border: `1px solid ${userTheme.border}`,
          boxShadow: userTheme.shadow,
          maxWidth: "44rem",
          textAlign: "center",
        }}
      >
        <Typography variant="overline" sx={{letterSpacing: "0.34rem", color: userTheme.accent}}>
          Secure Messaging
        </Typography>
        <Typography p="0" variant="h1" fontWeight="bolder" textAlign="center" color={userTheme.text}>
          Novi<span style={{color: userTheme.accentBlue}}>Connect</span>
        </Typography>
        <Typography sx={{color: userTheme.textMuted, fontSize: "1.05rem"}}>
          A sleeker workspace for conversations, presence, and collaboration.
        </Typography>
      </Stack>
    </Box>
  )
}
export default AppLayout()(Home);

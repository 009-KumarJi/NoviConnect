import React from 'react';
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {useInputValidation} from "6pp";
import {colorPalette} from "../../constants/color.constant.js";
import {Navigate} from "react-router-dom";
import {sout} from "../../utils/helper.js";

const isAdmin = false;

const KrishnaDenLogin = () => {
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    sout("Login form submitted");
  };

  if (isAdmin) return <Navigate to="/krishnaden/dashboard"/>;

  return (
    <Box sx={{backgroundColor: `rgba(23, 23, 91, 1)`, height: "100vh",}}>
      <Typography variant="h1" padding="5rem 0" textAlign="center" color={colorPalette().CP9}>Root Login</Typography>
      <Container
        component={"main"} maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Paper
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,1),rgba(2, 62, 138, 0.5))",
          }}
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 6,
          }}
        >
            <form
              onSubmit={submitHandler}
              style=
                {{
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
            >
              <TextField required={true} label={"Secret Key"} type={"password"} margin={"normal"}
                         variant={"outlined"}
                         fullWidth={true} value={secretKey.value} onChange={secretKey.changeHandler}/>
              <Button
                sx={{marginTop: "1rem"}}
                variant="contained"
                color="primary"
                type={"submit"}
                fullWidth={true}
              >
                Sign In
              </Button>
            </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default KrishnaDenLogin;
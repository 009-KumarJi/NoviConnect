import React from 'react'
import {Button, Container, Paper, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useInputValidation} from "6pp";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmitSignIn = (event) => {
    event.preventDefault();
    // Add code here to log the user in
  }

  const goToRegister = () => {
    navigate('/register');
  }

  const username = useInputValidation("");
  const password = useInputValidation("");

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0), rgba(204, 204, 255, 0.7))",
      }}
    >
    <Container
      component={"main"} maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Typography variant={"h1"} marginBottom={"3rem"} marginTop={"2rem"}>NoviChat</Typography>
      <Paper
        style={{
          backgroundImage: "linear-gradient(rgba(204, 204, 255, 0.5), rgba(0,0,0,0))",
        }}
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 6,
        }}
      >
          <>
            <form
              onSubmit={handleSubmitSignIn}
              style=
                {{
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
            >
              <TextField
                required={true} label={"Username"}
                type={"text"} margin={"normal"}
                variant={"outlined"} fullWidth={true}
                value={username.value} onChange={username.changeHandler}
              />
              <TextField required={true} label={"Password"} type={"password"} margin={"normal"} variant={"outlined"}
                         fullWidth={true} value={password.value} onChange={password.changeHandler} />
              <Button
                sx={{marginTop: "1rem"}}
                variant={"contained"}
                color={"primary"}
                type={"submit"}
                fullWidth={true}
              >
                Sign In
              </Button>
            </form>
            <Typography textAlign="center" marginTop={"1rem"}>New to NoviChat?</Typography>
            <Button
              variant={"text"}
              onClick={goToRegister}
              fullWidth={true}
            >
              Sign Up
            </Button>
          </>
      </Paper>
    </Container>
      </div>
  )
}
export default Login
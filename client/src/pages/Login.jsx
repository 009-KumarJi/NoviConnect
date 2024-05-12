import React, {useState} from 'react'
import {Button, Container, Paper, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useInputValidation} from "6pp";
import {colorPalette} from "../constants/color.constant.js";
import axios from "axios";
import {server} from "../constants/config.constant.js";
import {userExists} from "../redux/reducers/authSlice.js";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmitSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      }
    };
    try {
      const {data} = await axios.post(`${server}/api/v1/user/login`, {
          username: username.value,
          password: password.value,
        },
        config
      );
      toast.success(data.message);
      dispatch(userExists(data.user));
      navigate("/", {replace: true});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register");
  };


  const username = useInputValidation("");
  const password = useInputValidation("");

  return (
    <div
      style={{
        backgroundImage: `radial-gradient(circle, rgba(0,212,255,1) 35%, rgba(62,125,143,0.6167717086834734) 100%)`,
      }}
    >
      <Container
        component="main" maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <Typography variant="h1" marginBottom="3rem" marginTop="2rem"
                    color={colorPalette(1).CP2}>NoviConnect</Typography>
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
              <TextField required={true} label={"Password"} type={"password"} margin={"normal"}
                         variant={"outlined"}
                         fullWidth={true} value={password.value} onChange={password.changeHandler}/>
              <Button
                sx={{marginTop: "1rem"}}
                variant={"contained"}
                color={"primary"}
                type={"submit"}
                fullWidth={true}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>
            <Typography textAlign="center" marginTop={"1rem"}>New to NoviConnect?</Typography>
            <Button
              variant={"text"}
              onClick={goToRegister}
              fullWidth={true}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </>
        </Paper>
      </Container>
    </div>
  )
}
export default Login;

// Path: client/src/pages/Login.jsx
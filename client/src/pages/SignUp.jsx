import React from 'react';
import {Avatar, Box, Button, Container, IconButton, Paper, Stack, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {CameraAlt as CameraAltIcon} from "@mui/icons-material";
import {VisuallyHiddenInput} from "../components/styles/StyledComponents.jsx";
import {useFileHandler, useInputValidation, useStrongPassword} from "6pp";
import {usernameValidator} from "../utils/Validators.js";
import {colorPalette} from "../constants/color.constant.js";
import axios from "axios";
import toast from "react-hot-toast";
import {server} from "../constants/config.constant.js";
import {useDispatch} from "react-redux";
import {userExists} from "../redux/reducers/authSlice.js";


const SignUpForm = () => {
  const firstName = useInputValidation("");
  const lastName = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const email = useInputValidation("");
  const password = useStrongPassword();
  const dob = useInputValidation("");
  const bio = useInputValidation("");
  const dispatch = useDispatch();

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();

    if (!firstName.value || !lastName.value || !username.value || !email.value || !password.value || !dob.value) {
      alert('Please fill all required fields.');
      return;
    }
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", `${firstName.value} ${lastName.value}`);
    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("dob", dob.value);
    formData.append("bio", bio.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    try {
      const {data} = await axios.post(`${server}/api/v1/user/new-login`, formData, config);
      dispatch(userExists());
      toast.success(data.message);
      goToLogin();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  const avatar = useFileHandler("single");
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");

  const today = new Date();
  const elevenYearsAgo = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
  const maxDate = `${elevenYearsAgo.getFullYear()}-${String(elevenYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(elevenYearsAgo.getDate()).padStart(2, '0')}`;

  return (
    <div
      style={{
        backgroundImage: `radial-gradient(circle, rgba(0,212,255,1) 35%, rgba(62,125,143,0.6167717086834734) 100%)`,
        height: "100%",
      }}
    >
      <Container
        component={"main"} maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant={"h1"} marginBottom={"3rem"} marginTop={"2rem"}
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
            padding: 4,
            marginBottom: '2rem',
          }}
        >
          <form onSubmit={handleSubmitSignUp}>
            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
              <Avatar
                sx={{
                  width: "10rem",
                  height: "10rem",
                  objectFit: 'contain',
                }}
                src={avatar.preview}
              />
              {avatar.error && (
                <Typography m={"1rem"} color="error" variant="caption">
                  {avatar.error}
                </Typography>
              )}
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  ":hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.3 )",
                  },
                  padding: '0.5rem',
                  borderRadius: '50%',
                }}
                component="label"
              >
                <>
                  <CameraAltIcon/>
                  <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                </>
              </IconButton>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TextField size="small" sx={{marginRight: "1rem"}} fullWidth required label={"First Name"}
                         type={"text"}
                         margin={"normal"} variant={"outlined"}
                         value={firstName.value} onChange={firstName.changeHandler}/>
              <TextField size="small" fullWidth required label={"Surname"} type={"text"} margin={"normal"}
                         variant={"outlined"}
                         value={lastName.value} onChange={lastName.changeHandler}/>
            </Box>
            <TextField size="small" fullWidth required label={"Username"} type={"text"} margin={"normal"}
                       variant={"outlined"}
                       value={username.value} onChange={username.changeHandler}/>
            {username.error && (
              <Typography color="error" variant="caption">
                {username.error}
              </Typography>
            )}
            <TextField size="small" fullWidth required label={"Email"} type={"email"} margin={"normal"}
                       variant={"outlined"}
                       value={email.value} onChange={email.changeHandler}/>
            <TextField size="small" fullWidth required label={"Date of Birth"} type={"date"}
                       margin={"normal"} variant={"outlined"} value={dob.value} onChange={dob.changeHandler}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       inputProps={{
                         max: maxDate,
                       }}
            />
            <TextField size="small" fullWidth required label={"Password"} type={"password"}
                       margin={"normal"}
                       variant={"outlined"}
                       value={password.value} onChange={password.changeHandler}/>
            {password.error && (
              <Typography color="error" variant="caption">
                {password.error}
              </Typography>
            )}
            <TextField
              size="small"
              fullWidth
              label={"Bio"}
              type={"text"}
              margin={"normal"}
              variant={"outlined"}
              value={bio.value}
              onChange={bio.changeHandler}
              multiline
              required={true}
              rows={4}
            />
            <Button sx={{marginTop: "1rem"}}
                    variant={"contained"}
                    color={"primary"}
                    type={"submit"}
                    fullWidth={true}
            >
              Sign Up
            </Button>
          </form>
          <Typography textAlign="center" marginTop={"1rem"}>Already have an account?</Typography>
          <Button
            variant={"text"}
            onClick={goToLogin}
            fullWidth={true}
          >
            Sign In
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUpForm;

// Path: client/src/pages/SignUp.jsx
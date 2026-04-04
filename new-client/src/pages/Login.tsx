import React, {useState} from 'react'
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useInputValidation} from "../hooks/useCustomForm";
import axios from "axios";
import {server} from "../constants/config.constant.js";
import {userExists} from "../redux/reducers/authSlice.js";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import {userTheme} from "../constants/userTheme.constant.js";
import {ensureUserEncryptionSetup} from "../lib/e2ee";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitSignIn = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const {data} = await axios.post(`${server}/api/v1/user/login`, {
          username: username.value,
          password: password.value,
        },
        {withCredentials: true, headers: {"Content-Type": "application/json"}}
      );
      toast.success(data.message);
      dispatch(userExists(data.user));
      const encryptionResult = await ensureUserEncryptionSetup({
        user: data.user,
        server,
        password: password.value,
      });
      if (encryptionResult?.needsRecoveryKey) {
        toast("Secure history needs your recovery key on this device. You can restore it from Settings.", {
          icon: "🔐",
          duration: 6000,
        });
      }
      if (encryptionResult?.recoveryKey) {
        toast("A new recovery key was created for this account. Open Settings and save it somewhere safe.", {
          icon: "🗝️",
          duration: 7000,
        });
      }
      navigate("/", {replace: true});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  const goToRegister = () => navigate("/register");

  const username = useInputValidation("");
  const password = useInputValidation("");

  return (
    <Box sx={{minHeight: "100vh", background: userTheme.gradient, position: "relative", overflow: "hidden"}}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 18% 18%, rgba(56, 189, 248, 0.16), transparent 22%), radial-gradient(circle at 82% 12%, rgba(94, 234, 212, 0.14), transparent 20%)",
        }}
      />
      <Container
        component="main" maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: {xs: 3, sm: 5},
            width: "100%",
            borderRadius: "1.75rem",
            background: "linear-gradient(180deg, rgba(16, 27, 44, 0.96) 0%, rgba(10, 18, 30, 0.96) 100%)",
            border: `1px solid ${userTheme.border}`,
            boxShadow: userTheme.shadow,
            color: userTheme.text,
          }}
        >
          <Stack spacing={1.2} mb={3}>
            <Typography variant="overline" sx={{letterSpacing: "0.28rem", color: userTheme.accent}}>
              Welcome Back
            </Typography>
            <Typography variant="h2" sx={{fontSize: {xs: "2.35rem", sm: "2.8rem"}, fontWeight: 700, color: userTheme.text}}>
              NoviConnect
            </Typography>
            <Typography sx={{color: userTheme.textMuted}}>
              Modern messaging with a calmer, darker workspace.
            </Typography>
          </Stack>
          <form
            onSubmit={handleSubmitSignIn}
            style={{
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
              sx={fieldSx}
            />
            <TextField required={true} label={"Password"} type={"password"} margin={"normal"}
                       variant={"outlined"}
                       fullWidth={true} value={password.value} onChange={password.changeHandler}
                       sx={fieldSx}/>

            <Button
              sx={primaryButtonSx}
              variant={"contained"}
              type={"submit"}
              fullWidth={true}
              disabled={isLoading}
            >
              Sign In
            </Button>

            <Typography
              textAlign="right"
              marginTop="0.5rem"
              fontSize="0.85rem"
              sx={{cursor: "pointer", color: userTheme.accentBlue, textDecoration: "underline"}}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </form>

          <Typography textAlign="center" marginTop={"1.5rem"} sx={{color: userTheme.textMuted}}>New to NoviConnect?</Typography>
          <Button
            variant={"text"}
            onClick={goToRegister}
            fullWidth={true}
            disabled={isLoading}
            sx={{color: userTheme.accent}}
          >
            Sign Up
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: userTheme.text,
    backgroundColor: "rgba(8, 15, 25, 0.88)",
    borderRadius: "1rem",
    "& fieldset": {borderColor: userTheme.border},
    "&:hover fieldset": {borderColor: userTheme.borderStrong},
    "&.Mui-focused fieldset": {borderColor: userTheme.accent},
  },
  "& .MuiInputLabel-root": {color: userTheme.textMuted},
  "& .MuiInputLabel-root.Mui-focused": {color: userTheme.accent},
};
const primaryButtonSx = {
  mt: "1rem",
  borderRadius: "999px",
  py: 1.3,
  fontWeight: 700,
  letterSpacing: "0.05rem",
  background: "linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)",
  color: "#041019",
  boxShadow: "0 14px 36px rgba(56, 189, 248, 0.24)",
  "&:hover": {
    background: "linear-gradient(135deg, #99f6e4 0%, #67e8f9 100%)",
  },
};
export default Login;

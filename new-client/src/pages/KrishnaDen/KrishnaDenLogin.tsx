// path: client/src/pages/KrishnaDen/KrishnaDenLogin.jsx
import React, {useEffect} from 'react';
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {useInputValidation} from "../../hooks/useCustomForm";
import {Navigate} from "react-router-dom";
import {sout} from "../../utils/helper.js";
import {useDispatch, useSelector} from "react-redux";
import {adminLogin, verifyAdmin} from "../../redux/thunks/admin.js";
import {adminTheme} from "../../constants/adminTheme.constant.js";


const KrishnaDenLogin = () => {
  const secretKey = useInputValidation("");

  const {isAdmin} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
    sout("Login form submitted");
  };

  useEffect(() => {
    sout("Verifying Admin... ")
    dispatch(verifyAdmin())
  }, [dispatch]);

  if (isAdmin) return <Navigate to={"/krishnaden/dashboard"}/>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: adminTheme.gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 15% 20%, rgba(34, 211, 238, 0.18), transparent 24%), radial-gradient(circle at 85% 10%, rgba(59, 130, 246, 0.16), transparent 20%)",
          pointerEvents: "none",
        }}
      />
      <Container
        component={"main"} maxWidth="xs"
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
            background: "linear-gradient(180deg, rgba(17, 31, 52, 0.96) 0%, rgba(10, 19, 32, 0.96) 100%)",
            color: adminTheme.text,
            border: `1px solid ${adminTheme.border}`,
            boxShadow: adminTheme.shadow,
            backdropFilter: "blur(20px)",
          }}
        >
          <Stack spacing={1.5} mb={3}>
            <Typography variant="overline" sx={{letterSpacing: "0.32rem", color: adminTheme.accent, fontWeight: 700}}>
              KrishnaDen Access
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              Root Login
            </Typography>
            <Typography sx={{color: adminTheme.textMuted}}>
              Enter the admin secret key to access the darkroom dashboard.
            </Typography>
          </Stack>
          <form
            onSubmit={submitHandler}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <TextField
              required={true}
              label={"Secret Key"}
              type={"password"}
              margin={"normal"}
              variant={"outlined"}
              fullWidth={true}
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: adminTheme.text,
                  backgroundColor: "rgba(5, 12, 21, 0.62)",
                  borderRadius: "1rem",
                  "& fieldset": {borderColor: adminTheme.border},
                  "&:hover fieldset": {borderColor: adminTheme.borderStrong},
                  "&.Mui-focused fieldset": {borderColor: adminTheme.accent},
                },
                "& .MuiInputLabel-root": {color: adminTheme.textMuted},
                "& .MuiInputLabel-root.Mui-focused": {color: adminTheme.accent},
              }}
            />
            <Button
              sx={{
                marginTop: "1.25rem",
                borderRadius: "999px",
                py: 1.3,
                fontWeight: 700,
                letterSpacing: "0.08rem",
                background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                color: "#04111d",
                boxShadow: "0 14px 40px rgba(34, 211, 238, 0.24)",
                "&:hover": {
                  background: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)",
                },
              }}
              variant="contained"
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

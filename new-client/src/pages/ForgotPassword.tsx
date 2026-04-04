import React, { useState } from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { server } from "../constants/config.constant.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {userTheme} from "../constants/userTheme.constant.js";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/forgot-password`, { email });
      toast.success(data.message);
      setStep(2);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/verify-otp`, { email, otp });
      if (!data.resetToken) {
        toast.error("Server did not return a reset token. Please try again.");
        return;
      }
      toast.success(data.message);
      setResetToken(data.resetToken);
      setStep(3);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.patch(`${server}/api/v1/user/reset-password`, { 
        email, 
        resetToken, 
        newPassword 
      });
      toast.success(data.message);
      if (data?.e2eeRecoveryReset) {
        toast("Secure message recovery was reset. Older encrypted chats may only remain readable on devices that were already logged in.", {
          icon: "⚠️",
          duration: 7000,
        });
      }
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{minHeight: "100vh", background: userTheme.gradient, position: "relative", overflow: "hidden"}}>
      <Container
        component="main" maxWidth="xs"
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}
      >
        <Paper
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: {xs: 3, sm: 5}, width: '100%', borderRadius: "1.75rem", background: "linear-gradient(180deg, rgba(16, 27, 44, 0.96) 0%, rgba(10, 18, 30, 0.96) 100%)", border: `1px solid ${userTheme.border}`, boxShadow: userTheme.shadow, color: userTheme.text }}
        >
          <Stack spacing={1.2} mb={2}>
            <Typography variant="overline" sx={{letterSpacing: "0.28rem", color: userTheme.accent}}>
              Recovery
            </Typography>
            <Typography variant="h3" sx={{fontWeight: 700, color: userTheme.text}}>
              Reset access
            </Typography>
            <Typography sx={{color: userTheme.textMuted}}>
              Step through email verification and set a fresh password.
            </Typography>
            <Typography
              sx={{
                color: "#fcd34d",
                backgroundColor: "rgba(250, 204, 21, 0.08)",
                border: "1px solid rgba(250, 204, 21, 0.18)",
                borderRadius: "1rem",
                px: 1.5,
                py: 1.2,
                fontSize: "0.92rem",
              }}
            >
              Password reset by OTP can reset secure message recovery for this account. Older encrypted chats may not be recoverable on new devices afterward.
            </Typography>
          </Stack>
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem" sx={{color: userTheme.textMuted}}>Forgot Password</Typography>
              <TextField 
                required fullWidth label="Email" type="email" margin="normal" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                sx={recoveryFieldSx}
              />
              <Button type="submit" variant="contained" fullWidth sx={recoveryButtonSx} disabled={isLoading}>
                Send OTP
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem" sx={{color: userTheme.textMuted}}>Enter the OTP sent to your email</Typography>
              <TextField 
                required fullWidth label="OTP" type="text" margin="normal" 
                value={otp} onChange={(e) => setOtp(e.target.value)} 
                sx={recoveryFieldSx}
              />
              <Button type="submit" variant="contained" fullWidth sx={recoveryButtonSx} disabled={isLoading}>
                Verify OTP
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem" sx={{color: userTheme.textMuted}}>Enter your new password</Typography>
              <TextField 
                required fullWidth label="New Password" type="password" margin="normal" 
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                sx={recoveryFieldSx}
              />
              <Button type="submit" variant="contained" fullWidth sx={recoveryButtonSx} disabled={isLoading}>
                Reset Password
              </Button>
            </form>
          )}

          <Button variant="text" fullWidth sx={{ marginTop: "1.5rem", color: userTheme.accent }} onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
const recoveryFieldSx = {
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
const recoveryButtonSx = {
  mt: "1rem",
  borderRadius: "999px",
  py: 1.3,
  fontWeight: 700,
  background: "linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)",
  color: "#041019",
  "&:hover": {
    background: "linear-gradient(135deg, #99f6e4 0%, #67e8f9 100%)",
  },
};

export default ForgotPassword;

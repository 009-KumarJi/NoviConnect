import React, { useState } from 'react';
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { colorPalette } from "../constants/color.constant.js";
import axios from "axios";
import { server } from "../constants/config.constant.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
      console.log("verifyOTP response:", data);  // <-- check this in browser console
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
      console.log("Sending reset:", { email, resetToken, newPassword });
      const { data } = await axios.patch(`${server}/api/v1/user/reset-password`, { 
        email, 
        resetToken, 
        newPassword 
      });
      toast.success(data.message);
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `radial-gradient(circle, rgba(0,212,255,1) 35%, rgba(62,125,143,0.6167717086834734) 100%)`,
      }}
    >
      <Container
        component="main" maxWidth="xs"
        sx={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h1" marginBottom="3rem" marginTop="2rem" color={colorPalette(1).CP2}>
          NoviConnect
        </Typography>
        <Paper
          style={{ backgroundImage: "linear-gradient(rgba(204, 204, 255, 0.5), rgba(0,0,0,0))" }}
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, width: '100%' }}
        >
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem">Forgot Password</Typography>
              <TextField 
                required fullWidth label="Email" type="email" margin="normal" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "1rem" }} disabled={isLoading}>
                Send OTP
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem">Enter the OTP sent to your email</Typography>
              <TextField 
                required fullWidth label="OTP" type="text" margin="normal" 
                value={otp} onChange={(e) => setOtp(e.target.value)} 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "1rem" }} disabled={isLoading}>
                Verify OTP
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <Typography textAlign="center" marginBottom="1rem">Enter your new Password</Typography>
              <TextField 
                required fullWidth label="New Password" type="password" margin="normal" 
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: "1rem" }} disabled={isLoading}>
                Reset Password
              </Button>
            </form>
          )}

          <Button variant="text" fullWidth sx={{ marginTop: "1.5rem" }} onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPassword;

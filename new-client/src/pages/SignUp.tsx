import React, {useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {CameraAlt as CameraAltIcon} from "@mui/icons-material";
import {VisuallyHiddenInput} from "../components/styles/StyledComponents.jsx";
import {useFileHandler, useInputValidation, useStrongPassword} from "../hooks/useCustomForm";
import {usernameValidator} from "../utils/Validators.js";
import axios from "axios";
import toast from "react-hot-toast";
import {server} from "../constants/config.constant.js";
import {useDispatch} from "react-redux";
import {userExists} from "../redux/reducers/authSlice.js";
import {capitalizeFirstLetter} from "../utils/helper.js";
import {GoogleLogin} from "@react-oauth/google";
import {userTheme} from "../constants/userTheme.constant.js";
import {ensureUserEncryptionSetup} from "../lib/e2ee";

const SignUpForm = () => {
  const firstName = useInputValidation("");
  const lastName = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const email = useInputValidation("");
  const password = useStrongPassword();
  const dob = useInputValidation("");
  const bio = useInputValidation("");
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState("");
  const [googleEmailLocked, setGoogleEmailLocked] = useState(false);

  const today = new Date();
  const elevenYearsAgo = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
  const maxDate = `${elevenYearsAgo.getFullYear()}-${String(elevenYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(elevenYearsAgo.getDate()).padStart(2, '0')}`;

  const handleGoogleSignup = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const {data} = await axios.post(`${server}/api/v1/user/google-signup-verify`, {
        credential: credentialResponse.credential,
      });
      toast.success(data.message);

      const {name, email: gEmail, picture} = data.payload;
      const parts = name.split(" ");
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ");
      const fakeEvent = (val: string) => ({target: {value: val}} as any);

      firstName.changeHandler(fakeEvent(first));
      lastName.changeHandler(fakeEvent(last));
      email.changeHandler(fakeEvent(gEmail));

      setIsGoogleSignup(true);
      setGoogleAvatarUrl(picture || "");
      setGoogleEmailLocked(true);

      toast("Complete your profile details below.", {icon: "↓"});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Google verification failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email.value) return toast.error("Please enter your email first.");
    setIsLoading(true);
    try {
      await axios.post(
        `${server}/api/v1/user/send-signup-otp`,
        {email: email.value},
        {timeout: 15000}
      );
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setShowOtpModal(true);
    } catch (error: any) {
      const message =
        error?.code === "ECONNABORTED"
          ? "OTP request timed out. Please check the mail server config and try again."
          : error?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSignUp = async (event: any) => {
    event.preventDefault();

    const fields = [firstName, lastName, username, email, password, dob];
    if (fields.some(field => !field.value)) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!isGoogleSignup) {
      if (!otpSent) {
        await handleSendOtp();
        return;
      }
      setShowOtpModal(true);
      return;
    }

    await submitRegistration(undefined, true);
  };

  const submitRegistration = async (verifiedOtp?: string, googlePath = false) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (avatar.file) formData.append("avatar", avatar.file);

      formData.append("name", `${capitalizeFirstLetter(firstName.value)} ${capitalizeFirstLetter(lastName.value)}`);
      formData.append("username", username.value);
      formData.append("email", email.value.toLowerCase());
      formData.append("password", password.value);
      formData.append("dob", dob.value);
      formData.append("bio", bio.value);

      if (googlePath) {
        formData.append("isGoogleSignup", "true");
        if (googleAvatarUrl && !avatar.file) formData.append("googleAvatarUrl", googleAvatarUrl);
      } else {
        formData.append("otp", verifiedOtp || otp);
      }

      const {data} = await axios.post(`${server}/api/v1/user/new-login`, formData, {
        withCredentials: true,
        headers: {"Content-Type": "multipart/form-data"},
      });
      dispatch(userExists(data.user));
      const encryptionResult = await ensureUserEncryptionSetup({
        user: data.user,
        server,
        password: password.value,
      });
      if (encryptionResult?.recoveryKey) {
        toast("A recovery key was created for secure message recovery. Save it from Settings after signup.", {
          icon: "🗝️",
          duration: 7000,
        });
      }
      toast.success(data.message);
      navigate("/", {replace: true});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) return toast.error("Please enter a valid 6-digit OTP.");
    setShowOtpModal(false);
    await submitRegistration(otp, false);
  };

  return (
    <Box sx={{minHeight: "100vh", background: userTheme.gradient, position: "relative", overflow: "hidden"}}>
      <Container component={"main"} maxWidth="sm" sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", py: 4, position: "relative"}}>
        <Paper
          elevation={3}
          sx={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: {xs: 3, sm: 5}, width: '100%', borderRadius: '1.75rem', background: "linear-gradient(180deg, rgba(16, 27, 44, 0.96) 0%, rgba(10, 18, 30, 0.96) 100%)", border: `1px solid ${userTheme.border}`, boxShadow: userTheme.shadow, color: userTheme.text}}
        >
          <Stack spacing={1.2} mb={3}>
            <Typography variant="overline" sx={{letterSpacing: "0.28rem", color: userTheme.accent}}>
              Create Account
            </Typography>
            <Typography variant="h2" sx={{fontSize: {xs: "2.2rem", sm: "2.8rem"}, fontWeight: 700, color: userTheme.text}}>
              Join NoviConnect
            </Typography>
            <Typography sx={{color: userTheme.textMuted}}>
              Dark, clean, and ready for conversations from day one.
            </Typography>
          </Stack>

          {!isGoogleSignup && (
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3, p: 2, borderRadius: "1.25rem", border: `1px solid ${userTheme.border}`, backgroundColor: "rgba(8, 15, 25, 0.62)"}}>
              <Typography variant="body2" sx={{color: userTheme.textMuted}}>Sign up quickly with Google</Typography>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => toast.error("Google Signup Failed")}
                text="signup_with"
              />
              <Typography variant="body2" sx={{mt: 1, color: userTheme.textMuted}}>or continue with email</Typography>
            </Box>
          )}

          {isGoogleSignup && (
            <Typography variant="body2" textAlign="center" sx={{mb: 2, fontWeight: 600, color: userTheme.accent}}>
              Google verified. Complete your profile below.
            </Typography>
          )}

          <form onSubmit={handleSubmitSignUp} style={{width: '100%'}}>
            <Stack position={"relative"} width={"10rem"} margin={"0 auto 1rem"}>
              <Avatar
                sx={{width: "10rem", height: "10rem", objectFit: 'contain', border: `3px solid ${userTheme.borderStrong}`, boxShadow: userTheme.shadow}}
                src={avatar.preview || googleAvatarUrl}
              />
              <IconButton
                sx={{
                  position: 'absolute', right: 0, bottom: 0,
                  backgroundColor: "rgba(8, 15, 25, 0.92)",
                  border: `1px solid ${userTheme.border}`,
                  color: userTheme.text,
                  ":hover": {backgroundColor: userTheme.accentSoft},
                  padding: '0.5rem', borderRadius: '50%',
                }}
                component="label"
              >
                <>
                  <CameraAltIcon/>
                  <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                </>
              </IconButton>
            </Stack>

            <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: 'center', gap: 2}}>
              <TextField size="small" fullWidth required label={"First Name"} type={"text"} margin={"normal"} variant={"outlined"} value={firstName.value} onChange={firstName.changeHandler} sx={signupFieldSx}/>
              <TextField size="small" fullWidth required label={"Surname"} type={"text"} margin={"normal"} variant={"outlined"} value={lastName.value} onChange={lastName.changeHandler} sx={signupFieldSx}/>
            </Box>

            <TextField size="small" fullWidth required label={"Username"} type={"text"} margin={"normal"} variant={"outlined"} value={username.value} onChange={username.changeHandler} sx={signupFieldSx}/>
            {username.error && <Typography color="error" variant="caption">{username.error}</Typography>}

            <TextField size="small" fullWidth required label={"Email"} type={"email"} margin={"normal"} variant={"outlined"} value={email.value} onChange={email.changeHandler} disabled={googleEmailLocked} helperText={googleEmailLocked ? "Email verified by Google" : ""} sx={signupFieldSx}/>

            <TextField size="small" fullWidth required label={"Date of Birth"} type={"date"} margin={"normal"} variant={"outlined"} value={dob.value} onChange={dob.changeHandler} InputLabelProps={{shrink: true}} inputProps={{max: maxDate}} sx={signupFieldSx}/>

            <TextField size="small" fullWidth required label={"Password"} type={"password"} margin={"normal"} variant={"outlined"} value={password.value} onChange={password.changeHandler} sx={signupFieldSx}/>
            {password.error && <Typography color="error" variant="caption">{password.error}</Typography>}

            <TextField size="small" fullWidth label={"Bio"} type={"text"} margin={"normal"} variant={"outlined"} value={bio.value} onChange={bio.changeHandler} multiline required={true} rows={3} sx={signupFieldSx}/>

            {isGoogleSignup && (
              <Button sx={signupPrimaryButtonSx} variant={"contained"} type={"submit"} fullWidth={true} disabled={isLoading}>
                Create Account
              </Button>
            )}

            {!isGoogleSignup && !otpSent && (
              <Button
                sx={signupPrimaryButtonSx}
                variant={"contained"}
                type={"button"}
                fullWidth={true}
                disabled={isLoading}
                onClick={async (e) => {
                  e.preventDefault();
                  const fields = [firstName, lastName, username, email, password, dob, bio];
                  if (fields.some(f => !f.value)) {
                    toast.error("Please fill all required fields first.");
                    return;
                  }
                  await handleSendOtp();
                }}
              >
                Send Verification OTP
              </Button>
            )}

            {!isGoogleSignup && otpSent && (
              <Button
                sx={{...signupPrimaryButtonSx, background: "transparent", color: userTheme.text, border: `1px solid ${userTheme.borderStrong}`}}
                variant={"outlined"}
                type={"button"}
                fullWidth={true}
                disabled={isLoading}
                onClick={() => setShowOtpModal(true)}
              >
                Enter OTP to Complete Signup
              </Button>
            )}
          </form>

          <Typography textAlign="center" marginTop={"1rem"} sx={{color: userTheme.textMuted}}>Already have an account?</Typography>
          <Button variant={"text"} onClick={() => navigate("/login")} fullWidth={true} disabled={isLoading} sx={{color: userTheme.accent}}>
            Sign In
          </Button>
        </Paper>
      </Container>

      <Dialog open={showOtpModal} onClose={() => setShowOtpModal(false)} PaperProps={{sx: {borderRadius: "1.5rem", background: "linear-gradient(180deg, rgba(16, 27, 44, 0.98) 0%, rgba(10, 18, 30, 0.98) 100%)", color: userTheme.text, border: `1px solid ${userTheme.border}`}}}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, minWidth: 300, paddingTop: "12px !important"}}>
          <Typography variant="body2" sx={{color: userTheme.textMuted}}>
            We sent a 6-digit code to <strong>{email.value}</strong>. Enter it below to verify your email and create your account.
          </Typography>
          <TextField
            label="6-digit OTP" type="text" fullWidth
            value={otp} onChange={(e) => setOtp(e.target.value)}
            inputProps={{maxLength: 6}}
            sx={signupFieldSx}
          />
          <Button variant="contained" onClick={handleOtpSubmit} disabled={isLoading} fullWidth sx={signupPrimaryButtonSx}>
            Verify & Create Account
          </Button>
          <Button variant="text" onClick={handleSendOtp} disabled={isLoading} sx={{color: userTheme.accent}}>
            Resend OTP
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const signupFieldSx = {
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
  "& .MuiFormHelperText-root": {color: userTheme.textMuted},
};

const signupPrimaryButtonSx = {
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

export default SignUpForm;

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
import {colorPalette} from "../constants/color.constant.js";
import axios from "axios";
import toast from "react-hot-toast";
import {server} from "../constants/config.constant.js";
import {useDispatch} from "react-redux";
import {userExists} from "../redux/reducers/authSlice.js";
import {capitalizeFirstLetter} from "../utils/helper.js";
import {GoogleLogin} from "@react-oauth/google";

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

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Google signup state
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState("");
  const [googleEmailLocked, setGoogleEmailLocked] = useState(false);

  const today = new Date();
  const elevenYearsAgo = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
  const maxDate = `${elevenYearsAgo.getFullYear()}-${String(elevenYearsAgo.getMonth() + 1).padStart(2, '0')}-${String(elevenYearsAgo.getDate()).padStart(2, '0')}`;

  // Google signup: verify with backend, prefill form
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

      // Simulate change events to pre-fill via the hooks
      const fakeEvent = (val: string) => ({target: {value: val}} as any);
      firstName.changeHandler(fakeEvent(first));
      lastName.changeHandler(fakeEvent(last));
      email.changeHandler(fakeEvent(gEmail));

      setIsGoogleSignup(true);
      setGoogleAvatarUrl(picture || "");
      setGoogleEmailLocked(true);

      toast("Please complete your profile below!", {icon: "👇"});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Google verification failed!");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Send signup OTP
  const handleSendOtp = async () => {
    if (!email.value) return toast.error("Please enter your email first.");
    setIsLoading(true);
    try {
      await axios.post(`${server}/api/v1/user/send-signup-otp`, {email: email.value});
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setShowOtpModal(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Full submit handler — handles both OTP (manual) and Google Signup paths
  const handleSubmitSignUp = async (event: any) => {
    event.preventDefault();

    const fields = [firstName, lastName, username, email, password, dob];
    if (fields.some(field => !field.value)) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!isGoogleSignup) {
      // Must send OTP first, then open modal
      if (!otpSent) {
        await handleSendOtp();
        return;
      }
      // If OTP modal is not yet submitted, show it again
      setShowOtpModal(true);
      return;
    }

    // Google Signup path: submit directly
    await submitRegistration(undefined, true);
  };

  const submitRegistration = async (verifiedOtp?: string, googlePath = false) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (avatar.file) {
        formData.append("avatar", avatar.file);
      }
      formData.append("name", `${capitalizeFirstLetter(firstName.value)} ${capitalizeFirstLetter(lastName.value)}`);
      formData.append("username", username.value);
      formData.append("email", email.value.toLowerCase());
      formData.append("password", password.value);
      formData.append("dob", dob.value);
      formData.append("bio", bio.value);

      if (googlePath) {
        formData.append("isGoogleSignup", "true");
        if (googleAvatarUrl && !avatar.file) {
          formData.append("googleAvatarUrl", googleAvatarUrl);
        }
      } else {
        formData.append("otp", verifiedOtp || otp);
      }

      const {data} = await axios.post(`${server}/api/v1/user/new-login`, formData, {
        withCredentials: true,
        headers: {"Content-Type": "multipart/form-data"},
      });
      dispatch(userExists(data.user));
      toast.success(data.message);
      navigate("/", {replace: true});
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      console.error("Signup error:", error?.response?.data);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) return toast.error("Please enter a valid 6-digit OTP.");
    setShowOtpModal(false);
    await submitRegistration(otp, false);
  };

  const goToLogin = () => navigate("/login");

  return (
    <div style={{backgroundImage: `radial-gradient(circle, rgba(0,212,255,1) 35%, rgba(62,125,143,0.6167717086834734) 100%)`, height: "100%"}}>
      <Container component={"main"} maxWidth="xs" sx={{display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "2rem"}}>
        <Typography variant="h1" marginBottom={"3rem"} marginTop={"2rem"} color={colorPalette(1).CP2}>NoviConnect</Typography>
        <Paper
          style={{backgroundImage: "linear-gradient(rgba(204, 204, 255, 0.5), rgba(0,0,0,0))"}}
          elevation={3}
          sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, marginBottom: '2rem', width: '100%'}}
        >

          {/* Google Signup */}
          {!isGoogleSignup && (
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2}}>
              <Typography variant="body2" color="text.secondary">Sign up quickly with Google</Typography>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => toast.error("Google Signup Failed")}
                text="signup_with"
              />
              <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>— or fill out the form —</Typography>
            </Box>
          )}

          {isGoogleSignup && (
            <Typography variant="body2" color="success.main" textAlign="center" sx={{mb: 2, fontWeight: 600}}>
              ✅ Google Verified! Complete your profile below.
            </Typography>
          )}

          <form onSubmit={handleSubmitSignUp} style={{width: '100%'}}>
            {/* Avatar */}
            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
              <Avatar
                sx={{width: "10rem", height: "10rem", objectFit: 'contain'}}
                src={avatar.preview || googleAvatarUrl}
              />
              {avatar.error && (
                <Typography m={"1rem"} color="error" variant="caption">{avatar.error}</Typography>
              )}
              <IconButton
                sx={{
                  position: 'absolute', right: 0, bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  ":hover": {backgroundColor: "rgba(0, 0, 0, 0.3)"},
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

            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextField size="small" sx={{marginRight: "1rem"}} fullWidth required label={"First Name"}
                         type={"text"} margin={"normal"} variant={"outlined"}
                         value={firstName.value} onChange={firstName.changeHandler}/>
              <TextField size="small" fullWidth required label={"Surname"} type={"text"} margin={"normal"}
                         variant={"outlined"}
                         value={lastName.value} onChange={lastName.changeHandler}/>
            </Box>

            <TextField size="small" fullWidth required label={"Username"} type={"text"} margin={"normal"}
                       variant={"outlined"} value={username.value} onChange={username.changeHandler}/>
            {username.error && <Typography color="error" variant="caption">{username.error}</Typography>}

            <TextField size="small" fullWidth required label={"Email"} type={"email"} margin={"normal"}
                       variant={"outlined"} value={email.value} onChange={email.changeHandler}
                       disabled={googleEmailLocked}
                       helperText={googleEmailLocked ? "Email verified by Google" : ""}/>

            <TextField size="small" fullWidth required label={"Date of Birth"} type={"date"}
                       margin={"normal"} variant={"outlined"} value={dob.value} onChange={dob.changeHandler}
                       InputLabelProps={{shrink: true}}
                       inputProps={{max: maxDate}}
            />

            <TextField size="small" fullWidth required label={"Password"} type={"password"}
                       margin={"normal"} variant={"outlined"}
                       value={password.value} onChange={password.changeHandler}/>
            {password.error && <Typography color="error" variant="caption">{password.error}</Typography>}

            <TextField
              size="small" fullWidth label={"Bio"} type={"text"}
              margin={"normal"} variant={"outlined"}
              value={bio.value} onChange={bio.changeHandler}
              multiline required={true} rows={3}
            />

            {/* For Google signup, single submit button */}
            {isGoogleSignup && (
              <Button sx={{marginTop: "1rem"}} variant={"contained"} color={"primary"}
                      type={"submit"} fullWidth={true} disabled={isLoading}>
                Create Account
              </Button>
            )}

            {/* For standard signup: separate OTP button + modal handles the rest */}
            {!isGoogleSignup && !otpSent && (
              <Button
                sx={{marginTop: "1rem"}} variant={"contained"} color={"primary"}
                type={"button"} fullWidth={true} disabled={isLoading}
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
                sx={{marginTop: "1rem"}} variant={"outlined"} color={"primary"}
                type={"button"} fullWidth={true} disabled={isLoading}
                onClick={() => setShowOtpModal(true)}
              >
                Enter OTP to Complete Signup
              </Button>
            )}
          </form>

          <Typography textAlign="center" marginTop={"1rem"}>Already have an account?</Typography>
          <Button variant={"text"} onClick={goToLogin} fullWidth={true} disabled={isLoading}>
            Sign In
          </Button>
        </Paper>
      </Container>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, minWidth: 300, paddingTop: "12px !important"}}>
          <Typography variant="body2">
            We sent a 6-digit code to <strong>{email.value}</strong>. Enter it below to verify your email and create your account.
          </Typography>
          <TextField
            label="6-digit OTP" type="text" fullWidth
            value={otp} onChange={(e) => setOtp(e.target.value)}
            inputProps={{maxLength: 6}}
          />
          <Button variant="contained" onClick={handleOtpSubmit} disabled={isLoading} fullWidth>
            Verify & Create Account
          </Button>
          <Button variant="text" onClick={handleSendOtp} disabled={isLoading}>
            Resend OTP
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUpForm;
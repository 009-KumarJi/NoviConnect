import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import AppLayout from "../components/layout/AppLayout.jsx";
import {userTheme} from "../constants/userTheme.constant.js";
import {useDispatch, useSelector} from "react-redux";
import {server} from "../constants/config.constant.js";
import axios from "axios";
import toast from "react-hot-toast";
import {userDoesNotExist, userExists} from "../redux/reducers/authSlice.js";
import {resetStore} from "../redux/resetActions.js";
import apiSlice from "../redux/api/apiSlice.js";
import {useNavigate} from "react-router-dom";
import {
  clearEncryptionIdentity,
  clearPendingRecoveryKey,
  getPendingRecoveryKey,
  regenerateRecoveryKey,
  restoreEncryptionWithRecoveryKey,
  rewrapEncryptionBundle
} from "../lib/e2ee";

const Settings = () => {
  const {user} = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    dob: "",
  });
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({currentPassword: "", newPassword: ""});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [pendingRecoveryKey, setPendingRecoveryKey] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
    });
    setEmail(user.email || "");
    setAvatarPreview(user.avatar?.url || "");
    setPendingRecoveryKey(getPendingRecoveryKey() || "");
  }, [user]);

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("username", profile.username);
      formData.append("bio", profile.bio);
      formData.append("dob", profile.dob);
      if (avatarFile) formData.append("avatar", avatarFile);

      const {data} = await axios.put(`${server}/api/v1/user/profile`, formData, {
        withCredentials: true,
        headers: {"Content-Type": "multipart/form-data"},
      });
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.patch(`${server}/api/v1/user/email`, {email}, {withCredentials: true});
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Email update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.patch(`${server}/api/v1/user/password`, passwords, {withCredentials: true});
      await rewrapEncryptionBundle({
        userId: user?._id,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        server,
      });
      setPasswords({currentPassword: "", newPassword: ""});
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Password update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete your account permanently?")) return;
    setIsLoading(true);
    try {
      const {data} = await axios.delete(`${server}/api/v1/user/delete-account`, {withCredentials: true});
      clearEncryptionIdentity(user?._id);
      dispatch(apiSlice.util.resetApiState());
      dispatch(resetStore());
      dispatch(userDoesNotExist());
      toast.success(data.message);
      navigate("/login", {replace: true});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Account deletion failed");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreWithRecoveryKey = async () => {
    setIsLoading(true);
    try {
      await restoreEncryptionWithRecoveryKey({
        userId: user?._id,
        recoveryKey,
        password: recoveryPassword,
        server,
      });
      toast.success("Secure history restored on this device.");
      setRecoveryKey("");
      setRecoveryPassword("");
    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.message || "Recovery key restore failed");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateKey = async () => {
    if (!recoveryPassword) {
      toast.error("Enter your current password to regenerate a recovery key.");
      return;
    }

    setIsLoading(true);
    try {
      const nextRecoveryKey = await regenerateRecoveryKey({
        userId: user?._id,
        password: recoveryPassword,
        server,
      });
      setPendingRecoveryKey(nextRecoveryKey);
      toast.success("A new recovery key has been generated. Save it now.");
    } catch (error: any) {
      toast.error(error?.message || "Recovery key regeneration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetEncryptionState = async () => {
    if (!window.confirm("Reset secure messaging and lose access to older encrypted history on new devices?")) return;

    setIsLoading(true);
    try {
      const {data} = await axios.delete(`${server}/api/v1/user/encryption-state`, {withCredentials: true});
      clearEncryptionIdentity(user?._id);
      clearPendingRecoveryKey();
      setPendingRecoveryKey("");
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Secure messaging reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{minHeight: "100%", background: userTheme.gradient, py: 3}}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Paper sx={settingsCardSx}>
            <Typography variant="overline" sx={{letterSpacing: "0.24rem", color: userTheme.accent}}>
              Settings
            </Typography>
            <Typography variant="h3" sx={{fontWeight: 700, color: userTheme.text, mb: 3}}>
              Manage your profile
            </Typography>
            <Stack direction={{xs: "column", md: "row"}} spacing={3} alignItems={{xs: "flex-start", md: "center"}}>
              <Stack spacing={1} alignItems="center">
                <Avatar src={avatarPreview} sx={{width: 112, height: 112, border: `3px solid ${userTheme.borderStrong}`}} />
                <Button component="label" sx={{color: userTheme.accent}}>
                  Change Avatar
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAvatarFile(file);
                      if (file) setAvatarPreview(URL.createObjectURL(file));
                    }}
                  />
                </Button>
              </Stack>
              <Stack spacing={2} flex={1}>
                <TextField label="Name" value={profile.name} onChange={(e) => setProfile((prev) => ({...prev, name: e.target.value}))} sx={settingsFieldSx} />
                <TextField label="Username" value={profile.username} onChange={(e) => setProfile((prev) => ({...prev, username: e.target.value}))} sx={settingsFieldSx} />
                <TextField label="Date of Birth" type="date" value={profile.dob} onChange={(e) => setProfile((prev) => ({...prev, dob: e.target.value}))} InputLabelProps={{shrink: true}} sx={settingsFieldSx} />
                <TextField label="Bio" multiline rows={4} value={profile.bio} onChange={(e) => setProfile((prev) => ({...prev, bio: e.target.value}))} sx={settingsFieldSx} />
                <Button onClick={updateProfile} disabled={isLoading} sx={settingsButtonSx}>Save Profile</Button>
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={settingsCardSx}>
            <Typography variant="h5" sx={{fontWeight: 700, color: userTheme.text, mb: 2}}>Change Email</Typography>
            <Stack direction={{xs: "column", md: "row"}} spacing={2}>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={settingsFieldSx} />
              <Button onClick={updateEmail} disabled={isLoading} sx={settingsButtonSx}>Update Email</Button>
            </Stack>
          </Paper>

          <Paper sx={settingsCardSx}>
            <Typography variant="h5" sx={{fontWeight: 700, color: userTheme.text, mb: 2}}>Change Password</Typography>
            <Stack spacing={2}>
              <Typography sx={{color: userTheme.textMuted}}>
                Changing your password here preserves secure-message access by rewrapping your encrypted recovery bundle.
              </Typography>
              <TextField label="Current Password" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((prev) => ({...prev, currentPassword: e.target.value}))} sx={settingsFieldSx} />
              <TextField label="New Password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords((prev) => ({...prev, newPassword: e.target.value}))} sx={settingsFieldSx} />
              <Button onClick={updatePassword} disabled={isLoading} sx={settingsButtonSx}>Update Password</Button>
            </Stack>
          </Paper>

          <Paper sx={settingsCardSx}>
            <Typography variant="h5" sx={{fontWeight: 700, color: userTheme.text, mb: 2}}>Encryption Status</Typography>
            <Stack spacing={1.2}>
              <Typography sx={{color: userTheme.text}}>
                {user?.encryptionPublicKey
                  ? "Secure messaging is active for this account."
                  : "Secure messaging has not been initialized on this account yet."}
              </Typography>
              <Typography sx={{color: userTheme.textMuted}}>
                Password changes from this page preserve encrypted-chat recovery. OTP password reset from the recovery page resets the server-side recovery bundle.
              </Typography>
              {pendingRecoveryKey && (
                <Box sx={{p: 1.5, borderRadius: "1rem", backgroundColor: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)"}}>
                  <Typography sx={{color: userTheme.text, fontWeight: 700, mb: 0.5}}>Save this recovery key</Typography>
                  <Typography sx={{color: "#86efac", fontFamily: "monospace", letterSpacing: "0.08rem", wordBreak: "break-word"}}>
                    {pendingRecoveryKey}
                  </Typography>
                  <Button sx={{mt: 1, ...settingsButtonSx}} onClick={() => {
                    clearPendingRecoveryKey();
                    setPendingRecoveryKey("");
                  }}>
                    I Saved It
                  </Button>
                </Box>
              )}
              <TextField label="Recovery Key" value={recoveryKey} onChange={(e) => setRecoveryKey(e.target.value.toUpperCase())} sx={settingsFieldSx} />
              <TextField label="Current Account Password" type="password" value={recoveryPassword} onChange={(e) => setRecoveryPassword(e.target.value)} sx={settingsFieldSx} />
              <Stack direction={{xs: "column", md: "row"}} spacing={1.5}>
                <Button onClick={restoreWithRecoveryKey} disabled={isLoading} sx={settingsButtonSx}>Restore with Recovery Key</Button>
                <Button onClick={regenerateKey} disabled={isLoading} sx={{...settingsButtonSx, background: "rgba(56, 189, 248, 0.16)", color: userTheme.accentBlue, border: `1px solid ${userTheme.borderStrong}`}}>
                  Regenerate Recovery Key
                </Button>
              </Stack>
              <Button onClick={resetEncryptionState} disabled={isLoading} sx={{...settingsButtonSx, background: "rgba(251, 113, 133, 0.18)", color: userTheme.danger, border: "1px solid rgba(251, 113, 133, 0.3)"}}>
                Reset Secure Messaging
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{...settingsCardSx, borderColor: "rgba(251, 113, 133, 0.3)"}}>
            <Typography variant="h5" sx={{fontWeight: 700, color: userTheme.text, mb: 1}}>Danger Zone</Typography>
            <Typography sx={{color: userTheme.textMuted, mb: 2}}>
              Deleting your account removes your access permanently.
            </Typography>
            <Button onClick={deleteAccount} disabled={isLoading} sx={{...settingsButtonSx, background: "rgba(251, 113, 133, 0.18)", color: userTheme.danger, border: "1px solid rgba(251, 113, 133, 0.3)"}}>
              Delete Account
            </Button>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

const settingsCardSx = {
  p: {xs: 2.5, md: 3},
  borderRadius: "1.5rem",
  background: "linear-gradient(180deg, rgba(16, 27, 44, 0.96) 0%, rgba(10, 18, 30, 0.96) 100%)",
  border: `1px solid ${userTheme.border}`,
  boxShadow: userTheme.shadow,
};

const settingsFieldSx = {
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

const settingsButtonSx = {
  alignSelf: "flex-start",
  borderRadius: "999px",
  px: 2.5,
  py: 1.2,
  fontWeight: 700,
  background: "linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)",
  color: "#041019",
};

export default AppLayout()(Settings);

import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyGoogleSignup,
  sendSignupOTP
} from "../controllers/user.controller.js";
import {singleAvatar} from "../middlewares/multer.middleware.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler
} from "../utils/validators.js";
import {confirmFileExists} from "../middlewares/fileExists.middleware.js";


// Prefix Route for this file: 'http://localhost:3000/user/
const app = express.Router(); // `express.Router()` creates a modular, mountable route handler for Express applications.



app.post("/new-login", singleAvatar, registerValidator(), validateHandler, confirmFileExists, newUser);
app.post("/login", loginValidator(), validateHandler, login);
app.post("/google-signup-verify", verifyGoogleSignup);
app.post("/send-signup-otp", sendSignupOTP);
app.post("/forgot-password", forgotPassword);
app.post("/verify-otp", verifyOTP);
app.patch("/reset-password", resetPassword);

// After here, user must be authenticated to access the routes
app.use(isAuthenticated); // This middleware mandates login before accessing routes below.

app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/send-request", sendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/accept-request", acceptRequestValidator(), validateHandler, acceptFriendRequest);
app.get("/notifications", getMyNotifications);
app.get("/get-friends", getMyFriends);

export default app;

// Path: server/routes/user.routes.js
import express from "express";
import {getMyProfile, login, logout, newUser} from "../controllers/user.controller.js";
import {singleAvatar} from "../middlewares/multer.middleware.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";

const app = express.Router(); // `express.Router()` creates a modular, mountable route handler for Express applications.

//Route for this file: https://localhost:3000/users/

app.post("/new-login", singleAvatar, newUser);
app.post("/login", login);

// After here, user must be authenticated to access the routes
app.use(isAuthenticated); // This middleware mandates login before accessing routes below.

app.get("/profile", getMyProfile);
app.get("/logout", logout);

export default app;
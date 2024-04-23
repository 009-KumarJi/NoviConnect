import express from "express";
import {getMyProfile, login, logout, newUser, searchUser} from "../controllers/user.controller.js";
import {singleAvatar} from "../middlewares/multer.middleware.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {loginValidator, registerValidator, validateHandler} from "../utils/validators.js";


// Prefix Route for this file: 'https://localhost:3000/user/
const app = express.Router(); // `express.Router()` creates a modular, mountable route handler for Express applications.

app.post("/new-login", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// After here, user must be authenticated to access the routes
app.use(isAuthenticated); // This middleware mandates login before accessing routes below.

app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;

// Path: server/routes/user.routes.js
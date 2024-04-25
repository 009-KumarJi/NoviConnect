import express from "express";
import {
  adminLogin,
  adminLogout, getAdminData,
  getAllChats,
  getAllMessages,
  getAllUsers,
  getDashboardStatistics
} from "../controllers/admin.controller.js";
import {adminLoginValidator, validateHandler} from "../utils/validators.js";
import {areYouAdmin} from "../middlewares/auth.middleware.js";

// Prefix Route for this file: 'http://localhost:3000/krishna-den/
const app = express.Router();

app.use((req, res, next) => {
  console.log(`Admin Route: ${req.originalUrl}`);
  next();
});


app.post("/verify",adminLoginValidator(), validateHandler, adminLogin);
app.get("/logout", adminLogout);

// Protected Routes --> Accessible only to Admin
app.use(areYouAdmin);

app.get("/", getAdminData);
app.get("/users", getAllUsers);
app.get("/chats", getAllChats);
app.get("/messages", getAllMessages);

app.get("/statistics", getDashboardStatistics);

export default app;
// Path: server/routes/admin.routes.js
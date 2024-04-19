import express from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {newGroupChat} from "../controllers/chat.controller.js";

//Route for this file: https://localhost:3000/chat/
const app = express.Router();

// This middleware mandates login before accessing other routes.
app.use(isAuthenticated);

app.post("/new-group", newGroupChat);

export default app;
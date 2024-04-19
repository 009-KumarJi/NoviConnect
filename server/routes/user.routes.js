import express from "express";
import {login, newUser} from "../controllers/user.controller.js";

const app = express.Router();

//localhost:3000/users/

app.post("/new-login", newUser)
app.post("/login", login)

export default app;
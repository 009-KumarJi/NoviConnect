import express from "express";
import {login} from "../controllers/user.controller.js";

const app = express.Router();

//localhost:3000/users/

app.get("/login", login)

export default app;
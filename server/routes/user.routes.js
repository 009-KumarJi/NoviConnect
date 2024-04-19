import express from "express";
import {login, newUser} from "../controllers/user.controller.js";
import {singleAvatar} from "../middlewares/multer.middleware.js";

const app = express.Router();

//localhost:3000/users/

app.post("/new-login", singleAvatar, newUser)
app.post("/login", login)

export default app;
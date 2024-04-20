import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import {connectDB} from "./utils/features.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import {createUsers} from "./seeders/user.seeder.js";
import {createGroupChats, createMessagesInChat, createSingleChats} from "./seeders/chat.seeder.js";

dotenv.config({path: "./.env"});

const app = express();
const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

// Seeders
// createUsers(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInChat("6623db915726efaced082f10", 50);

// Using middlewares here
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies attached to the client request

// User routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(errorMiddleware);

// Path: server/server.js
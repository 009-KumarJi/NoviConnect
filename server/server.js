import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import {v4 as uuid} from "uuid";
import {Server} from "socket.io";
import {createServer} from "http";
import {v2 as cloudinary} from "cloudinary";

import {connectDB} from "./utils/features.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import {NEW_MESSAGE, NEW_MESSAGE_ALERT} from "./constants/events.constant.js";
import {getSockets} from "./lib/socketio.helper.js";
import {Message} from "./models/message.model.js";
import {sout} from "./utils/utility.js";

dotenv.config({path: "./.env"});

const app = express();
const server = createServer(app);
const io = new Server(server, {});
const activeUserSocketIds = new Map();

const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminKey = process.env.ADMIN_SECRET_KEY;

connectDB(process.env.MONGO_URI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Using middlewares here
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies attached to the client request
app.use(cors({
  origin: [process.env.CLIENT_URLS.split(',')], // Allow the client to make requests to this server
  credentials: true // Allow the session cookie to be sent to and from the client
}));

sout("client point: ", process.env.CLIENT_URLS.split(',')[0]);

app.use((req, res, next) => {
  sout(`Route being hit: ${req.method} ${req.path}`);
  next();
});

// User routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/krishna-den", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) =>{});

io.on("connection", (socket) => {
  sout(`socketId: ${socket.id} connected!`);
  const user = {
    _id: "1234567890",
    name: "Krishna"
  };
  socket.on(NEW_MESSAGE, async ({ChatId, members, message}) => {


    activeUserSocketIds.set(user._id.toString(), socket.id);

    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name
      },
      chat: ChatId,
      createdAt: new Date().toString()
    }
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: ChatId
    }
    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(NEW_MESSAGE, {ChatId, message: messageForRealTime, mem: membersSockets});
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, {ChatId});
    // TODO: Implement Room Building then send data to that room
    /*const roomId = await createRoom(membersSockets, ChatId, io);
    io.to(roomId).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chat: ChatId
    });
    console.log(`Message sent to room: ${roomId}`);
    io.to(roomId).emit(NEW_MESSAGE_ALERT, {ChatId})*/

    try{
      await Message.create(messageForDB);
    } catch (e) {
      console.log(e);
    }
  })

  socket.on("disconnect", () => {
    activeUserSocketIds.delete(user._id);
    sout(`socketId: ${socket.id} disconnected!`);
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} mode.`);
});


export {envMode, adminKey, activeUserSocketIds};

// Path: server/server.js

/******************************/
/* Seeders */
// createUsers(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInChat("6623db915726efaced082f10", 50);
/******************************/

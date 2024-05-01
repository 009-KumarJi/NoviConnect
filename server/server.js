import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import {connectDB} from "./utils/features.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import {Server} from "socket.io";
import {createServer} from "http";
import {NEW_MESSAGE, NEW_MESSAGE_ALERT} from "./constants/events.constant.js";
import {v4 as uuid} from "uuid";
import {getSockets} from "./lib/socketio.helper.js";
import {Message} from "./models/message.model.js";

dotenv.config({path: "./.env"});

const app = express();
const server = createServer(app);
const io = new Server(server, {});
const activeUserSocketIds = new Map();

const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminKey = process.env.ADMIN_SECRET_KEY;

connectDB(process.env.MONGO_URI);

// Using middlewares here
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies attached to the client request

// User routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/krishna-den", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) =>{});

io.on("connection", (socket) => {
  console.log(`socketId: ${socket.id} connected!`);
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
    console.log(`socketId: ${socket.id} disconnected!`);
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

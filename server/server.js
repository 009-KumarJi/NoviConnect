import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import {v4 as uuid} from "uuid";
import {Server} from "socket.io";
import {createServer} from "http";

import {connectDB} from "./utils/features.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import {
  CHAT_JOINED,
  CHAT_LEFT,
  ONLINE_USERS_LIST,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT, ONLINE_USERS,
  START_TYPING,
  STOP_TYPING
} from "./constants/events.constant.js";
import {getSockets} from "./lib/socketio.helper.js";
import {Message} from "./models/message.model.js";
import {sout} from "./utils/utility.js";
import {corsOptions} from "./constants/config.constant.js";
import {socketAuthenticator} from "./middlewares/auth.middleware.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config({path: "./.env"});

const activeUserSocketIds = new Map();
const onlineUsers = new Set();
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminKey = process.env.ADMIN_SECRET_KEY;

connectDB(process.env.MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: corsOptions});
const port = process.env.PORT || 3000;

app.set("io", io);


// Using middlewares here
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies attached to the client request
app.use(cors(corsOptions));

sout("client point: ", process.env.CLIENT_URLS.split(","));
app.use((req, res, next) => {
  sout(`Route being hit: ${req.method} ${req.path}`);
  next();
});

// User routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/admin/api/krishna-den", adminRoutes);

app.get("/", (req, res) => {
  res.send("Kahan aa gaya bhai tu! frontend pe jaa na! idhar kya kar rha hai?");
});

io.use((socket, next) =>{
  sout("Socket url: ", socket.request.url);
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {

  const user = socket['user'];
  activeUserSocketIds.set(user._id.toString(), socket.id);
  socket.broadcast.emit(ONLINE_USERS_LIST, Array.from(activeUserSocketIds.keys()));

  sout(`socketId: ${socket.id} connected!`);
  sout(`User: ${user.name} connected!`);

  socket.on(NEW_MESSAGE, async ({ChatId, members, message}) => {

    sout("New message received: ", message);
    sout("ChatId: ", ChatId);
    sout("Members: ", members);

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
    try{
      await Message.create(messageForDB);
    } catch (e) {
      console.log(e);
    }

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(NEW_MESSAGE, {
      ChatId,
      message: messageForRealTime
    });
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, {ChatId});

    sout(`Message sent to sockets: ${membersSockets}`)

    // TODO: Implement Room Building then send data to that room
    /*const roomId = await createRoom(membersSockets, ChatId, io);
    io.to(roomId).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chat: ChatId
    });
    console.log(`Message sent to room: ${roomId}`);
    io.to(roomId).emit(NEW_MESSAGE_ALERT, {ChatId})*/
  })

  socket.on(START_TYPING, ({ChatId, members}) => {
    sout("User is typing...");
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, {ChatId});
  })

  socket.on(STOP_TYPING, ({ChatId, members}) => {
    sout("User stopped typing...");
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, {ChatId});
  })

  socket.on(CHAT_JOINED, ({userId, members}) => {
    onlineUsers.add(userId.toString());
    io.to(getSockets(members)).emit(ONLINE_USERS, Array.from(activeUserSocketIds.keys()));
  });

  socket.on(CHAT_LEFT, ({userId, members}) => {
    onlineUsers.delete(userId.toString());
    io.to(getSockets(members)).emit(ONLINE_USERS, Array.from(activeUserSocketIds.keys()));
  });

  socket.on("disconnect", () => {
    activeUserSocketIds.delete(user._id);
    onlineUsers.delete(user._id);
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

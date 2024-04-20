import express from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroupChat,
  sendAttachments
} from "../controllers/chat.controller.js";
import {attachmentMulter} from "../middlewares/multer.middleware.js";

//Route for this file: https://localhost:3000/chat/
const app = express.Router();

// This middleware mandates login before accessing other routes.
app.use(isAuthenticated);

app.post("/new-group", newGroupChat);
app.get("/my-chats", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addMembers", addMembers);
app.put("/removeMember", removeMember);

// TODO: 1. Send Attachments 2. Get Messages 3. Get Chat Details 4. Rename Chat 5. Delete Chat

app.delete("/leave/:ChatId", leaveGroupChat);
app.post("/message", attachmentMulter, sendAttachments);


export default app;
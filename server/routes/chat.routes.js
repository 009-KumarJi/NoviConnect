import express from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroupChat,
  newGroupChat,
  removeMember,
  renameGroupChat,
  sendAttachments
} from "../controllers/chat.controller.js";
import {attachmentMulter} from "../middlewares/multer.middleware.js";
import {
  addMembersValidator,
  chatIdValidator,
  newGroupChatValidator,
  removeMemberValidator, renameGroupValidator,
  sendAttachmentsValidator,
  validateHandler
} from "../utils/validators.js";

//Prefix Route for this file: http://localhost:3000/chat/
const app = express.Router();

// This middleware mandates login before accessing other routes.
app.use(isAuthenticated);

// Chat routes
app.post("/new-group", newGroupChatValidator(), validateHandler, newGroupChat);
app.get("/my-chats", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addMembers", addMembersValidator(), validateHandler, addMembers);
app.put("/removeMember", removeMemberValidator(), validateHandler, removeMember);

app.delete("/leave/:ChatId", chatIdValidator(), validateHandler, leaveGroupChat);

app.post("/message", attachmentMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);
app.get("/message/:ChatId", chatIdValidator(), validateHandler, getMessages);

app.route("/:ChatId")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroupChat)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export default app;

// Path: server/routes/chat.routes.js
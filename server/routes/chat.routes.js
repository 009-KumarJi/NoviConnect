import express from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroupChat,
  sendAttachments, getChatDetails, renameGroupChat, deleteChat, getMessages
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

app.delete("/leave/:ChatId", leaveGroupChat);

app.post("/message", attachmentMulter, sendAttachments);
app.get("/message/:ChatId", getMessages);


app.route("/:ChatId")
  .get(getChatDetails)
  .put(renameGroupChat)
  .delete(deleteChat);





export default app;
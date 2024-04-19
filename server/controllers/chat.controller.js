import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";
import {emmitEvent} from "../utils/features.js";
import {ALERT, REFETCH_CHATS} from "../constants/events.constant.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const {name, members} = req.body;
  if (members.includes(req.userId)) return next(new ErrorHandler("You are already a member", 422));
  if (members.length < 2) return next(new ErrorHandler("Please provide at least 3 members", 422));
  const allMembers = [...members, req.userId];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.userId,
    members: allMembers,
  });

  emmitEvent(req, ALERT, allMembers, `Welcome to group chat, ${name}`);
  emmitEvent(req, REFETCH_CHATS, members);

  res.status(201).json({
    success: true,
    message: "Group chat created successfully",
  });
});

export { newGroupChat };
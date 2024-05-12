import {TryCatch} from "../middlewares/error.middleware.js";
import {User} from "../models/user.model.js";
import {Chat} from "../models/chat.model.js";
import {Message} from "../models/message.model.js";
import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";
import {cookieOptions} from "../utils/features.js";
import {adminKey} from "../server.js";
import {NC_TOKEN} from "../constants/config.constant.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const {secret_key} = req.body;
  if (secret_key !== adminKey) return next(new ErrorHandler("Get Out! You're not authorized to access this route.", 401))

  const token = jwt.sign(secret_key, process.env.JWT_SECRET);

  return res.status(200)
    .clearCookie(NC_TOKEN, "", {...cookieOptions, maxAge: 0})
    .cookie("krishna-hero", token, {...cookieOptions, maxAge: 1000 * 60 * 15})
    .json({
      success: true,
      message: "~Hare Krishna~!",
    });
});
const adminLogout = TryCatch(async (req, res) => {
  return res.status(200)
    .clearCookie("krishna-hero", "", {...cookieOptions, maxAge: 0})
    .json({
      success: true,
      message: "B-Byes! Hare Krishna!",
    });
});
const getAdminData = TryCatch(async (req, res) => {
  return res.status(200).json({
    admin: true,
    message: "Hare Krishna! Welcome Admin!",
  });
});
const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(users.map(async (user) => {
    const [groupsCount, friends] = await Promise.all([
      Chat.countDocuments({members: user._id, groupChat: true}),
      Chat.countDocuments({members: user._id, groupChat: false}),
    ])
    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar.url,
      groupsCount,
      friends,
    }
  }));


  res.status(200).json({
    success: true,
    transformedUsers,
  });
});
const getAllChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");


  const transformedChats = await Promise.all(chats.map(async ({members, _id, groupChat, name, creator}) => {

    const totalMessages = await Message.countDocuments({chat: _id});

    return {
      _id,
      name,
      groupChat,
      creator: {
        _id: creator?._id || "---",
        name: creator?.name || "None",
        avatar: creator?.avatar.url || "---",
      },
      members: members.map(({_id, name, avatar}) => ({
        _id,
        name,
        avatar: avatar.url,
      })),
      avatar: members.slice(0, 3).map(({avatar}) => avatar.url),
      totalMembers: members.length,
      totalMessages,
    };
  }));


  return res.status(200).json({
    success: true,
    transformedChats,
  });
});
const getAllMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "name groupChat");

  const transformedMessages = messages.map(({_id, chat, sender, content, createdAt, attachments}) => ({
    _id,
    attachments,
    content,
    createdAt,
    chat: chat._id,
    groupChat: chat.groupChat,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));


  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});
const getDashboardStatistics = TryCatch(async (req, res) => {

  const [usersCount, groupsCount, totalChatsCount, messagesCount] = await Promise.all([
    User.countDocuments({}),
    Chat.countDocuments({groupChat: true}),
    Chat.countDocuments({}),
    Message.countDocuments({}),
  ]);

  const today = new Date();

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const lastWeekMessages = await Message.find({createdAt: {$gte: lastWeek, $lt: today}}).select("createdAt");

  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const messagesPerDay = new Array(7).fill(0);
  messagesPerDay.forEach((message) => {
    const index = 6 - Math.floor((today.getTime() - message.createdAt.getTime()) / dayInMilliseconds);
    messagesPerDay[index]++;
  });

  const statistics = {
    usersCount,
    groupsCount,
    totalChatsCount,
    messagesCount,
    messageChart: messagesPerDay,
  };


  return res.status(200).json({
    success: true,
    statistics,
  });
});

export {
  getAllUsers,
  getAllChats,
  getAllMessages,
  getDashboardStatistics,
  adminLogin,
  adminLogout,
  getAdminData,
};


import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";
import {emmitEvent} from "../utils/features.js";
import {ALERT, REFETCH_CHATS} from "../constants/events.constant.js";
import {getOtherMember} from "../lib/chat.helper.js";
import {User} from "../models/user.model.js";

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
const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat
    .find({members: req.userId})
    .populate("members", "name username avatar");

  const transformedChats = chats.map(({_id, name, members, groupChat}) => {
    const otherMember = getOtherMember(members, req.userId);
    return {
      _id,
      name: groupChat ? name : otherMember.name,
      groupChat,
      members: members.reduce((prev, curr) => (curr._id.toString() !== req.userId ? [...prev, curr._id] : prev), []),
      avatar: groupChat ? members.slice(0, 3).map(({avatar}) => avatar.url) : [otherMember.avatar.url],
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});
const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat
    .find({members: req.userId, groupChat: true})
    .populate("members", "name avatar");
  const groups = chats.map(({_id, name, members, groupChat}) => ({
    _id,
    name,
    groupChat,
    avatar: members.slice(0, 3).map(({avatar}) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});
const addMembers = TryCatch(async (req, res, next) => {
  const {members, ChatId} = req.body;

  if (!members || !members.length) return next(new ErrorHandler("Please provide members", 422));

  const chat = await Chat.findById(ChatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (chat.creator.toString() !== req.userId) return next(new ErrorHandler("You are not authorized to perform this action", 403));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 422));

  const allNewMembersPromise = members.map((member) => User.findById(member, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers.filter(member => !chat.members.includes(member._id)).map(({_id}) => _id);
  if (!uniqueMembers.length) return next(new ErrorHandler("All Selected Member(s) already added", 422));

  chat.members.push(...uniqueMembers);

  if (chat.members.length < 2) return next(new ErrorHandler("Please provide at least 3 members", 422));
  if (chat.members.length > 100) return next(new ErrorHandler("Group Chat members limit exceeded", 422));

  await chat.save();

  const allUsersName = allNewMembers.map(({name}) => name).join(", ");

  emmitEvent(req, ALERT, chat.members, `${allUsersName} added to the group chat`);
  emmitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});
const removeMember = TryCatch(async (req, res, next) => {
  const {UserId, ChatId} = req.body;

  const [chat, removedUser] = await Promise.all([
    Chat.findById(ChatId),
    User.findById(UserId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (chat.creator.toString() !== req.userId) return next(new ErrorHandler("You are not authorized to perform this action", 403));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 422));
  if (chat.members.length <= 3) return next(new ErrorHandler("Group chat must have at least 3 members", 422));

  chat.members = chat.members.filter(member => member.toString() !== UserId.toString());
  await chat.save();

  emmitEvent(req, ALERT, chat.members, `${removedUser.name} removed from the group chat`);
  emmitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});
const leaveGroupChat = TryCatch(async (req, res, next) => {
  const {ChatId} = req.params;

  const chat = await Chat.findById(ChatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 422));
  if (!chat.members.includes(req.userId)) return next(new ErrorHandler("You're already not a member of this group'", 422));

  const remainingMembers = chat.members.filter(member => member.toString() !== req.userId.toString());
  if (remainingMembers.length < 3) return next(new ErrorHandler("Group chat must have at least 3 members", 422));
  if (chat.creator.toString() === req.userId.toString()) {
    const randomMemberIndex = Math.floor(Math.random() * remainingMembers.length);
    chat.creator = remainingMembers[randomMemberIndex];
  }

  chat.members = remainingMembers;

  const [leftUser] = await Promise.all([User.findById(req.userId, "name"), chat.save()]);

  emmitEvent(req, ALERT, chat.members, `${leftUser.name} left the group chat`);

  return res.status(200).json({
    success: true,
    message: "You Left group chat successfully",
  });
});

export {newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroupChat};
import {User} from "../models/user.model.js";
import {cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary} from "../utils/features.js";
import {compare} from "bcrypt";
import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";
import {Request} from "../models/request.model.js";
import {NEW_REQUEST, REFETCH_CHATS} from "../constants/events.constant.js";
import {getOtherMember} from "../lib/chat.helper.js";

const newUser = TryCatch(async (req, res, next) => {

  const {name, username, password, bio, email, dob} = req.body;
  const file = req.file;

  const results = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: results[0].public_id,
    url: results[0].secure_url,
  }

  const user = await User.create({
    name,
    username,
    password,
    bio,
    email,
    dob,
    avatar
  });
  sendToken(res, user, 201, "User created successfully!");
});
const login = TryCatch(async (req, res, next) => {
  const {username, password} = req.body;

  const user = await User.findOne({username}).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials", 401));

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));

  sendToken(res, user, 200, `User Login Successful for ${user.name}!`);
});
const getMyProfile = TryCatch(async (req, res, next) => {

  const user = await User.findById(req.userId).select("-password");

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user,
  });
});
const logout = TryCatch(async (req, res) => {
  return res.status(200)
    .cookie("nc-token", "", {...cookieOptions, maxAge: 0})
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
const searchUser = TryCatch(async (req, res) => {
  const {name = ""} = req.query;
  const myChats = await Chat.find({
    groupChat: false,
    members: req.userId,
  });
  // Get all users from my chats including me and friends
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Get all users from my chats except me and friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: {$nin: allUsersFromMyChats},
    name: {$regex: name, $options: "i"},
  });

  // Modifying response to only include _id, name, and avatar
  const users = allUsersExceptMeAndFriends.map(({_id, name, avatar}) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});
const sendFriendRequest = TryCatch(async (req, res, next) => {
  const {ReceiverId} = req.body;

  const request = await Request.findOne({
    $or: [   // Check if request already exists. or operator is used to check both sender and receiver
      {sender: req.userId, receiver: ReceiverId},
      {sender: ReceiverId, receiver: req.userId},
    ]
  });
  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    receiver: ReceiverId,
    sender: req.userId,
    status: "pending"
  });

  emitEvent(ReceiverId, NEW_REQUEST, [ReceiverId]);

  return res.status(200).json({
    success: true,
    message: "Friend request sent successfully",
  });
});
const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const {requestId, status} = req.body;
  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));
  console.log(request.receiver.toString(), req.userId.toString());
  if (request.receiver._id.toString() !== req.userId.toString()) return next(new ErrorHandler("You're unauthorized to handle this request", 401));

  if (!status) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Request rejected! Aww, that's sad!",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: `You're now friends with ${request.sender.name}!`,
    senderId: request.sender._id,
  });
});
const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({
    receiver: req.userId,
    status: "pending",
  }).populate("sender", "name avatar");

  if (!requests) return res.status(200).json({
    success: true,
    allRequests: [],
  });

  //Transforming 'requests' to only include _id, name, and avatar
  const allRequests = requests.map(({_id, sender}) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    }
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});
const getMyFriends = TryCatch(async (req, res, next) => {
  const ChatId = req.query.ChatId;
  const chats = await Chat.find({
    groupChat: false,
    members: req.userId,
  }).populate("members", "name avatar");

  const friends = chats.map(({members}) => {
    const otherUser = getOtherMember(members, req.userId);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (ChatId) {
    const chat = await Chat.findById(ChatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    const availableFriends = friends.filter(({_id}) => !chat.members.includes(_id));
    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }

});

export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};

// Path: server/controllers/user.controller.js
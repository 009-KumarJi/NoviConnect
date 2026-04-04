// @ts-nocheck
import {redis} from "../utils/redis.js";
import {sendEmailOTP} from "../utils/mail.helper.js";
import {OAuth2Client} from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import {User} from "../models/user.model.js";
import {cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary} from "../utils/features.js";
import {compare} from "bcrypt";
import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler, sout} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";
import {Request} from "../models/request.model.js";
import {NEW_REQUEST, REFETCH_CHATS} from "../constants/events.constant.js";
import {getOtherMember} from "../lib/chat.helper.js";
import {NC_TOKEN} from "../constants/config.constant.js";

const newUser = TryCatch(async (req, res, next) => {
  const {name, username, password, bio, email, dob, otp, isGoogleSignup, googleAvatarUrl} = req.body;

  const existingUser = await User.findOne({email});
  if (existingUser) return next(new ErrorHandler("A user with this email already exists.", 400));

  if (isGoogleSignup) {
    const verified = await redis.get(`google_verified:${email}`);
    if (!verified) return next(new ErrorHandler("Google profile session expired. Please sign in with Google again.", 400));
    await redis.del(`google_verified:${email}`);
  } else {
    if (!otp) return next(new ErrorHandler("Please provide an OTP for signup", 400));
    const storedOtp = await redis.get(`signup_otp:${email}`);
    if (!storedOtp || storedOtp !== otp.toString()) {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
    await redis.del(`signup_otp:${email}`);
  }

  const file = req.file;
  let avatar = { public_id: "", url: "" };

  if (file) {
    const results = await uploadFilesToCloudinary([file]);
    if (!results) return next(new ErrorHandler("File upload failed", 500));
    avatar = { public_id: results[0].public_id, url: results[0].url };
  } else if (googleAvatarUrl) {
    avatar = { public_id: email.split('@')[0] || "google_pfp", url: googleAvatarUrl };
  } else {
    return next(new ErrorHandler("Please upload an avatar image", 400));
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
    .cookie(NC_TOKEN, "", {...cookieOptions, maxAge: 0})
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
    name: {$regex: name.replaceAll("+", " "), $options: "i"},
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

  emitEvent(req, NEW_REQUEST, [ReceiverId]);

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

const forgotPassword = TryCatch(async (req, res, next) => {
  const {email} = req.body;
  if (!email) return next(new ErrorHandler("Please provide an email", 400));
  
  const user = await User.findOne({email});
  if (!user) return next(new ErrorHandler("User not found", 404));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`otp:${email}`, 600, otp);
  
  const isSent = await sendEmailOTP(email, otp);
  if (!isSent) return next(new ErrorHandler("Could not send email", 500));
  
  return res.status(200).json({
    success: true,
    message: "OTP sent to your email successfully"
  });
});

const verifyOTP = TryCatch(async (req, res, next) => {
  const {email, otp} = req.body;
  if (!email || !otp) return next(new ErrorHandler("Provide email and OTP", 400));
  
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp || storedOtp !== otp.toString()) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }
  
  await redis.del(`otp:${email}`);
  
  const resetToken = Math.random().toString(36).slice(-8);
  await redis.setex(`reset_token:${email}`, 900, resetToken);
  
  return res.status(200).json({
    success: true,
    message: "OTP verified correctly",
    resetToken
  });
});

const resetPassword = TryCatch(async (req, res, next) => {
  const {email, resetToken, newPassword} = req.body;
  if (!email || !resetToken || !newPassword) return next(new ErrorHandler("Provide email, token and new password", 400));
  
  const storedToken = await redis.get(`reset_token:${email}`);
  if (!storedToken || storedToken !== resetToken) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }
  
  const user = await User.findOne({email}).select("+password");
  if (!user) return next(new ErrorHandler("User not found", 404));
  
  user.password = newPassword;
  await user.save();
  await redis.del(`reset_token:${email}`);
  
  return res.status(200).json({
    success: true,
    message: "Password reset successfully!"
  });
});

const verifyGoogleSignup = TryCatch(async (req, res, next) => {
  const {credential} = req.body;
  if (!credential) return next(new ErrorHandler("No credential provided", 400));
  
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  if (!payload) return next(new ErrorHandler("Invalid Google Token", 401));
  
  const {email, name, picture, sub} = payload;
  const existingUser = await User.findOne({email});
  if (existingUser) return next(new ErrorHandler("This email is already registered. Please login with your username and password.", 400));
  
  // Set google verified bypass token
  await redis.setex(`google_verified:${email}`, 900, "true");
  
  return res.status(200).json({
    success: true,
    message: "Google verification successful. Please complete your profile.",
    payload: { email, name, picture, sub }
  });
});

const sendSignupOTP = TryCatch(async (req, res, next) => {
  const {email} = req.body;
  if (!email) return next(new ErrorHandler("Please provide an email", 400));
  
  const user = await User.findOne({email});
  if (user) return next(new ErrorHandler("This email is already registered", 400));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`signup_otp:${email}`, 600, otp);
  
  const isSent = await sendEmailOTP(email, otp);
  if (!isSent) return next(new ErrorHandler("Could not send email", 500));
  
  return res.status(200).json({
    success: true,
    message: "Signup OTP sent successfully"
  });
});

export {
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyGoogleSignup,
  sendSignupOTP,
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
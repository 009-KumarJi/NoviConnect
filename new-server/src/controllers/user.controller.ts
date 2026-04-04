// @ts-nocheck
import {redis} from "../utils/redis.js";
import {sendEmailOTP} from "../utils/mail.helper.js";
import {OAuth2Client} from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import {User} from "../models/user.model.js";
import {cookieOptions, deleteFilesFromCloudinary, emitEvent, sendToken, uploadFilesToCloudinary} from "../utils/features.js";
import {compare} from "bcrypt";
import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler, sout} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";
import {Request} from "../models/request.model.js";
import {NEW_REQUEST, REFETCH_CHATS} from "../constants/events.constant.js";
import {getOtherMember} from "../lib/chat.helper.js";
import {NC_TOKEN} from "../constants/config.constant.js";
import {Message} from "../models/message.model.js";

const cleanupUserData = async (userId, avatarPublicId = "") => {
  const chats = await Chat.find({members: userId}).select("_id groupChat creator members");
  const directChatIds = chats.filter((chat) => !chat.groupChat).map((chat) => chat._id);
  const groupChats = chats.filter((chat) => chat.groupChat);

  if (directChatIds.length > 0) {
    await Message.deleteMany({chat: {$in: directChatIds}});
    await Chat.deleteMany({_id: {$in: directChatIds}});
  }

  await Message.deleteMany({sender: userId});
  await Request.deleteMany({$or: [{sender: userId}, {receiver: userId}]});

  await Promise.all(groupChats.map(async (chat) => {
    chat.members = chat.members.filter((member) => member.toString() !== userId.toString());
    if (chat.creator?.toString() === userId.toString()) {
      chat.creator = chat.members[0] || null;
    }

    if (chat.members.length < 2) {
      await Message.deleteMany({chat: chat._id});
      await chat.deleteOne();
      return;
    }

    await chat.save();
  }));

  if (avatarPublicId) {
    await deleteFilesFromCloudinary([avatarPublicId]);
  }
};

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
    .clearCookie(NC_TOKEN, cookieOptions)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
const updateMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const {name, username, bio, dob} = req.body;

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({username});
    if (existingUsername) return next(new ErrorHandler("Username already taken", 409));
    user.username = username;
  }

  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (dob) user.dob = dob;

  if (req.file) {
    if (user.avatar?.public_id) {
      await deleteFilesFromCloudinary([user.avatar.public_id]);
    }
    const results = await uploadFilesToCloudinary([req.file]);
    if (!results) return next(new ErrorHandler("Avatar upload failed", 500));
    user.avatar = {
      public_id: results[0].public_id,
      url: results[0].url,
    };
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
const updateMyEmail = TryCatch(async (req, res, next) => {
  const {email} = req.body;
  const normalizedEmail = email?.toLowerCase();

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.email === normalizedEmail) {
    return res.status(200).json({
      success: true,
      message: "Email is already up to date",
      user,
    });
  }

  const existingUser = await User.findOne({email: normalizedEmail});
  if (existingUser) return next(new ErrorHandler("Email already in use", 409));

  user.email = normalizedEmail;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email updated successfully",
    user,
  });
});
const updateMyPassword = TryCatch(async (req, res, next) => {
  const {currentPassword, newPassword} = req.body;

  const user = await User.findById(req.userId).select("+password");
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isPasswordCorrect = await compare(currentPassword, user.password);
  if (!isPasswordCorrect) return next(new ErrorHandler("Current password is incorrect", 400));

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
const upsertEncryptionPublicKey = TryCatch(async (req, res, next) => {
  const {encryptionPublicKey} = req.body;

  if (!encryptionPublicKey) {
    return next(new ErrorHandler("Encryption public key is required", 400));
  }

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.encryptionPublicKey = encryptionPublicKey;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Encryption key saved successfully",
    user,
  });
});
const upsertEncryptionBundle = TryCatch(async (req, res, next) => {
  const {
    encryptionPublicKey,
    encryptedPrivateKeyBundle,
    encryptionBundleIv,
    encryptionBundleSalt,
    encryptionBundleIterations,
    encryptionKeyVersion = 1,
    encryptedRecoveryKeyBundle,
    recoveryBundleIv,
    recoveryBundleSalt,
  } = req.body;

  if (!encryptionPublicKey || !encryptedPrivateKeyBundle || !encryptionBundleIv || !encryptionBundleSalt || !encryptionBundleIterations) {
    return next(new ErrorHandler("Complete encryption bundle data is required", 400));
  }

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.encryptionPublicKey = encryptionPublicKey;
  user.encryptedPrivateKeyBundle = encryptedPrivateKeyBundle;
  user.encryptionBundleIv = encryptionBundleIv;
  user.encryptionBundleSalt = encryptionBundleSalt;
  user.encryptionBundleIterations = Number(encryptionBundleIterations);
  user.encryptionKeyVersion = Number(encryptionKeyVersion) || 1;
  if (encryptedRecoveryKeyBundle && recoveryBundleIv && recoveryBundleSalt) {
    user.encryptedRecoveryKeyBundle = encryptedRecoveryKeyBundle;
    user.recoveryBundleIv = recoveryBundleIv;
    user.recoveryBundleSalt = recoveryBundleSalt;
    user.hasRecoveryKey = true;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Encryption bundle saved successfully",
    user,
  });
});
const getMyEncryptionBundle = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId).select(
    "encryptionPublicKey encryptedPrivateKeyBundle encryptionBundleIv encryptionBundleSalt encryptionBundleIterations encryptionKeyVersion encryptedRecoveryKeyBundle recoveryBundleIv recoveryBundleSalt hasRecoveryKey"
  );

  if (!user) return next(new ErrorHandler("User not found", 404));

  return res.status(200).json({
    success: true,
    encryptionBundle: {
      encryptionPublicKey: user.encryptionPublicKey,
      encryptedPrivateKeyBundle: user.encryptedPrivateKeyBundle,
      encryptionBundleIv: user.encryptionBundleIv,
      encryptionBundleSalt: user.encryptionBundleSalt,
      encryptionBundleIterations: user.encryptionBundleIterations,
      encryptionKeyVersion: user.encryptionKeyVersion,
      encryptedRecoveryKeyBundle: user.encryptedRecoveryKeyBundle,
      recoveryBundleIv: user.recoveryBundleIv,
      recoveryBundleSalt: user.recoveryBundleSalt,
      hasRecoveryKey: user.hasRecoveryKey,
    },
  });
});
const resetMyEncryptionState = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.encryptionPublicKey = "";
  user.encryptedPrivateKeyBundle = "";
  user.encryptionBundleIv = "";
  user.encryptionBundleSalt = "";
  user.encryptionBundleIterations = 0;
  user.encryptionKeyVersion = 1;
  user.encryptedRecoveryKeyBundle = "";
  user.recoveryBundleIv = "";
  user.recoveryBundleSalt = "";
  user.hasRecoveryKey = false;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Secure messaging has been reset for this account. Sign out and sign back in to create a new secure identity.",
    user,
  });
});
const deleteMyAccount = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  await cleanupUserData(user._id, user.avatar?.public_id);
  await user.deleteOne();

  return res.status(200)
    .clearCookie(NC_TOKEN, cookieOptions)
    .json({
      success: true,
      message: "Account deleted successfully",
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

  const hadEncryptionBundle = Boolean(user.encryptedPrivateKeyBundle || user.encryptedRecoveryKeyBundle);
    
  user.password = newPassword;
  user.encryptedPrivateKeyBundle = "";
  user.encryptionBundleIv = "";
  user.encryptionBundleSalt = "";
  user.encryptionBundleIterations = 0;
  await user.save();
  await redis.del(`reset_token:${email}`);
  
  return res.status(200).json({
    success: true,
    message: hadEncryptionBundle
      ? "Password reset successfully. Secure message recovery has been reset for this account."
      : "Password reset successfully!",
    e2eeRecoveryReset: hadEncryptionBundle,
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
  updateMyProfile,
  updateMyEmail,
  updateMyPassword,
  upsertEncryptionPublicKey,
  upsertEncryptionBundle,
  getMyEncryptionBundle,
  resetMyEncryptionState,
  deleteMyAccount,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};

// Path: server/controllers/user.controller.js

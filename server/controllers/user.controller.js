import {User} from "../models/user.model.js";
import {cookieOptions, sendToken} from "../utils/features.js";
import {compare} from "bcrypt";
import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";
import {Chat} from "../models/chat.model.js";

const newUser = async (req, res) => {

  const {name, username, password, bio, email, dob} = req.body;

  const avatar = {
    public_id: "123456",
    url: "https://api.dicebear.com/8.x/open-peeps/svg?seed=Midnight&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
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
};
const login = TryCatch(async (req, res, next) => {
  const {username, password} = req.body;

  const user = await User.findOne({username}).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials", 401));

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));

  sendToken(res, user, 200, `User Login Successful for ${user.name}!`);
});
const getMyProfile = TryCatch(async (req, res) => {

  const user = await User.findById(req.userId).select("-password");

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
  const {name=""} = req.query;
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


export {login, newUser, getMyProfile, logout, searchUser};

// Path: server/controllers/user.controller.js
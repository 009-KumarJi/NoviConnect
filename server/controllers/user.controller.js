import {User} from "../models/user.model.js";
import {sendToken} from "../utils/features.js";
import {compare} from "bcrypt";
import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";

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

  sendToken(res, user, 200, `Welcome back, ${user.name}!`);
});

// TODO: Implement the getMyProfile function
const getMyProfile = async (req, res) => {
};


export {login, newUser};
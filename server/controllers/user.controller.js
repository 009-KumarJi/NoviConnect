import {User} from "../models/user.model.js";
import {connectDB, sendToken} from "../utils/features.js";

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

const login = (req, res) => {
  connectDB();
  res.send("Login");
};


export {login, newUser};
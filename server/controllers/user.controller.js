// TODO: Create a new user and save it to the database and save in cookie
import {User} from "../models/user.model.js";
import {connectDB} from "../utils/features.js";

const newUser = async (req, res) => {
  const avatar = {
    public_id: "123456",
    url: "https://api.dicebear.com/8.x/open-peeps/svg?seed=Midnight&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
  }
  await User.create({
    name: "John Doe",
    email: "john@kmail.com",
    password: "password",
    username: "john_doe",
    dob: new Date(),
    avatar
  });
  res.status(201).json({message: "User created"});
};

const login = (req, res) => {
  connectDB();
  res.send("Login");
};


export {login, newUser};
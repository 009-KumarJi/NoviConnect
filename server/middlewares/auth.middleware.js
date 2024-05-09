import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";
import {adminKey} from "../server.js";
import {TryCatch} from "./error.middleware.js";
import {NC_TOKEN} from "../constants/config.constant.js";
import {User} from "../models/user.model.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[NC_TOKEN];
  if (!token) return next(new ErrorHandler("Unauthorized access for this route!", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decodedData.id;
  next();
});
const areYouAdmin = (req, res, next) => {
  const token = req.cookies["krishna-hero"];
  if (!token) return next(new ErrorHandler("Unauthorized access for this route!", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedData !== adminKey) return next(new ErrorHandler("Hmm! Very Smart! But you're unauthorized to access this route!", 401));
  next();
};
const socketAuthenticator = TryCatch(async (err, socket, next) => {
  if (err) return next(new ErrorHandler("Unauthorized access for this route!", 401));
  const authToken = socket.request.cookies[NC_TOKEN];
  if (!authToken) return next(new ErrorHandler("Unauthorized access for this route!", 401));
  const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
  const user = await User.findById(decodedData.id);
  if (!user) return next(new ErrorHandler("Unauthorized access for this route!", 401));
  socket.user = user;
  next();
})

export {isAuthenticated, areYouAdmin, socketAuthenticator};

// Path: server/middlewares/auth.middleware.js
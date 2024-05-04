import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";
import {adminKey} from "../server.js";
import {TryCatch} from "./error.middleware.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies["nc-token"];
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

export {isAuthenticated, areYouAdmin};

// Path: server/middlewares/auth.middleware.js
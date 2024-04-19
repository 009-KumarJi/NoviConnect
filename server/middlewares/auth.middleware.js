import {TryCatch} from "./error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["nc-token"];

  if (!token) return next(new ErrorHandler("Unauthorized access for this route!", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = decodedData.id;

  next();
};

export {isAuthenticated};
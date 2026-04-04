import {TryCatch} from "./error.middleware.js";
import {ErrorHandler} from "../utils/utility.js";

export const confirmFileExists = TryCatch(async (req, res, next) => {
  const file = req.file;
  if (!file && !req.body.googleAvatarUrl) return next(new ErrorHandler("Please upload an display image", 400));
  next();
});
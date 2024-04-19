import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly: true, // The cookie is not accessible via JavaScript
  sameSite: "none", // The cookie is sent in a cross-site request
  secure: true, // The cookie is sent only via HTTPS
};
const connectDB = (uri) => {
  console.log("Attempting to connect to database...");
  mongoose.connect(uri, {
    dbName: process.env.DB_NAME,
  })
    .then((data) => {
      console.log(`Successfully connected to the database at host: ${data.connection.host}`);
    })
    .catch((err) => {
      throw new Error(err);
    });
}

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
  return res
    .status(code)
    .cookie("nc-token", token, cookieOptions)
    .json({
    success: true,
    message,
  });
};

export {connectDB, sendToken, cookieOptions};
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
import {v4 as uuid} from "uuid";
import {sout} from "./utility.js";
import {getBase64} from "../lib/cloudinary.helper.js";
import {NC_TOKEN} from "../constants/config.constant.js";
import {getSockets} from "../lib/socketio.helper.js";

const httpOnly = true;
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly, // The cookie is not accessible via JavaScript
  sameSite: "strict", // The cookie is sent in a cross-site request
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
  console.log("Token: ", token);
  return res
    .status(code)
    .cookie(NC_TOKEN, token, cookieOptions)
    .json({
      success: true,
      user,
      message
    });
};
const emitEvent = (req, event, users, data= "") => {
  const io = req.app.get('io');
  const userSocket = getSockets(users);
  sout("Emitting event: ", event, " to: ", users, " with data: ", data);
  sout("User socket: ", userSocket);
  io.to(userSocket).emit(event, data);
};
const uploadFilesToCloudinary = async (files = []) => {
  sout("Uploading files to cloudinary...");

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => { // creating a new promise for each file
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => { // callback function for the upload
          if (error) return reject(error); // if there is an error, reject the promise
          resolve(result); // if the upload is successful, resolve the promise
        });
    });
  });

  try {
    const results = await Promise.all(uploadPromises); // waiting for all the promises to resolve
    sout("Files uploaded successfully!"); // logging a success message
    return results.map((result) => { // formatting the results
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }); // returning the formatted results
  } catch (error) {
    throw new Error("Oopsy-poopsy... Something got fused in upload process...");
  }
};
const deleteFilesFromCloudinary = async (publicIds) => {
  sout("Deleting files from cloudinary...");

  const deletePromises = publicIds.map((public_id) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  });

  try {
    await Promise.all(deletePromises);
    sout("Files deleted successfully!");
  } catch (error) {
    sout("An error occurred while deleting files from Cloudinary:", error);
  }
};

export {connectDB, sendToken, cookieOptions, emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary};

// Path: server/utils/features.js

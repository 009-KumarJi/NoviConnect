import mongoose from "mongoose";

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

export {connectDB};
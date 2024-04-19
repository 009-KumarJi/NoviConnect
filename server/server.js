import express from 'express';
import userRoutes from "./routes/user.routes.js";
import dotenv from 'dotenv';
import {connectDB} from "./utils/features.js";

dotenv.config({path: "./.env"});

const app = express();
const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);


app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// Path: server/index.js
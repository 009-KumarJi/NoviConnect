import express from 'express';
import userRoutes from "./routes/user.routes.js";
import dotenv from 'dotenv';
import {connectDB} from "./utils/features.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";

dotenv.config({path: "./.env"});

const app = express();
const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

// Using middleware to parse the body of the request
app.use(express.json());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// Path: server/index.js
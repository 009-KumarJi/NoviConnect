import express from 'express';
import userRoutes from "./routes/user.routes.js";

const app = express();


app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// Path: server/index.js
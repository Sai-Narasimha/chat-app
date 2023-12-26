const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRouter");
const chatRoute = require("./Routes/chatRouter");
const messageRoute = require("./Routes/messageRoute");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.get("/", (req, res) => {
  res.send("Welcome");
});
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;
app.listen(port, (req, res) => {
  console.log(`Server running at port : ${port}`);
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoDB connected"))
  .catch((error) => console.log(error));

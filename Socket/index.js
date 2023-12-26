const { Server } = require("socket.io");

const io = new Server({
  /* options */
  cors: "http://localhost:3000",
});
let onlineUsers = [];
io.on("connection", (socket) => {
  // ...
  console.log("new connection", socket.id);

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });
  // add a message
  socket.on("sendMessage", (message) => {
    console.log("message: ", message);
    const user = onlineUsers.find(
      (user) => user?.userId === message.recipeintId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
    console.log("user", user);
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(4000);

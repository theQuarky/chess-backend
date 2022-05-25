const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
app.get("/", (req, res) => {
  res.send("Hello Socket IO");
});

http.listen(process.env.PORT || 4000, () =>
  console.log(`Listening on ${4000}`)
);

io.on("connection", (socket) => {
  console.log("connected...");
  socket.on("join-room", ({ roomName, userId }) => {
    console.log("join-room", roomName, userId);
    socket.join(roomName);
    socket.to(roomName).emit("user-joined", "User joined your invitation");
  });

  socket.on("send-move", ({ roomName, userId, move, turn }) => {
    console.log("send-move", { roomName, userId, move });
    socket
      .to(roomName)
      .emit("receive-move", { roomName, userId, move, yourTurn: turn });
  });
});

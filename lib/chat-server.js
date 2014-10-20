var createChat = function (httpServer) {
  var io = require("socket.io")(httpServer);

  var nextUserId = 1;
  var nicknames = {};

  io.on("connection", function (socket) {
    console.log("Socket " + socket.id + " connected.");

    nicknames[socket.id] = "User " + nextUserId++;

    socket.on("message", function (data) {
      io.emit("message", {
        message: data.message,
        type: "user",
        user: nicknames[socket.id]
      });
    });

    socket.on("changeNick", function (data) {
      nicknames[socket.id] = data.nick;
    });
  });
};

module.exports = createChat;

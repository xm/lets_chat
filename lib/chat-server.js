var createChat = function (httpServer) {
  var io = require("socket.io")(httpServer);

  var nextUserId = 1;
  var nicknames = {};

  io.on("connection", function (socket) {
    sendSysMessage("Welcome, now let's chat!");

    nicknames[socket.id] = "User " + nextUserId++;

    socket.on("message", function (data) {
      sendUserMessage(data.message, nicknames[socket.id]);
    });

    socket.on("changeNick", function (data) {
      var oldNick = nicknames[socket.id];
      var newNick = data.nick;
      nicknames[socket.id] = newNick;

      sendLobbyMessage(oldNick + " changed nickname to " + newNick);
    });
  });

  var sendSysMessage = function (message) {
    io.emit("message", {
      message: message,
      type: "system"
    });
  };

  var sendLobbyMessage = function (message) {
    io.emit("message", {
      message: message,
      type: "lobby"
    });
  };

  var sendUserMessage = function (message, user) {
    io.emit("message", {
      message: message,
      type: "user",
      user: user
    });
  };
};

module.exports = createChat;

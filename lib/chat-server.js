var createChat = function (httpServer) {
  var io = require("socket.io")(httpServer);

  var nextUserId = 1;
  var nicknames = {};

  io.on("connection", function (socket) {
    nicknames[socket.id] = "User " + nextUserId++;

    sendSysMessage(socket, "Welcome, now let's chat!");

    socket.on("message", function (data) {
      sendUserMessage(data.message, nicknames[socket.id]);
    });

    socket.on("changeNick", function (data) {
      var oldNick = nicknames[socket.id];
      var newNick = data.nick;

      if (nicknameTaken(newNick)) {
        sendSysMessage(socket, "'" + newNick + "' is already taken.");
      } else {
        nicknames[socket.id] = newNick;
        sendLobbyMessage(oldNick + " changed nickname to " + newNick);
      }
    });
  });

  var sendSysMessage = function (socket, message) {
    socket.emit("message", {
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

  var nicknameTaken = function (nick) {
    for (var key in nicknames) {
      if (nicknames[key] === nick) {
        return true;
      }
    }

    return false;
  };
};

module.exports = createChat;

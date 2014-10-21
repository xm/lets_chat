var createChat = function (httpServer) {
  var io = require("socket.io")(httpServer);

  var nextUserId = 1;
  var nicknames = {};
  var lobbies = {};

  io.on("connection", function (socket) {
    var nick = "User" + nextUserId++;
    var defaultLobby = "General";

    sendLobbyList(socket);

    nicknames[socket.id] = nick;
    joinLobby(socket, defaultLobby);

    sendSysMessage(socket, "Welcome, now let's chat!");

    socket.on("message", function (data) {
      sendUserMessage(lobbies[socket.id], data.message, nicknames[socket.id]);
    });

    socket.on("changeNicknameReq", function (data) {
      var oldNick = nicknames[socket.id];
      var newNick = data.nick;
      var owner = nicknameOwner(newNick);

      if (nicknameReserved(newNick)) {
        sendChangeNicknameRes(socket, false, "'" + newNick + "' is reserved.");
      } else if (owner !== null && owner !== socket.id) {
        sendChangeNicknameRes(socket, false, "'" + newNick + "' is taken.");
      } else {
        nicknames[socket.id] = newNick;
        sendLobbyMessage(lobbies[socket.id],
          oldNick + " changed nickname to " + newNick);
        sendUpdateNickname(oldNick, newNick);
        sendChangeNicknameRes(socket, true, 
          "You've changed your nickname to '" + newNick + "'");
      }
    });

    socket.on("changeLobbyReq", function (data) {
      // TODO: only valid lobby names! 
      joinLobby(socket, data.lobby);
      sendChangeLobbyRes(socket, true, "You've joined '" + data.lobby + "'");
    });

    socket.on("disconnect", function () {
      leaveLobby(socket, lobbies[socket.id]);
      delete nicknames[socket.id];
    });
  });

  var sendSysMessage = function (socket, message) {
    socket.emit("message", {
      message: message,
      type: "system"
    });
  };

  var sendLobbyMessage = function (lobby, message) {
    io.to(lobby).emit("message", {
      message: message,
      type: "lobby"
    });
  };

  var sendUserMessage = function (lobby, message, user) {
    io.to(lobby).emit("message", {
      message: message,
      type: "user",
      user: user
    });
  };

  var sendChangeNicknameRes = function (socket, success, message) {
    socket.emit("changeNicknameRes", {
      success: success,
      message: message
    });
  };

  var nicknameReserved = function (nick) {
    return nick.toLowerCase().indexOf("user") === 0;
  };

  var nicknameOwner = function (nick) {
    var lower = nick.toLowerCase();

    for (var key in nicknames) {
      if (nicknames[key].toLowerCase() === lower) {
        return key;
      }
    }

    return null;
  };

  var sendLobbyList = function (socket) {
    var list = {};

    for (var key in nicknames) {
      var lobby = lobbies[key];

      if (!list[lobby]) {
        list[lobby] = [];
      }

      list[lobby].push(nicknames[key]);
    }

    socket.emit("lobbyList", {
      lobbyList: list
    });
  };

  var sendUserJoinedLobby = function (nick, lobby) {
    io.emit("userJoinedLobby", {
      nick: nick,
      lobby: lobby
    });
  };

  var sendUserLeftLobby = function (nick, lobby) {
    io.emit("userLeftLobby", {
      nick: nick,
      lobby: lobby
    });
  };

  var sendUpdateNickname = function (oldNick, newNick) {
    io.emit("updateNickname", {
      oldNick: oldNick,
      newNick: newNick
    });
  };

  var sendChangeLobbyRes = function (socket, success, message) {
    socket.emit("changeLobbyRes", {
      success: success,
      message: message
    });
  };

  var joinLobby = function (socket, lobby) {
    if (lobbies[socket.id]) {
      leaveLobby(socket, lobbies[socket.id]);
    }

    sendLobbyMessage(lobby, nicknames[socket.id] + " has joined the lobby.");
    sendUserJoinedLobby(nicknames[socket.id], lobby);
    lobbies[socket.id] = lobby;
    socket.join(lobby);
  };

  var leaveLobby = function (socket, lobby) {
    socket.leave(lobby);
    delete lobbies[socket.id];
    sendLobbyMessage(lobby, nicknames[socket.id] + " has left the lobby.");
    sendUserLeftLobby(nicknames[socket.id], lobby);
  };
};

module.exports = createChat;

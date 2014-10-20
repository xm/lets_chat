(function () {
  if (typeof Chat === "undefined") {
    Chat = {};
  }

  var Client = Chat.Client = function (socket) {
    this.socket = socket;
  };

  Client.prototype.processInput = function (input) {
    if (input.length <= 0) {
      return;
    }

    if (input[0] === "/") {
      var split = input.substr(1).split(" ");
      this.processCmd(split[0], split.slice(1));
    } else {
      this.sendMessage(input);
    }
  };

  Client.prototype.processCmd = function (cmd, args) {
    if (cmd === "nick" || cmd === "nickname") {
      this.sendChangeNicknameReq(args[0]);
    } else if (cmd === "j" || cmd === "join") {
      this.sendChangeLobbyReq(args[0]);
    } else {
      console.log("Unrecognized command: '" + cmd + "'");
    }
  };

  Client.prototype.sendMessage = function (message) {
    this.socket.emit("message", { message: message });
  };

  Client.prototype.sendChangeNicknameReq = function (newNick) {
    this.socket.emit("changeNicknameReq", { nick: newNick });
  };

  Client.prototype.sendChangeLobbyReq = function (lobby) {
    this.socket.emit("changeLobbyReq", { lobby: lobby });
  };
})();

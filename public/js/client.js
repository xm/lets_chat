(function () {
  if (typeof Chat === "undefined") {
    Chat = {};
  }

  var Client = Chat.Client = function (socket) {
    this.socket = socket;
  };

  Client.prototype.sendMessage = function(message) {
    this.socket.emit("message", { message: message });
  };

  Client.prototype.handleCmd = function(cmd, args) {
    if (cmd === "nick" || cmd === "nickname") {
      this.changeNick(args[0]);
    } else {
      console.log("Unrecognized command: '" + cmd + "'");
    }
  };

  Client.prototype.changeNick = function(nick) {
    this.socket.emit("changeNick", { nick: nick });
  };
})();

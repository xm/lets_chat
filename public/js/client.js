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
})();

function User (socket, name) {
  this.socket = socket;
  this.name = name;
  this.lobby = null;
  
  this.bindEvents();
}

User.prototype.bindEvents = function() {
  var self = this;

  this.socket.on("message", function (data) {
    if (data.message.indexOf("/") === 0) {
      var split = data.message.substr(1).split(" ");
      var cmd = split[0];

      if (cmd === "join") {
        var name = split[1];
        self.joinLobby(name);
      }
    } else {
      self.lobby.handleUserMessage(self, data);
    }
  });
};

User.prototype.joinLobby = function(name) {
  if (this.lobby) {
    this.socket.leave(this.lobby.name);
    this.lobby.removeUser(this);
  }

  var lobby = Server.getLobby(name);
  lobby.addUser(this);

  this.socket.join(lobby.name);
  this.lobby = lobby;

  this.sendMessage("You have joined '" + lobby.name + "'", "system");
};

User.prototype.sendMessage = function(message, type) {
  this.socket.emit("message", {
    message: message,
    type: type
  });
};

module.exports = User;

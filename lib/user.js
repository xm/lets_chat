function User (socket, name) {
  this.socket = socket;
  this.name = name;
  this.lobby = null;
  
  this.bindEvents();
}

User.prototype.bindEvents = function() {
  var self = this;

  this.socket.on("message", function (data) {
    self.lobby.userMessage(self.name, data.message);
  });
};

User.prototype.join = function(lobby) {
  if (this.lobby) {
    this.socket.leave(this.lobby.name);
  }

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

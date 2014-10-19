function Lobby (io, name) {
  this.io = io;
  this.name = name;
  this.users = [];
}

Lobby.prototype.sendLobbyMessage = function(message) {
  this.broadcast({
    message: message,
    type: "lobby"
  });
};

Lobby.prototype.handleUserMessage = function(user, data) {
  this.broadcast({ 
    user: user.name,
    message: data.message, 
    type: "user"
  });
};

Lobby.prototype.broadcast = function(data) {
  this.io.to(this.name).emit('message', data);
};

Lobby.prototype.addUser = function(user) {
  this.sendLobbyMessage(user.name + " has joined the lobby");
  this.users.push(user);
};

Lobby.prototype.removeUser = function(user) {
  var index = this.users.indexOf(user);

  if (index > -1) {
    this.users.splice(index, 1);
    this.sendLobbyMessage(user.name + " has left the lobby");
  }
};

module.exports = Lobby;

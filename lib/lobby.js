function Lobby (io, name) {
  this.io = io;
  this.name = name;
  this.users = [];
}

Lobby.prototype.lobbyMessage = function(message) {
  this.broadcast({
    message: message,
    type: "lobby"
  });
};

Lobby.prototype.userMessage = function(user, message) {
  this.broadcast({ 
    user: user,
    message: message, 
    type: "user"
  });
};

Lobby.prototype.broadcast = function(data) {
  this.io.to(this.name).emit('message', data);
};

Lobby.prototype.addUser = function(user) {
  this.lobbyMessage(user.name + " has joined the lobby");
  this.users.push(user);
  user.join(this);
};

Lobby.prototype.removeUser = function(user) {
  var index = this.users.indexOf(user);

  if (index > -1) {
    this.users.splice(index, 1);
    this.lobbyMessage(user.name + " has left the lobby");
  }
};

module.exports = Lobby;

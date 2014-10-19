var Lobby = require('./lobby.js');
var User = require('./user.js');

var DEFAULT_LOBBY_NAME = "General";

function ChatServer (directoryToServe) {
  this.httpServer = createHttpServer(directoryToServe);
  this.io = require('socket.io')(this.httpServer);
  this.lobbies = {};
  this.users = {};

  this.bindEvents();
}

ChatServer.prototype.start = function (port) {
  this.httpServer.listen(port);
};

ChatServer.prototype.bindEvents = function () {
  var self = this;
  var nextId = 1;

  this.io.on('connection', function (socket) {
    self.users[socket.id] = new User(socket, "User " + nextId++);
    self.users[socket.id].sendMessage("Welcome, now let's chat!", "system");
    self.users[socket.id].joinLobby(DEFAULT_LOBBY_NAME);
  });
};

ChatServer.prototype.getLobby = function (name) {
  if (!this.lobbies[name]) {
    console.log("Creating lobby '" + name + "'");
    this.lobbies[name] = new Lobby(this.io, name);
  }

  return this.lobbies[name];
};

function createHttpServer (directoryToServe) {
  var http = require('http');
  var static = require('node-static');
  var file = new static.Server(directoryToServe);

  return http.createServer(function (req, res) {
    req.addListener('end', function () {
      file.serve(req, res);
    }).resume();
  });
}

module.exports = ChatServer;

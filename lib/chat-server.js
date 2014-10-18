var Lobby = require('./lobby.js');
var User = require('./user.js');

var DEFAULT_LOBBY = "General";

function ChatServer (directoryToServe) {
  this.httpServer = createHttpServer(directoryToServe);
  this.io = require('socket.io')(this.httpServer);
  this.lobbies = {};
  this.users = {};

  this.bindEvents();
}

ChatServer.prototype.start = function (port) {
  this.createLobby(DEFAULT_LOBBY);

  this.httpServer.listen(port);
};

ChatServer.prototype.bindEvents = function () {
  var self = this;
  var nextId = 1;

  this.io.on('connection', function (socket) {
    self.users[socket] = new User(socket, "User " + nextId++);
    self.users[socket].sendMessage("Welcome, now let's chat!", "system");

    self.lobbies[DEFAULT_LOBBY].addUser(self.users[socket]);
  });
};

ChatServer.prototype.createLobby = function (name) {
  if (!this.lobbies[name]) {
    console.log("Creating lobby '" + name + "'");
    this.lobbies[name] = new Lobby(this.io, name);
  }
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

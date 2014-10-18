function ChatServer (directoryToServe) {
  this.httpServer = this.createHttpServer(directoryToServe);
  this.io = require('socket.io')(this.httpServer);

  this.bindEvents();
}

ChatServer.prototype.createHttpServer = function (directoryToServe) {
  var http = require('http');
  var static = require('node-static');
  var file = new static.Server(directoryToServe);

  return http.createServer(function (req, res) {
    req.addListener('end', function () {
      file.serve(req, res);
    }).resume();
  });
};

ChatServer.prototype.bindEvents = function () {
  this.io.on('connection', function (socket) {
    console.log('Connection established!');
    socket.emit("message", {
      message: "Welcome, now let's chat!",
      type: 'system'
    });

    socket.on('message', function (data) {
      io.emit('message', data);
    });
  });
};

ChatServer.prototype.start = function (port) {
  this.httpServer.listen(port);
};

module.exports = ChatServer;

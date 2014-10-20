var createChat = function (httpServer) {
  var io = require('socket.io')(httpServer);

  io.on('connection', function (socket) {
    console.log("Socket " + socket.id + " connected.");

    socket.on('message', function (data) {
      socket.emit("message", data);
    });
  });
};

module.exports = createChat;

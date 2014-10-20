var http = require('http');
var static = require('node-static');
var file = new static.Server('./public');

var httpServer = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

var createChat = require('./chat-server.js');
createChat(httpServer);

httpServer.listen(8000);

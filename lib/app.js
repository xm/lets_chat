var http = require('http'),
    static = require('node-static');

var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

var chatServer = require('./chat_server.js');
chatServer(server);

server.listen(8000);

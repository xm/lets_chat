var ChatServer = require('./chat-server.js');

var server = new ChatServer('./public');
server.start(8000);

var ChatServer = require('./chat-server.js');

Server = new ChatServer('./public');
Server.start(8000);

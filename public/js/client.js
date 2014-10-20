(function () {
  if (typeof Chat === "undefined") {
    Chat = {};
  }

  var Client = Chat.Client = function (socket) {
    this.events = {};
    this.socket = socket;

    this.bindEvents();
  };

  Client.prototype.bindEvents = function() {
    var self = this;

    this.socket.on("message", function (data) {
      self.handleCallbacks("messageReceived", data);
    });
  };

  Client.prototype.on = function(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  };

  Client.prototype.handleCallbacks = function(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(function (callback) {
        callback(data);
      });
    }
  };

  Client.prototype.sendMessage = function(message) {
    this.socket.emit("message", { message: message });
  };
})();

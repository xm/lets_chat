(function () {
  if (typeof Chat === "undefined") {
    Chat = {};
  }

  var Interface = Chat.Interface = function (options) {
    options = options || {};

    this.socket = io();
    this.client = new Chat.Client(this.socket);

    this.$message = $(options.message || "#message");
    this.$messageList = $(options.messageList || "#message-list");

    this.bindEvents();
  };

  Interface.prototype.bindEvents = function() {
    var self = this;

    this.client.on("messageReceived", function (data) {
      self.addMessage(data.message, data.type);
    });

    this.$message.on("keydown", function (event) {
      if (event.keyCode === 13) {
        self.sendMessage();
      }
    });
  };

  Interface.prototype.addMessage = function(message, type) {
    var $li = $("<li>").addClass("message " + type).text(message);
    this.$messageList.append($li);
  };

  Interface.prototype.sendMessage = function() {
    var message = this.$message.val();

    if (message.length > 0) {
      this.client.sendMessage(message);
      this.$message.val('');
    }
  };
})();

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

    this.client.socket.on("message", function (data) {
      self.addMessage(data.message, data.type, data.user);
    });

    this.$message.on("keydown", function (event) {
      if (event.keyCode === 13) {
        self.sendMessage();
      }
    });
  };

  Interface.prototype.addMessage = function(message, type, user) {
    var $li = $("<li>").addClass("message " + type).text(message);

    if (type === "user") {
      var $span = $("<span>").text(user);
      $li.prepend($span);
    }

    this.$messageList.append($li);

    this.$messageList.animate({
      scrollTop: this.$messageList[0].scrollHeight
    }, 250);
  };

  Interface.prototype.sendMessage = function() {
    var message = this.$message.val();

    if (message.length > 0) {
      if (message[0] === "/") {
        var split = message.substr(1).split(" ");
        this.client.handleCmd(split[0], split.slice(1));
      } else {
        this.client.sendMessage(message);
      }

      this.$message.val('');
    }
  };
})();

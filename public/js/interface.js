(function () {
  if (typeof Chat === "undefined") {
    Chat = {};
  }

  var Interface = Chat.Interface = function (options) {
    options = options || {};

    this.socket = io();
    this.client = new Chat.Client(this.socket);

    this.$messageInput = $(options.messageInput || "#message");
    this.$messageList = $(options.messageList || "#message-list");
    this.$lobbyList = $(options.lobbyList || "#lobby-list");

    this.bindEvents();
  };

  Interface.prototype.bindEvents = function () {
    var self = this;

    this.$messageInput.on("keydown", function (event) {
      if (event.keyCode === 13) {
        self.sendMessage();
      }
    });

    this.client.socket.on("message", function (data) {
      self.addMessage(data.message, data.type, data.user);
    });

    this.client.socket.on("changeNicknameRes", function (data) {
      self.addMessage(data.message, data.success ? "success" : "error");
    });

    this.client.socket.on("lobbyList", function (data) {
      self.buildLobbyList(data.lobbyList);
    });

    this.client.socket.on("changeLobbyRes", function (data) {
      self.addMessage(data.message, data.success ? "success" : "error");
    });
  };

  Interface.prototype.addMessage = function (message, type, user) {
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

  Interface.prototype.sendMessage = function () {
    var input = this.$messageInput.val();
    this.client.processInput(input);
    this.$messageInput.val('');
  };

  Interface.prototype.buildLobbyList = function (lobbyList) {
    this.$lobbyList.empty();
    for (var lobby in lobbyList) {
      var $liLobby = $("<li>").text(lobby);
      var $ulDetails = $("<ul>").addClass("lobby-details");

      for (var i = 0, l = lobbyList[lobby].length; i < l; ++i) {
        var user = lobbyList[lobby][i];
        var $liUser = $("<li>").text(user);
        $ulDetails.append($liUser);
      }

      this.$lobbyList.append($liLobby);
      this.$lobbyList.append($ulDetails);
    }
  };
})();

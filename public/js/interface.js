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

    this.client.socket.on("userJoinedLobby", function (data) {
      self.addUserToLobby(data.nick, data.lobby);
    });

    this.client.socket.on("userLeftLobby", function (data) {
      var $userEl = self.findLobbyUserEl(data.nick);
      $userEl.remove();

      var $lobbyDetails = self.findLobbyDetailsEl(data.lobby);

      if ($lobbyDetails.children().length <= 0) {
        $lobbyDetails.remove();
        $("li#" + data.lobby).remove();
      }
    });

    this.client.socket.on("updateNickname", function (data) {
      var $userEl = self.findLobbyUserEl(data.oldNick);
      if ($userEl) {
        $userEl.text(data.newNick);
      } else {
        console.log("updateNickname failed, unable to find $userEl");
        console.log(data);
      }
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
      this.buildLobbyEntry(lobby, lobbyList[lobby]);
    }
  };

  Interface.prototype.buildLobbyEntry = function (lobby, users) {
    var $liLobby = this.buildLobbyLi(lobby);
    var $ulDetails = this.buildLobbyDetails(lobby, users);

    this.$lobbyList.append($liLobby);
    this.$lobbyList.append($ulDetails);
  };

  Interface.prototype.buildLobbyLi = function (lobby) {
    return $("<li>").prop("id", lobby).text(lobby);
  };

  Interface.prototype.buildLobbyDetails = function (lobby, users) {
    var $ul = $("<ul>").addClass("lobby-details").prop("id", lobby);

    users.forEach(function (u) {
      $ul.append(this.buildUserLi(u));
    }.bind(this));

    return $ul;
  };

  Interface.prototype.buildUserLi = function (nick) {
    return $("<li>").text(nick);
  };

  Interface.prototype.addUserToLobby = function (nick, lobby) {
    var $userUl = this.findLobbyDetailsEl(lobby);

    if ($userUl.length > 0) {
      $userUl.append(this.buildUserLi(nick));
    } else {
      this.buildLobbyEntry(lobby, [nick]);
    }
  };

  Interface.prototype.findLobbyDetailsEl = function (lobby) {
    return $("ul#" + lobby);
  };

  Interface.prototype.findLobbyUserEl = function (nickname) {
    var $liUsers = this.$lobbyList.find("ul > li");
    var $userEl = null;

    $liUsers.each(function (i, el) {
      var $el = $(el);

      if ($el.text() === nickname) {
        $userEl = $el;
        return;
      }
    });

    return $userEl;
  };
})();

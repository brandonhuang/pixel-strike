var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var util = require("util");
var sockets = require("./sockets");
var Game = require("./GameCore");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/link", function(req, res) {
  res.sendFile(__dirname + "/public/link.html");
});

http.listen(process.env.PORT || 80, function() {
  console.log("listening on *:80");
  init();
});

var game;
var socket;

function init() {
  game = new Game();
  socket = sockets(io, game);

  game.init(socket);
  socket.init();
}

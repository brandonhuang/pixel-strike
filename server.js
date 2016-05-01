var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var sockets = require('./sockets');
var Game = require('./GameCore');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(80, function(){
  console.log('listening on *:8000');
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

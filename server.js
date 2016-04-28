var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var gameloop = require('node-gameloop');
var sockets = require('./sockets.js');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8000, function(){
  console.log('listening on *:8000');
  init();
});

var game = {};
var socket;

function init() {
  game.players = [];

  socket = sockets(io, game);
  socket.init();
}

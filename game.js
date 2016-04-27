var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');

var Player = require('./Player')

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8000, function(){
  console.log('listening on *:8000');
  init();
});

var sockets;
var players;

function init() {
  players = [];

  setEventHandlers();
}

function setEventHandlers() {
  io.on('connection', onConnect);
};

function onConnect(client) {
  client.on("disconnect", onClientDisconnect);
  client.on("ready", onReady);
  client.on("start", onStart);
  client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
  util.log("Player has disconnected: " + this.id);
  var player;
  if(player = playerById(this.id)) {
    players.splice(players.indexOf(player), 1);
  }

  this.broadcast.emit('remove player', {id: this.id});
};

function onReady() {
  // Emit all current players to new player
  for (var i = 0; i < players.length; i++) {
    io.to(this.id).emit("new player", {id: players[i].id, x: players[i].getX(), y: players[i].getY()});
  };
}

function onStart() {
  util.log("New player has connected: " + this.id);
  var startX = Math.round(Math.random() * 2000);
  var startY = Math.round(Math.random() * 2000);
  var newPlayer = Player(startX, startY);
  newPlayer.id = this.id;

  // Spawn player clientside with starting variables
  io.to(this.id).emit("spawn", {x: startX, y: startY});

  // Broadcast new player to all existing players
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

  players.push(newPlayer);
};

function onMovePlayer(data) {
  util.log("move", data)
  var movePlayer = playerById(this.id);

  if(!movePlayer) {
    util.log('Player not found', this.id);
    return;
  }

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

// HELPERS

function playerById(id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
}


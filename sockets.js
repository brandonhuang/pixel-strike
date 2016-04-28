var util = require('util');

var helpers = require('./helpers');
var playerById = helpers.playerById;

var Player = require('./Player');

function socketController(io, game) {
  function init() {
    io.on('connection', onConnect);
  }

  function onConnect(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("ready", onReady);
    client.on("start", onStart);
    client.on("move player", onMovePlayer);
  }


  function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    var player = playerById(this.id, game.players);
    if(player) {
      game.players.splice(game.players.indexOf(player), 1);
    }

    this.broadcast.emit('remove player', {id: this.id});
  }

  function onReady() {
    // Emit all current game.players to new player
    for (var i = 0; i < game.players.length; i++) {
      io.to(this.id).emit("new player", {id: game.players[i].id, x: game.players[i].x, y: game.players[i].y});
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

    // Broadcast new player to all existing game.players
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y});

    game.players.push(newPlayer);
  }

  function onMovePlayer(data) {
    util.log("move", data)
    var movePlayer = playerById(this.id, game.players);

    if(!movePlayer) {
      util.log('Player not found', this.id);
      return;
    }

    movePlayer.x = data.x;
    movePlayer.y = data.y;

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
  }

  return {
    init: init
  }
}


module.exports = socketController;

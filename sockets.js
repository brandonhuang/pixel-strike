var util = require('util');

var helpers = require('./helpers');
var playerById = helpers.playerById;

function socketController(io, game) {
  function init() {
    io.on('connection', onConnect);
  }

  function onConnect(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("ready", onReady);
    client.on("start", onStart);
    client.on("left", onLeft);
    client.on("right", onLeft);
    client.on("up", onLeft);
    client.on("down", onLeft);
    client.on("space", onLeft);
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
    var player = game.createPlayer(this.id);
    this.player = player;
    util.log("New player has connected: " + player.id);

    // Spawn player clientside with starting variables
    io.to(this.id).emit("spawn", {x: player.x, y: player.y, angle: player.angle});

    // Broadcast new player to all existing game.players
    this.broadcast.emit("new player", {id: player.id, x: player.x, y: player.y});
  }

  function onLeft(bool) {
    this.player.left(!!bool);
  }

  function onRight(bool) {
    this.player.right(!!bool);
  }

  function onUp(bool) {
    this.player.up = !!bool;
  }

  function onDown(bool) {
    this.player.down = !!bool;
  }

  function onSpace(bool) {
    this.player.space = !!bool;
  }

  function onMovePlayer(data) {
    // util.log("move", data)
    var movePlayer = playerById(this.id, game.players);

    if(!movePlayer) {
      util.log('Player not found', this.id);
      return;
    }

    movePlayer.x = data.x;
    movePlayer.y = data.y;

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y});
  }

  function movePlayer(player) {
    io.sockets.emit("move", player);
  }

  return {
    init: init,
    movePlayer: movePlayer
  }
}


module.exports = socketController;

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
    client.on("right", onRight);
    client.on("up", onUp);
    client.on("boost", onBoost);
    client.on("shoot", onShoot);
  }


  function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    var player = playerById(this.id, game.players);
    if(player) {
      game.players.splice(game.players.indexOf(player), 1);
    }

    this.broadcast.emit('remove player', this.id);
  }

  function onReady() {
    // Emit all current game.players to new player
    for (var i = 0; i < game.players.length; i++) {
      io.to(this.id).emit("new player", game.players[i].public());
    };
  }

  function onStart() {
    var player = game.createPlayer(this.id);
    this.player = player;
    util.log("New player has connected: " + player.id);

    // Spawn player clientside with starting variables
    io.to(this.id).emit("spawn", player.public());

    // Broadcast new player to all existing game.players
    this.broadcast.emit("new player", player.public());
  }

  function onLeft(bool) {
    this.player.left = !!bool;
  }

  function onRight(bool) {
    this.player.right = !!bool;
  }

  function onUp(bool) {
    this.player.up = !!bool;
  }

  function onBoost(bool) {
    this.player.boost = !!bool;
  }

  function onShoot(bool) {
    this.player.shoot = !!bool;
  }

  function newPlayer(player) {

  }

  function updatePlayer(player) {
    io.sockets.emit("update player", player);
  }

  function destroyPlayer(id) {
    io.sockets.emit('destroy player', id);
  }

  function newBullet(bullet) {
    io.sockets.emit("new bullet", bullet);
  }

  function updateBullet(bullet) {
    io.sockets.emit('update bullet', bullet);
  }

  function destroyBullet(id) {
    io.sockets.emit('destroy bullet', id);
  }

  function newPixel(pixel) {
    io.sockets.emit("new pixel", {id: pixel.id, x: pixel.x, y: pixel.y, angle: pixel.angle, speed: pixel.speed});
  }

  function updatePixel(pixel) {
    io.sockets.emit('update pixel', {id: pixel.id, x: pixel.x, y: pixel.y, angle: pixel.angle});
  }

  function destroyPixel(id) {
    io.sockets.emit('destroy pixel', id);
  }

  return {
    init: init,
    newPlayer: newPlayer,
    updatePlayer: updatePlayer,
    destroyPlayer: destroyPlayer,
    newBullet: newBullet,
    updateBullet: updateBullet,
    destroyBullet: destroyBullet,
    newPixel: newPixel,
    updatePixel: updatePixel,
    destroyPixel: destroyPixel
  }
}


module.exports = socketController;

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
    // client.on("down", onDown);
    // client.on("boost", onBoost);
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

  function onStart(name) {
    var player = game.createPlayer(this.id, name);
    if(!player) {
      console.log('player could not be creared');
      return;
    }

    this.player = player;
    util.log("New player has connected: " + player.id);

    // Spawn player clientside with starting variables
    io.to(this.id).emit("spawn", player.public());

    // Broadcast new player to all existing game.players
    this.broadcast.emit("new player", player.public());
  }

  function onLeft(bool) {
    this.player.left = !!bool;
    // io.sockets.emit("player left", {id: this.id, bool: !!bool});
  }

  function onRight(bool) {
    this.player.right = !!bool;
    // io.sockets.emit("player right", {id: this.id, bool: !!bool});
  }

  function onUp(bool) {
    this.player.up = !!bool;
    // io.sockets.emit("player up", {id: this.id, bool: !!bool});
  }

  // function onDown(bool) {
  //   this.player.down = !!bool;
  // }

  // function onBoost(bool) {
  //   this.player.boost = !!bool;
  // }

  function onShoot(bool) {
    this.player.shoot = !!bool;
    // io.sockets.emit("player shoot", {id: this.id, bool: !!bool});
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
    io.sockets.emit("new pixel", pixel);
  }

  function updatePixel(pixel) {
    io.sockets.emit('update pixel', pixel);
  }

  function destroyPixel(id) {
    io.sockets.emit('destroy pixel', id);
  }

  function outOfBounds(id) {
    io.sockets.emit('outOfBounds', id);
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

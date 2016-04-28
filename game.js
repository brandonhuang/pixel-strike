var gameloop = require('node-gameloop');

var Player = require('./Player');

function Game() {
  this.players = [];
  this.updateTimer = 0;
  this.update;
  this.io;
}

Game.prototype.init = function(io) {
  this.io = io;

  this.update = gameloop.setGameLoop(function(delta) {
    this.updatePlayers(delta);
  }.bind(this), 1000 / 60)
}

Game.prototype.updatePlayers = function(delta) {
  for(var i = 0; i < this.players.length; i++) {
    this.players[i].update(delta);
    this.io.movePlayer(this.players[i]);
  }
}

Game.prototype.createPlayer = function(id) {
  var newPlayer = new Player(id);
  this.players.push(newPlayer);

  return newPlayer;
}


module.exports = Game;

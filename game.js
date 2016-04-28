var gameloop = require('node-gameloop');

var Player = require('./Player');


function Game() {
  var players = [];
  var updateTimer = 0;
  var update;
  var io;

  function init(_io) {
    io = _io;
    update = gameloop.setGameLoop(function(delta) {
      updatePlayers(delta);
    }, 1000 / 60);
  }

  function updatePlayers(delta) {
    for(var i = 0; i < players.length; i++) {
      players[i].update(delta);
      io.movePlayer(players[i]);
    }
  }

  function createPlayer(_id) {
    var newPlayer = Player(_id);
    players.push(newPlayer);

    return newPlayer;
  }

  return {
    init: init,
    players: players,
    createPlayer: createPlayer
  }
}

module.exports = Game;

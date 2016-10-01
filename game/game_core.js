var gameloop = require('node-gameloop');
var util = require('util');
var helper = require('../helpers/helpers');

var Player = require('../objects/Player');
var Bullet = require('../objects/Bullet');
var Pixel = require('../objects/Pixel');

function Game() {
  this.players = [];
  this.bullets = [];
  this.pixels = [];
  this.worldBounds = {x: 2000, y: 2000};
  this.renderLoop;
  this.physicsLoop;
  this.io;
}

Game.prototype.init = function(io) {
  this.io = io;

  // MAIN UPDATE LOOP
  this.renderLoop = gameloop.setGameLoop(function(delta) {
    this.updatePlayers(delta);
  }.bind(this), 1000 / 60)

  this.physicsLoop = gameloop.setGameLoop(function(delta) {
    this.updateBullets(delta);
    this.updatePixels(delta);
    this.checkCollisions(this.bullets, this.players);
    this.checkCollisions(this.pixels, this.players);
    this.checkCollisions(this.players, this.players);
  }.bind(this), 1000 / 45);

  gameloop.setGameLoop(function(delta) {
    this.checkBoundaries();
  }.bind(this), 1000 / 4);

  gameloop.setGameLoop(function(delta) {
    util.log("players:", this.players.length, "bullets", this.bullets.length, "pixels", this.pixels.length);
  }.bind(this), 10000);
}

Game.prototype.createPlayer = function(id, name) {
  if(helper.playerById(id, this.players)) {
    console.log(id, "already exists");
    return;
  }

  var newPlayer = new Player(id, name, this);
  this.players.push(newPlayer);

  return newPlayer;
}

Game.prototype.updatePlayers = function(delta) {
  for(var i = 0; i < this.players.length; i++) {
    this.players[i].update(delta);
    this.io.updatePlayer(this.players[i].public());
  }
}

Game.prototype.syncPlayers = function(delta) {
  for(var i = 0; i < this.players.length; i++) {
    this.io.updatePlayer(this.players[i].public());
  }
}

Game.prototype.destroyPlayer = function(id) {
  for(var i = 0; i < this.players.length; i++) {
    if(this.players[i].id === id) {
      this.io.destroyPlayer(id);
      this.players[i].kill();
      this.players.splice(i, 1);
    }
  }
}

Game.prototype.createBullet = function(pid, x, y, angle) {
  var newBullet = new Bullet(this, pid, x, y, angle);
  this.bullets.push(newBullet);
  this.io.newBullet(newBullet.public());

  return newBullet;
}

Game.prototype.updateBullets = function(delta) {
  for(var i = 0; i < this.bullets.length; i++) {
    // this.io.updateBullet(this.bullets[i].public());
    this.bullets[i].update(delta);
  }
}

Game.prototype.destroyBullet = function(id) {
  for(var i = 0; i < this.bullets.length; i++) {
    if(this.bullets[i].id === id) {
      this.io.destroyBullet(id);
      this.bullets.splice(i, 1);
    }
  }
}

Game.prototype.createPixel = function(pid, x, y, hue, health) {
  var newPixel = new Pixel(this, pid, x, y, hue, health);
  this.pixels.push(newPixel);
  this.io.newPixel(newPixel.public());

  return newPixel;
}

Game.prototype.updatePixels = function(delta) {
  for(var i = 0; i < this.pixels.length; i++) {
    this.pixels[i].update(delta);
  }
}

Game.prototype.destroyPixel = function(id) {
  for(var i = 0; i < this.pixels.length; i++) {
    if(this.pixels[i].id === id) {
      this.io.destroyPixel(id);
      this.pixels.splice(i, 1);
    }
  }
}

Game.prototype.checkCollisions = function(objects1, objects2) {
  for(var i = 0; i < objects1.length; i++) {
    for(var j = 0; j < objects2.length; j++) {
      if(objects1[i] == objects2[j]) {
        continue;
      }
      if (objects1[i].getX() < objects2[j].getX() + objects2[j].width &&
         objects1[i].getX() + objects1[i].width > objects2[j].getX() &&
         objects1[i].getY() < objects2[j].getY() + objects2[j].height &&
         objects1[i].height + objects1[i].getY() > objects2[j].getY()) {
          objects1[i].collide(objects2[j]);
          break;
      }
    }
  }
}

Game.prototype.checkBoundaries = function() {
  for(var i = 0; i < this.players.length; i++) {
    if(this.players[i].x < 0 || this.players[i].x > this.worldBounds.x) {
      this.destroyPlayer(this.players[i].id);
    } else if(this.players[i].y < 0 || this.players[i].y > this.worldBounds.y) {
      this.destroyPlayer(this.players[i].id);
    }
  }
}

module.exports = Game;

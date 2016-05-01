var acceleration = 100;
var minSpeed = 0; 
var maxSpeed = 300;
var maxRotation = 200;
var drag = 400;
var shootDelay = 0.05; // in seconds
var pixels = 0;

function Player(id, game) {
  this.game = game;

  this.left = false;
  this.right = false;
  this.up = false;
  this.boost = false;
  this.shoot = false;

  this.x = Math.random() * 2000;
  this.y = Math.random() * 2000;
  this.width = 16;
  this.height = 16;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.angle = Math.random() * 360 - 180;
  this.id = id;
  this.speed = minSpeed;
  this.health = 50;
  this.shootDelay = shootDelay;
  this.shootTime = shootDelay;
  this.pixels = pixels;

  this.getX = function() {
    return this.x - this.width * this.anchorX;
  };

  this.getY = function() {
    return this.y - this.height * this.anchorY;
  }
}

Player.prototype.public = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    angle: this.angle,
    health: this.health
  };
}

Player.prototype.update = function(delta) {
  if(this.left) {
    this.angle -= maxRotation * delta;
  } else if(this.right) {
    this.angle += maxRotation * delta;
  }

  if(this.up) {
    this.speed = maxSpeed;
  } else if(this.speed > minSpeed) {
    this.speed -= drag * delta;
  }

  this.shootTime += delta;
  if(this.shoot) {
    if(this.shootTime >= this.shootDelay) {
      this.game.createBullet(this.id, this.x, this.y, this.angle);
      this.shootTime = 0;
    }
  }

  if(this.speed > 0) {
    this.x += Math.cos(this.angle * Math.PI/180) * this.speed * delta;
    this.y += Math.sin(this.angle * Math.PI/180) * this.speed * delta;
  }
}

Player.prototype.collide = function(col) {
  util.log(this.id, 'collided with', col.id);
}

Player.prototype.reduceHealth = function(damage) {
  this.health -= damage;
  if(this.health <= 0) {
    this.game.destroyPlayer(this.id);
  }
}

Player.prototype.collectPixel = function() { 
  if(this.health < 300) {
    this.health++;
  }
}

module.exports = Player;

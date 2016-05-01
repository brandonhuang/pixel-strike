var speed = 400; 
var drag = 0;
var lifetime = 2.5; // in seconds

function Bullet(game, pid, x, y, angle) {
  this.game = game;

  this.x = x;
  this.y = y;
  this.width = 2;
  this.height = 2;
  this.angle = angle;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.id = new Date();
  this.pid = pid;
  this.speed = speed;
  this.age = 0;
  this.damage = 1;

  this.getX = function() {
    return this.x - this.width * this.anchorX;
  };

  this.getY = function() {
    return this.y - this.height * this.anchorY;
  }
}

Bullet.prototype.public = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    angle: this.angle,
    speed: this.speed
  }
}

Bullet.prototype.update = function(delta) {
  this.x += Math.cos(this.angle * Math.PI/180) * this.speed * delta;
  this.y += Math.sin(this.angle * Math.PI/180) * this.speed * delta;
  this.age += delta;

  if(this.age > lifetime) {
    this.game.destroyBullet(this.id);
  }
}

Bullet.prototype.collide = function(col) {
  if(this.pid === col.id) {
    // console.log('friendly collide');
  } else {
    this.game.destroyBullet(this.id);
    this.game.createPixel(col.id, col.x, col.y);
    col.reduceHealth(this.damage);
  }
}

module.exports = Bullet;

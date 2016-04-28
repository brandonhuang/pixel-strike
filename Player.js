function Player(id) {
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.space = false;

  this.x = Math.random() * 2000;
  this.y = Math.random() * 2000;
  this.angle = Math.random() * 360 - 180;
  this.id = id;
  this.speed = 4;
}

Player.prototype.update = function(delta) {
  if(this.left) {
      angle -= speed * delta;
    } else if(this.right) {
      angle += speed * delta;
    }
}

module.exports = Player;

var Bullet = function(id, game, startX, startY) {
  var x = startX;
  var y = startY;

  this.game = game;
  this.alive = true;
  this.id = id;
  this.speed = 4;

  this.bullet = game.add.sprite(x, y, 'ship');

  // this.bullet.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.bullet.animations.add('stop', [3], 20, true);

  this.bullet.anchor.setTo(0.5, 0.5);

  this.bullet.name = id.toString();
  game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
  this.bullet.body.immovable = true;
  this.bullet.angle = game.rnd.angle();

  this.lastX = x;
  this.lastY = y;
}

Bullet.prototype.update = function() {
  if (this.bullet.x !== this.lastX || this.bullet.y !== this.lastY) {
    this.bullet.rotation = Math.PI + game.physics.arcade.angleToXY(this.bullet, this.lastX, this.lastY);
  }

  this.lastX = this.bullet.x;
  this.lastY = this.bullet.y;
}

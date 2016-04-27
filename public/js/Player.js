var RemotePlayer = function(id, game, startX, startY) {
  var x = startX;
  var y = startY;

  this.game = game;
  this.health = 3;
  this.alive = true;
  this.id = id;

  this.player = game.add.sprite(x, y, 'ship');

  // this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.player.animations.add('stop', [3], 20, true);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = id.toString();
  game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.immovable = true;
  this.player.body.collideWorldBounds = true;

  this.player.angle = game.rnd.angle();

  this.lastX = x;
  this.lastY = y;
}

RemotePlayer.prototype.update = function() {
  if (this.player.x !== this.lastX || this.player.y !== this.lastY) {
    this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastX, this.lastY);
  }

  this.lastX = this.player.x;
  this.lastY = this.player.y;
}

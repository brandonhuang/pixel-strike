var RemotePlayer = function(id, game, startX, startY, angle, health) {
  this.game = game;
  this.id = id;
  this.health = health;

  this.player = game.add.sprite(startX, startY, 'ship');
  this.player.angle = angle;

  // this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.player.animations.add('stop', [3], 20, true);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = id.toString();
}

RemotePlayer.prototype.update = function(player) {
  this.player.x = player.x;
  this.player.y = player.y;

  this.player.angle = player.angle;

  this.health = player.health;
  this.player.tint = hslToHex(this.health, 100, 60);
}

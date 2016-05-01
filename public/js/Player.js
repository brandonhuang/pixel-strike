var Player = function(id, game, startX, startY, angle, health) {
  this.game = game;
  this.id = id;
  this.health = health;

  this.player = game.add.sprite(startX, startY, 'ship');
  this.player.angle = angle;
  this.cameraPos = {x: startX, y: startY};
  this.lerp = 0.1;

  // this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.player.animations.add('stop', [3], 20, true);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = id.toString();
}

var frames = 0;

Player.prototype.update = function(player) {
  this.player.x = player.x;
  this.player.y = player.y;

  this.player.angle = player.angle;

  this.cameraPos.x += (this.player.x - this.cameraPos.x) * this.lerp;
  this.cameraPos.y += (this.player.y - this.cameraPos.y) * this.lerp;
  this.game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);

  this.health = player.health;
  this.player.tint = hslToHex(this.health, 100, 60);

  frames++;
}

setInterval(function() {
  var fps = frames / 10;
  console.log(fps);

  frames = 0;
}, 10000);

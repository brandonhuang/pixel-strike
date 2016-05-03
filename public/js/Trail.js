var Trail = function(game, startX, startY, angle) {
  this.game = game;

  this.trail = game.add.sprite(startX, startY, 'trail');
  this.trail.angle = angle;

  this.trail.anchor.setTo(0.5, 0.5);

  setTimeout(function() {
    this.trail.kill();
  }.bind(this), 2000);
}

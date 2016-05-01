var Pixel = function(id, game, startX, startY, angle, speed) {
  this.game = game;
  this.id = id;
  this.speed = speed;
  this.drag = 0.5;

  this.pixel = game.add.sprite(startX, startY, 'pixel');
  this.pixel.angle = angle;

  // this.pixel.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.pixel.animations.add('stop', [3], 20, true);


  this.pixel.anchor.setTo(0.5, 0.5);

  // game.physics.enable(this.pixel, Phaser.Physics.ARCADE);

  this.pixel.name = id.toString();
}

Pixel.prototype.update = function(pixel) {
  var delta = this.game.time.elapsed / 1000;
  // this.pixel.body.velocity.x = 0;
  // this.pixel.body.velocity.y = 0;

  // this.game.physics.arcade.velocityFromAngle(this.pixel.angle, this.speed, this.pixel.body.velocity);
  if(this.speed > 1) {
    console.log(this.pixel.x);
    this.pixel.x = this.pixel.x + Math.cos(this.pixel.angle * Math.PI/180) * this.speed * delta;
    this.pixel.y = this.pixel.y + Math.sin(this.pixel.angle * Math.PI/180) * this.speed * delta;
    this.speed = this.speed * (1 - (this.drag * delta));
  } else {
    this.speed = 0;
  }
}

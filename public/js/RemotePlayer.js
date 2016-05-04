var RemotePlayer = function(game, player) {
  this.game = game;
  this.id = player.id;
  this.health = player.health;

  this.rotationSpeed = player.rotationSpeed;
  this.cruiseSpeed = player.cruiseSpeed;
  this.maxSpeed = player.maxSpeed;
  this.speed = player.speed;
  this.acceleration = player.acceleration;
  this.drag = player.drag;

  this.left = false;
  this.right = false;
  this.up = false;
  this.shoot = false;

  this.player = game.add.sprite(player.x, player.y, 'ship');
  this.player.angle = player.angle;

   var style = { font: "10px Arial", fill: "white",  align: "center", backgroundColor: "transparent" };
  this.text = game.add.text(0, 0, player.name, style);
  this.text.anchor.setTo(0.5, 0.5);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = player.name.toString();

  this.player.tint = hslToHex(this.health, 100, 60);

  setInterval(function() {
    new Trail(this.game, this.player.x, this.player.y, this.player.angle, this.player.tint);
  }.bind(this), 200);
}

RemotePlayer.prototype.update = function(player) {
  // var delta = this.game.time.elapsed / 1000;

  // if(player) {
    this.player.x = player.x;
    this.player.y = player.y;
    // this.speed = player.speed;

    this.player.angle = player.angle;
    this.health = player.health;
    this.player.tint = hslToHex(this.health, 100, 60);
    // return;
  // }

  // if(this.left) {
  //   this.player.angle -= this.rotationSpeed * delta;
  // } else if(this.right) {
  //   this.player.angle += this.rotationSpeed * delta;
  // }

  // if(this.up) {
  //   if(this.speed < this.maxSpeed) {
  //     this.speed += this.acceleration * delta;
  //   }
  // } else if(this.speed > this.cruiseSpeed) {
  //   this.speed *= (1 - (this.drag * delta));
  // } else {
  //   this.speed = this.cruiseSpeed;
  // }

  // if(this.speed > 0) {
  //   this.player.x += Math.cos(this.player.angle * Math.PI/180) * this.speed * delta;
  //   this.player.y += Math.sin(this.player.angle * Math.PI/180) * this.speed * delta;
  // }
}

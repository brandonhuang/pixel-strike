var Player = function(game, player) {
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
  this.cameraPos = {x: player.x, y: player.y};
  this.lerp = 0.1;

  // this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
  // this.player.animations.add('stop', [3], 20, true);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = player.id.toString();

  this.player.tint = hslToHex(this.health, 100, 60);

  setInterval(function() {
    new Trail(this.game, this.player.x, this.player.y, this.player.angle);
  }.bind(this), 10);
}

var frames = 0;

Player.prototype.update = function(player) {
  var delta = this.game.time.elapsed / 1000;

  if(player) {
    this.player.x = player.x;
    this.player.y = player.y;
    this.speed = player.speed;

    this.player.angle = player.angle;
    this.health = player.health;
    this.player.tint = hslToHex(this.health, 100, 60);
    return;
  }

  if(this.left) {
    this.player.angle -= this.rotationSpeed * delta;
  } else if(this.right) {
    this.player.angle += this.rotationSpeed * delta;
  }

  if(this.up) {
    if(this.speed < this.maxSpeed) {
      this.speed += this.acceleration * delta;
    }
  } else if(this.speed > this.cruiseSpeed) {
    this.speed *= (1 - (this.drag * delta));
  } else {
    this.speed = this.cruiseSpeed;
  }

  if(this.speed > 0) {
    this.player.x += Math.cos(this.player.angle * Math.PI/180) * this.speed * delta;
    this.player.y += Math.sin(this.player.angle * Math.PI/180) * this.speed * delta;
  }

  // Update Camera
  this.cameraPos.x += (this.player.x - this.cameraPos.x) * this.lerp;
  this.cameraPos.y += (this.player.y - this.cameraPos.y) * this.lerp;
  this.game.camera.focusOnXY(this.cameraPos.x, this.cameraPos.y);

  frames++;
}

setInterval(function() {
  var fps = frames / 10;
  console.log(fps);

  frames = 0;
}, 10000);

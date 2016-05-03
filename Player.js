function Player(id, game) {
  this.game = game;

  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.boost = false;
  this.shoot = false;

  this.id = id;
  this.x = Math.random() * 2000;
  this.y = Math.random() * 2000;
  this.width = 18;
  this.height = 18;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.angle = Math.random() * 360 - 180;
  this.rotationSpeed = 175;

  this.cruiseSpeed = 150;
  this.maxSpeed = 300;
  this.speed = this.cruiseSpeed;
  this.acceleration = 300;
  this.drag = 0.9;

  this.health = 50;
  this.pixels = 0;
  
  this.shootDelay = 0.15;
  this.shootTime = this.shootDelay;

  this.getX = function() {
    return this.x - this.width * this.anchorX;
  };

  this.getY = function() {
    return this.y - this.height * this.anchorY;
  }
}

Player.prototype.public = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    angle: this.angle,
    rotationSpeed: this.rotationSpeed,
    health: this.health,
    speed: this.speed,
    cruiseSpeed: this.cruiseSpeed,
    maxSpeed: this.maxSpeed,
    acceleration: this.acceleration,
    drag: this.drag
  };
}

Player.prototype.update = function(delta) {
  if(this.left) {
    this.angle -= this.rotationSpeed * delta;
  } else if(this.right) {
    this.angle += this.rotationSpeed * delta;
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

  // if(this.down && this.speed > minSpeed) {
  //   this.speed *= (1 - (drag * delta));
  // } else if(this.down) {
  //   this.speed = minSpeed;
  // } else if(this.up) {
  //   this.speed = maxSpeed;
  // } else if(this.speed < cruiseSpeed) {
  //   this.speed = cruiseSpeed;
  // } else if(this.speed > cruiseSpeed) {
  //   this.speed *= (1 - (drag * delta));
  // }

  this.shootTime += delta;
  if(this.shoot) {
    if(this.shootTime >= this.shootDelay) {
      this.game.createBullet(this.id, this.x, this.y, this.angle);
      this.shootTime = 0;
    }
  }

  if(this.speed > 0) {
    this.x += Math.cos(this.angle * Math.PI/180) * this.speed * delta;
    this.y += Math.sin(this.angle * Math.PI/180) * this.speed * delta;
  }
}

Player.prototype.collide = function(col) {
  util.log(this.id, 'collided with', col.id);
}

Player.prototype.reduceHealth = function(damage) {
  this.health -= damage;
  if(this.health <= 0) {
    this.game.destroyPlayer(this.id);
    for(var i = 0; i < 50; i++) {
      this.game.createPixel(this.id, this.x, this.y, 1);
    }
  }
}

Player.prototype.collectPixel = function() { 
  if(this.health < 300) {
    this.health++;
  }
}

module.exports = Player;

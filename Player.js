function Player(id, name, game) {
  this.game = game;

  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.shoot = false;

  this.id = id;
  this.name = name;

  this.x = Math.random() * 2000;
  this.y = Math.random() * 2000;
  this.width = 20;
  this.height = 20;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.angle = Math.random() * 360 - 180;
  this.rotationSpeed = 175;

  this.cruiseSpeed = 150;
  this.maxSpeed = 300;
  this.maxBoostDuration = 2;
  this.boost = 2;
  this.speed = this.cruiseSpeed;
  this.acceleration = 300;
  this.drag = 0.95;

  this.health = 5;
  
  this.shootDelay = 0.4;
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
    // rotationSpeed: this.rotationSpeed,
    health: this.health,
    name: this.name,
    // speed: this.speed,
    // cruiseSpeed: this.cruiseSpeed,
    // maxSpeed: this.maxSpeed,
    // acceleration: this.acceleration,
    // drag: this.drag
  };
}

Player.prototype.update = function(delta) {
  if(this.left) {
    this.angle -= this.rotationSpeed * delta;
  } else if(this.right) {
    this.angle += this.rotationSpeed * delta;
  }

  if(this.up && this.boost > 0) {
    this.boost -= delta;
    if(this.speed < this.maxSpeed) {
      this.speed += this.acceleration * delta;
    }
  } else {
    if(this.boost < this.maxBoostDuration) {
      this.boost += 0.35 * delta;
    } else {
      this.boost = this.maxBoostDuration;
    }

    if(this.speed > this.cruiseSpeed) {
      this.speed *= (1 - (this.drag * delta));
    } else {
      this.speed = this.cruiseSpeed;
    }
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
  if(col.health > this.health) {
    this.reduceHealth(this.health);
    col.reduceHealth(Math.round(col.health / 2));
  } else {
    this.reduceHealth(Math.round(this.health / 2));
    col.reduceHealth(col.health);
  }
}

Player.prototype.kill = function() {
  // for(var i = 0; i < this.health; i++) {
  //   this.game.createPixel(this.id, this.x, this.y, this.health);
  // }
}

Player.prototype.reduceHealth = function(damage) {
  if((this.health - damage) > 0) {
    this.game.createPixel(this.id, this.x, this.y, this.health, damage);
  } else {
    for(var i = 0; i < damage; i++) {
      this.game.createPixel(this.id, this.x, this.y, 1, 1);
    }
  }

  this.health -= damage;

  if(this.health <= 0) {
    this.game.destroyPlayer(this.id);
  }
}

Player.prototype.collectPixel = function(health) {
  this.health += health;
  if(this.health > 320) {
    this.health = 320;
  }

  this.maxSpeed = 250 + this.health / 2;
  this.shootDelay = 0.4 - this.health / 1000;
}

module.exports = Player;

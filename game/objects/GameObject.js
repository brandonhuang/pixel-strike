class GameObject {
  constructor({id, game, x, y, width, height, anchorX, anchorY, angle, speed}) {
    // save reference to game for easy access
    this.game = game;
    // unique uuid
    this.id = id;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.angle = angle;
    this.speed = speed;
    this.drag = drag;
  }

  // Return coordinates of object's anchor
  getX() {  
    return this.x - (this.width * this.anchorX);
  }
  getY() {
    return this.y - (this.height * this.anchorY);
  }
}

module.exports = GameObject;


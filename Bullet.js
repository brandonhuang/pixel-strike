function Bullet(startX, startY, angle) {
  var x = startX;
  var y = startY;
  var angle = angle;
  var velocity = 4;
  var id;

  return {
    x: x,
    y: y,
    angle: angle,
    velocity: velocity,
    id: id
  }
}

module.exports = Bullet;

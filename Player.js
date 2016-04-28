function Player(_id) {
  var left, right, up, down, space = false;
  var x = Math.random() * 2000;
  var y = Math.random() * 2000;
  var angle = Math.random() * 360 - 180;
  var id = _id;
  var speed = 4;

  function onLeft(bool) {
    left = bool;
  }

  function onRight(bool) {
    right = bool;
  }

  function update(delta) {

    if(left) {
      angle -= speed * delta;
    }

    if(right) {
      angle += speed * delta;
    }

  }

  return {
    angle: angle,
    id: id,
    left: onLeft,
    right: onRight,
    up: up,
    down: down,
    space: space,
    update: update,
  }
}

module.exports = Player;

var socket = io(); // Socket connection
var stars;
var player;
var players = [];
var bullets = [];
var pixels = [];
var currentSpeed = 0;
var keys = {};
var startCoords = {};
var game;

socket.on('connect', function() {
  console.log('Socket connection started!');
});

game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('ship', 'assets/ship.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('stars', 'assets/stars.gif');
  game.load.image('pixel', 'assets/pixel.png');
}

function create() {
  setEventHandlers();
  setKeys();

  // Set world bounds
  game.world.setBounds(0, 0, 2000, 2000);

  // background stars
  stars = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'stars');
  stars.fixedToCamera = true;

  // Tell server the client is ready
  socket.emit('ready');
  socket.emit('start');
}

var cameraPos = {};
var lerp = 0.1;

function update() {
  updateBullets();
  updatePixels();

  //   // Shoot
  //   if(cursors.space.isDown) {
  //     console.log('shoot');
  //     socket.emit('shoot', {x: player.x, y: player.y, angle: player.angle});
  //   }

  //   if(game.input.activePointer.isDown) {
  //     if(game.physics.arcade.distanceToPointer(player) >= 10) {
  //       currentSpeed = 300;

  //       player.rotation = game.physics.arcade.angleToPointer(player);
  //     }
  //   }


  //   game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity)


  //   // Send location data to server if player is moving
  //   if(lastX !== player.x || lastY !== player.y) {
  //     socket.emit('move player', {x: player.x, y: player.y});
  //   }

  //   lastX = player.x;
  //   lastY = player.y;
  // }
  if(player) {
    // cameraPos.x += (player.player.x - cameraPos.x) * lerp;
    // cameraPos.y += (player.player.y - cameraPos.y) * lerp;
    // game.camera.focusOnXY(cameraPos.x, cameraPos.y);
    stars.tilePosition.x = -game.camera.x
    stars.tilePosition.y = -game.camera.y
  }
}

function updatePlayers() {
  for(var i = 0; i < players.length; i++) {
    players[i].update();
  }
}

function updateBullets() {
  for(var i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
}

function updatePixels() {
  for(var i = 0; i < pixels.length; i++) {
    pixels[i].update();
  }
}

function setKeys() {
  keys.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
  keys.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
  keys.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
  keys.boost = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  keys.shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  keys.left.onDown.add(emitLeftStart, this);
  keys.left.onUp.add(emitLeftStop, this);
  keys.right.onDown.add(emitRightStart, this);
  keys.right.onUp.add(emitRightStop, this);
  keys.up.onDown.add(emitUpStart, this);
  keys.up.onUp.add(emitUpStop, this);
  keys.boost.onDown.add(emitBoostStart, this);
  keys.boost.onUp.add(emitBoostStop, this);
  keys.shoot.onDown.add(emitShootStart, this);
  keys.shoot.onUp.add(emitShootStop, this);
}

// Server input functions
function emitLeftStart() {
  socket.emit('left', true);
}

function emitLeftStop() {
  socket.emit('left', false);
}

function emitRightStart() {
  socket.emit('right', true);
}

function emitRightStop() {
  socket.emit('right', false);
}

function emitUpStart() {
  socket.emit('up', true);
}

function emitUpStop() {
  socket.emit('up', false);
}

function emitBoostStart() {
  socket.emit('boost', true);
}

function emitBoostStop() {
  socket.emit('boost', false);
}

function emitShootStart() {
  socket.emit('shoot', true);
}

function emitShootStop() { 
  socket.emit('shoot', false);
}

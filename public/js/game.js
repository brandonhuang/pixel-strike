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
  game.load.image('trail', 'assets/trail.png');
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
  // updatePlayers();
  updateBullets();
  updatePixels();

  stars.tilePosition.x = -game.camera.x
  stars.tilePosition.y = -game.camera.y
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
  keys.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
  keys.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
  keys.boost = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  keys.shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  keys.left.onDown.add(emitLeftStart, this);
  keys.left.onUp.add(emitLeftStop, this);
  keys.right.onDown.add(emitRightStart, this);
  keys.right.onUp.add(emitRightStop, this);
  keys.up.onDown.add(emitUpStart, this);
  keys.up.onUp.add(emitUpStop, this);
  keys.down.onDown.add(emitDownStart, this);
  keys.down.onUp.add(emitDownStop, this);
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

function emitDownStart() {
  socket.emit('down', true);
}

function emitDownStop() {
  socket.emit('down', false);
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

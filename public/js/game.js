var socket = io(); // Socket connection
var stars;
var player;
var players = [];
var currentSpeed = 0;
var cursors;
var startCoords = {};
var game;

socket.on('connect', function() {
  console.log('Socket connection started!');
});

game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('ship', 'assets/ship.png');
  game.load.image('stars', 'assets/stars.gif');
}

function create() {
  setEventHandlers();
  
  // Set world bounds
  game.world.setBounds(0, 0, 2000, 2000);

  // background stars
  stars = game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'stars');
  stars.fixedToCamera = true;

  cursors = game.input.keyboard.createCursorKeys();
  cursors.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Tell server the client is ready
  socket.emit('ready');
  socket.emit('start');
}

var lastX, lastY;

function update() {
  updatePlayers();
  if(player) {
    
  console.log(player.angle)
  }

  if(player) {
    if(cursors.left.isDown) {
      player.angle -= 4;
    } else if(cursors.right.isDown) {
      player.angle += 4;
    }

    if(cursors.up.isDown) {
      // The speed we'll travel at
      currentSpeed = 300;
    } else {
      if (currentSpeed > 0) {
        currentSpeed -= 4;
      }
    }

    // Shoot
    if(cursors.space.isDown) {
      console.log('shoot');
      socket.emit('shoot', {x: player.x, y: player.y, angle: player.angle});
    }

    if(game.input.activePointer.isDown) {
      if(game.physics.arcade.distanceToPointer(player) >= 10) {
        currentSpeed = 300;

        player.rotation = game.physics.arcade.angleToPointer(player);
      }
    }

    stars.tilePosition.x = -game.camera.x
    stars.tilePosition.y = -game.camera.y

    game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity)


    // Send location data to server if player is moving
    if(lastX !== player.x || lastY !== player.y) {
      socket.emit('move player', {x: player.x, y: player.y});
    }

    lastX = player.x;
    lastY = player.y;
  }
}

function updatePlayers() {
  for (var i = 0; i < players.length; i++) {
    players[i].update();
    game.physics.arcade.collide(player, players[i].player);
  }
}

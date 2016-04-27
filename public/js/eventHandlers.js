var setEventHandlers = function() {
  socket.on('disconnect', onDisconnect);
  socket.on('spawn', onSpawn)
  socket.on('new player', onNewPlayer);
  socket.on('move player', onMovePlayer);
  socket.on('remove player', onRemovePlayer);
}

function onDisconnect(data) {
  var removePlayer = playerById(data.id);

  // Player not found
  if (!removePlayer) {
    console.error('Player with', data.id, 'is not found!')
    return;
  }

  removePlayer.player.kill();
  players.splice(players.indexOf(removePlayer), 1);
}

function onSpawn(startCoords) {
  player = game.add.sprite(startCoords.x, startCoords.y, 'ship');
  player.anchor.setTo(0.5, 0.5);

  // Enable physics
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;

  // Camera follows player
  game.camera.follow(player);
  game.camera.focusOnXY(0, 0);
}

function onNewPlayer(data) {
  console.log('new player connected', data);

  var newPlayer = new RemotePlayer(data.id, game, data.x, data.y);
  players.push(newPlayer);
}

function onMovePlayer(data) {
  var movePlayer = playerById(data.id);

  if(!movePlayer) {
    console.error('Player with', data.id, 'is not found!');
    return;
  }

  movePlayer.player.x = data.x;
  movePlayer.player.y = data.y;
}

function onRemovePlayer(data) {
  console.log('player left', data);

  var removePlayer = playerById(data.id)

  // Player not found
  if(!removePlayer) {
    console.log('Player not found: ', data.id);
    return;
  }

  removePlayer.player.kill();

  // Remove player from array
  players.splice(enemies.indexOf(removePlayer), 1);
}

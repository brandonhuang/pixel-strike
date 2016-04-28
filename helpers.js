module.exports = {
  playerById: function(id, players) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        return players[i];
      }
    }
    return false;
  }
}

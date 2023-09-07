const socketHelpers = {
  sendUpdate(socket, gameState) {
    socket.emit('gameState', JSON.stringify(gameState));
  }
};

module.exports = { socketHelpers };

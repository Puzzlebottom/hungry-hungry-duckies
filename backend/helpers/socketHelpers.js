const socketHelpers = {
  sendUpdate(socket, gameState) {
    socket.emit('gameState', gameState);
  }
};

module.exports = { socketHelpers };

const { updatePlayerName, updatePlayerScore } = require('../db/queries/players');

const connectPlayer = (socket, game, db) => {
  let interval;

  sendUpdate = (gameState) => {
    socket.emit('gameState', gameState);
  };

  createUpdateInterval = () => {
    return setInterval(() => {
      sendUpdate(game.getGameStateForSocketId(socket.id));
    }, 25);
  };

  socket.on('join', (player) => {
    game.addPlayer(player.name, socket.id);
    interval = createUpdateInterval();
    updatePlayerName(db, { ...player });
  });

  socket.on('ready', () => {
    console.log('ready');
    game.togglePlayerReady(socket.id);
  });

  socket.on('munch', () => {
    game.doMunch(socket.id);
  });

  socket.on('message', (message) => {
    game.doMessage(socket.id, message);
  });

  socket.on('home', () => {
    game.reset();
  });

  socket.on('newgame', (name) => {
    game.reset();
    game.addPlayer(name, socket.id);
  });

  socket.on('update', (player) => {
    updatePlayerScore(db, player);
  });

  socket.on('disconnect', () => {
    clearInterval(interval);
    game.removePlayer(socket.id);
    sendUpdate(game.getGameStateForSocketId(socket.id));
    socket.removeAllListeners();
    console.log('user disconnected');
  });
};

module.exports = connectPlayer;

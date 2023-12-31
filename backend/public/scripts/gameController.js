const Game = require('../scripts/game');
const db = require('../../db/connection');
const { updatePlayerName, updatePlayerScore } = require('../../db/queries/players');

class GameController {
  constructor() {
    this.games = {};
  }

  getGame() {
    const game = Object.values(this.games).find(game => !game.isFull()) || new Game();
    this.games[game.id] = game;
    return game;
  }

  connectSocketToGame(socket) {
    let game;
    let interval;

    const sendUpdate = (gameState) => {
      socket.emit('gameState', gameState);
    };

    const createUpdateInterval = () => {
      return setInterval(() => {
        sendUpdate(game.getGameStateForSocketId(socket.id));
      }, 25);
    };

    socket.on('join', (player, gameId) => {
      game = this.getGame();
      interval = createUpdateInterval();
      game.addPlayer(player.name, socket.id);
      updatePlayerName(db, { ...player });
    });

    socket.on('ready', () => {
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

    socket.onAny(() => {
      clearTimeout(socket?.inactivityTimeout);

      socket.inactivityTimeout = setTimeout(() => {
        if (game) {
          const player = game.findPlayerBySocketId(socket.id);
          if (player.inGame) {
            socket.disconnect(true);
          }
        };
      }, 1000 * 30);
    });

    socket.on('disconnect', () => {
      clearInterval(interval);

      if (game) {
        game.removePlayer(socket.id);
        sendUpdate(game.getGameStateForSocketId(socket.id));
        if (game.isEmpty()) delete this.games[game.id];
      }

      socket.removeAllListeners();
      console.log('user disconnected');
    });
  }
}

module.exports = GameController;

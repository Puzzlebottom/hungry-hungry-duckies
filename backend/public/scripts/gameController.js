// create and provision games
// games get a room on the socket server
// add players to games
// remove games

const { socketHelpers } = require("../../helpers/socketHelpers");

class GameController {
  constructor(socketServer, dbConnection) {
    this.socketServer = socketServer;
    this.dbConnection = dbConnection;
    this.games = {};
  }

  run() {
    this.socketServer.onConnection((socket) => {
      console.log('a user connected');

      const game = this.findOrCreateGame();

      socketHelpers.addListeners(socket, game);
    });
  }

  findOrCreateGame() {
    let game = Object.values(this.games).find(game => !game.isFull());
    if (!game) {
      game = new Game();
      this.games[game.id] = game;
    }
    return game;
  }


}

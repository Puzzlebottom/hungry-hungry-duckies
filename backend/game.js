const Instance = require('./physics');

const Game = {
  state: { bugs: [], players: [], isActive: false },
  physics: {},
  playerIndex: {},

  initialize() {
    this.physics = Instance.run();
    const initialState = { bugs: [], player: {}, opponents: [], isActive: false };
    return initialState;
  },

  start() {
    this.physics.addBugs(25);
    this.state.bugs = this.physics.getBugUpdate();
    this.state.isActive = true;

    console.log('STATE: ', this.state);

    return this;
  },

  addPlayer(player, socketId) {
    const seat = player.current_seat || this.state.players.length;
    const score = player.current_score || 0;
    const newPlayer = { name: player.name, current_score: score, current_seat: seat, isMunching: false, isReady: false, socketId };
    this.state.players = [...this.state.players, newPlayer];

    return newPlayer;
  },

  getGameStateForSocketId(socketId) {
    const { bugs, players, isActive } = this.state;

    if (Object.keys(players).length === 0) return {};

    const player = players.find(player => player.socketId === socketId) || {};
    const playerSeat = player.current_seat;

    const opponents = [0, 1, 2, 3]
      .filter(i => i !== playerSeat)
      .map(i => players[i])
      .filter(p => p);

    const sanitizePlayer = (player) => {
      const sanitizedPlayer = { ...player };
      delete sanitizedPlayer.socketId;
      return sanitizedPlayer;
    };

    const bugData = bugs.map(bug => { return { id: bug.id, position: bug.position, velocity: bug.velocity }; });

    return { bugs: bugData, player: sanitizePlayer(player), opponents: opponents.map(sanitizePlayer), isActive };
  }
};


module.exports = Game;

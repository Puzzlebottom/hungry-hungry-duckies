const Instance = require('./physics');

const Game = {
  state: { bugs: [], players: {}, isActive: false },
  physics: {},

  initialize() {
    this.physics = Instance.run();
  },

  start() {
    this.state.isActive = true;
    setTimeout(() => {
      this.physics.addBugs(1);
      this.state.bugs = this.physics.getBugUpdate();
    }, 3000);
  },

  end() {
    for (player of Object.values(this.state.players)) {
      player.inGame = false;
    }
    setTimeout(() => {
      this.state.isActive = false;
    }, 3000);
  },

  reset() {
    for (player of Object.values(this.state.players)) {
      if (!player.inGame) delete this.state.players[player.current_seat];
    }
  },

  findPlayerBySocketId(socketId) {
    const seat = [0, 1, 2, 3].find(seat => this.state.players[seat]?.socketId === socketId);
    return seat !== undefined ? this.state.players[seat] : {};
  },

  findFirstAvailableSeat() {
    const seat = [0, 1, 2, 3].find(seat => !this.state.players[seat]);
    return seat;
  },

  addPlayer(name, socketId) {
    const seat = this.findFirstAvailableSeat();
    const newPlayer = { name, current_score: 0, current_seat: seat, isMunching: false, isReady: false, inGame: true, socketId, showMessage: false };
    this.state.players[seat] = newPlayer;
  },

  removePlayer(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (Object.keys(player).length) delete this.state.players[player.current_seat];
  },

  togglePlayerReady(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (Object.keys(player).length) player.isReady = !player.isReady;
    if (this.allReady()) this.start();
  },

  doMunch(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (!this.state.bugs.length) return;

    player.isMunching = true;
    const munched = this.physics.processMunch(player.current_seat);
    player.current_score += munched;
    this.state.bugs = this.physics.getBugUpdate();

    if (this.outOfBugs()) this.end();

    setTimeout(() => {
      player.isMunching = false;
    }, 285);
  },

  doMessage(socketId, message) {
    const player = this.findPlayerBySocketId(socketId);
    if (!this.state.bugs.length) return;
    if (!this.state.isActive) return;
    if (player.showMessage) return;
    player.showMessage = message;
    setTimeout(() => {
      player.showMessage = false;
    }, 15000);
  },

  outOfBugs() {
    return this.state.bugs.length === 0;
  },

  allReady() { return !Object.values(this.state.players).some(player => !player.isReady); },

  isFull() { return Object.keys(this.state.players).length >= 4; },

  getGameStateForSocketId(socketId) {
    const { bugs, players, isActive } = this.state;

    const player = this.findPlayerBySocketId(socketId);
    const opponents = Object.values(players).filter(player => player.socketId !== socketId);

    const sanitizePlayer = (player) => {
      const sanitizedPlayer = { ...player };
      delete sanitizedPlayer.socketId;
      return sanitizedPlayer;
    };

    const bugData = bugs.map(bug => { return { id: bug.id, position: bug.position, velocity: bug.velocity, angle: bug.angle }; });
    return { bugs: bugData, player: sanitizePlayer(player), opponents: opponents.map(sanitizePlayer), isActive };
  }
};


module.exports = Game;

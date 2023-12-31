const Instance = require('./physics');
const { v4: uuidv4 } = require('uuid');

class Game {
  constructor() {
    this.state = { bugs: [], players: {}, isActive: false };
    this.physics = Instance.run();
    this._id = uuidv4();
  }

  get id() {
    return this._id;
  }

  start() {
    this.state.isActive = true;
    setTimeout(() => {
      this.physics.addBugs(25);
      this.state.bugs = this.physics.getBugUpdate();
    }, 3000);
  }

  end() {
    for (const player of Object.values(this.state.players)) {
      player.inGame = false;
    }
    setTimeout(() => {
      this.state.isActive = false;
    }, 3000);
  }

  reset() {
    for (const player of Object.values(this.state.players)) {
      if (!player.inGame) delete this.state.players[player.current_seat];
    }
  }

  findPlayerBySocketId(socketId) {
    const seat = [0, 1, 2, 3].find(seat => this.state.players[seat]?.socketId === socketId);
    return seat !== undefined ? this.state.players[seat] : {};
  }

  findFirstAvailableSeat() {
    const seat = [0, 1, 2, 3].find(seat => !this.state.players[seat]);
    return seat;
  }

  addPlayer(name, socketId) {
    const seat = this.findFirstAvailableSeat();
    const newPlayer = { name, current_score: 0, current_seat: seat, isMunching: false, isReady: false, inGame: true, socketId, showMessage: false };
    this.state.players[seat] = newPlayer;
  }

  removePlayer(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (Object.keys(player).length) delete this.state.players[player.current_seat];
  }

  togglePlayerReady(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (Object.keys(player).length) player.isReady = !player.isReady;
    if (this.allReady()) this.start();
  }

  doMunch(socketId) {
    const player = this.findPlayerBySocketId(socketId);
    if (!this.state.bugs.length || player.isMunching) return;

    player.isMunching = true;
    const munched = this.physics.processMunch(player.current_seat);
    player.current_score += munched;
    this.state.bugs = this.physics.getBugUpdate();

    if (this.outOfBugs()) this.end();

    setTimeout(() => {
      player.isMunching = false;
    }, 285);
  }

  doMessage(socketId, messageObj) {
    const player = this.findPlayerBySocketId(socketId);
    const { timeOut, message } = messageObj;
    if (!this.state.bugs.length) return;
    if (!this.state.isActive) return;
    if (player.showMessage) return;
    player.showMessage = message;
    setTimeout(() => {
      player.showMessage = false;
    }, timeOut);
  }

  outOfBugs() {
    return this.state.bugs.length === 0;
  }

  allReady() { return !Object.values(this.state.players).some(player => !player.isReady); }

  isFull() { return Object.keys(this.state.players).length >= 4; }

  isEmpty() { return Object.keys(this.state.players).length === 0; }

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

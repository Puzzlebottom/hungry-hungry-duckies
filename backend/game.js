const Instance = require('./physics');

const Game = {
  state: { bugs: [], players: [], isActive: false },
  physics: {},

  initialize() {
    this.physics = Instance.run();
  },

  start() {
    this.state.isActive = true;
    this.physics.addBugs(10);
    this.state.bugs = this.physics.getBugUpdate();
  },

  end() {
    setTimeout(() => {
      this.state.isActive = false, 3000;
      this.start();
    });
  },

  reset() {
    this.state = { bugs: [], players: [], isActive: false };
  },

  addPlayer(name, socketId) {
    const existingPlayer = this.state.players.find(player => player.socketId === socketId);

    if (existingPlayer) {
      existingPlayer.name = name;
      return;
    }

    const filledSeats = this.state.players.reduce((seats, player) => { return [...seats, player.current_seat]; }, []);
    const availableSeats = [];
    for (let i = 0; i < 4; i++) {
      if (!filledSeats.includes(i)) availableSeats.push(i);
    }
    if (availableSeats.length === 0) return;
    const firstAvailableSeat = availableSeats[0];

    const newPlayer = { name, current_score: 0, current_seat: firstAvailableSeat, isMunching: false, isReady: false, socketId };
    this.state.players = [...this.state.players, newPlayer];
  },

  removePlayer(socketId) {
    this.state.players = this.state.players.filter(player => player.socketId !== socketId);
  },

  togglePlayerReady(socketId) {
    const [player] = this.state.players.filter(player => player.socketId === socketId);
    player.isReady = !player.isReady;

    if (this.allReady()) this.start();
  },

  doMunch(socketId) {
    const [player] = this.state.players.filter(player => player.socketId === socketId);
    if (!this.state.isActive || player.isMunching) return;

    player.isMunching = true;
    const munched = this.physics.processMunch(player.current_seat);
    player.current_score += munched;
    this.state.bugs = this.physics.getBugUpdate();

    if (this.outOfBugs()) this.end();

    setTimeout(() => {
      player.isMunching = false;
    }, 285);
  },

  outOfBugs() {
    return this.state.bugs.length === 0;
  },

  allReady() {
    const allPlayers = this.state.players;
    const readyPlayers = allPlayers.filter(player => player.isReady);

    return allPlayers.length === readyPlayers.length;
  },

  isFull() { return this.state.players.length >= 4; },

  getGameStateForSocketId(socketId) {
    const { bugs, players, isActive } = this.state;

    // if (Object.keys(players).length === 0) return { bugs: [], player: {}, opponents: [], isActive: false };

    const player = players.find(player => player.socketId === socketId) || {};
    const playerSeat = player['current_seat'];

    // console.log('PLAYER: ', player);
    // console.log('PLAYERSEAT: ', playerSeat);

    const opponents = [0, 1, 2, 3]
      .filter(i => i !== playerSeat)
      .map(i => players[i])
      .filter(p => p);

    const sanitizePlayer = (player) => {
      const sanitizedPlayer = { ...player };
      delete sanitizedPlayer.socketId;
      return sanitizedPlayer;
    };

    const bugData = bugs.map(bug => { return { id: bug.id, position: bug.position, velocity: bug.velocity, angle: bug.angle }; });

    // console.log({ bugs: bugData, player: sanitizePlayer(player), opponents: opponents.map(sanitizePlayer), isActive });
    return { bugs: bugData, player: sanitizePlayer(player), opponents: opponents.map(sanitizePlayer), isActive };
  }
};


module.exports = Game;

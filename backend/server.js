// Load .env data into process.env
const ENV = require("./environment");
const PORT = process.env.PORT || 8080;

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const { socketHelpers } = require('./helpers/socketHelpers');
const Game = require('./public/scripts/game');

const app = express();

app.use(cors({ credentials: true, origin: 'https://hungry-hungry-duckies.netlify.app', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes
const db = require('./db/connection');
const index = require('./routes/index');
const players = require('./routes/players');
const api = require('./routes/players-api');

app.use('/', index(db));
app.use('/players', players(db));
app.use('/api/players', api(db));

const httpServer = require('http').createServer(app); // Create an HTTP server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: 'https://hungry-hungry-duckies.netlify.app', // Allow requests from this origin
  },
});

const { updatePlayerName, updatePlayerScore } = require('./db/queries/players');
const { sendUpdate } = socketHelpers;

Game.initialize();

io.use((socket, next) => {
  if (Game.isFull()) {
    return next(new Error('Server is full'));
  }
  next();
});

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  let interval;

  const runUpdater = () => {
    const updater = setInterval(() => {
      sendUpdate(socket, Game.getGameStateForSocketId(socket.id));
    }, 25);
    return updater;
  };

  socket.on('join', (player) => {
    Game.addPlayer(player.name, socket.id);
    interval = runUpdater();
    updatePlayerName(db, { ...player });
  });

  socket.on('ready', () => {
    Game.togglePlayerReady(socket.id);
  });

  socket.on('munch', (timeOut) => {
    Game.doMunch(socket.id, timeOut);
  });

  socket.on('message', (message) => {
    Game.doMessage(socket.id, message);
  });

  socket.on('home', () => {
    Game.reset();
  });

  socket.on('newgame', (name) => {
    Game.reset();
    Game.addPlayer(name, socket.id);
  });

  socket.on('update', (player) => {
    updatePlayerScore(db, player);
  });

  socket.on('disconnect', () => {
    clearInterval(interval);
    Game.removePlayer(socket.id);
    sendUpdate(socket, Game.getGameStateForSocketId(socket.id));
    socket.removeAllListeners();
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

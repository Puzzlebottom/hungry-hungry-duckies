// Load .env data into process.env
require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const playerQueries = require('./db/queries/players');
const { socketHelpers } = require('./helpers/socketHelpers');
const Game = require('./game');

const app = express();
const httpServer = require('http').createServer(app); // Create an HTTP server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from this origin
  },
});

const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes
app.use('/', require('./routes'));
app.use('/api/players', require('./routes/players-api'));

const { updatePlayerName } = playerQueries;
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
    updatePlayerName({ ...player });
  });

  socket.on('ready', () => {
    Game.togglePlayerReady(socket.id);
  });

  socket.on('munch', () => {
    Game.doMunch(socket.id);
  });

  socket.on('home', () => {
    Game.reset();
  });

  socket.on('newgame', (name) => {
    Game.reset();
    Game.addPlayer(name, socket.id);
  });

  socket.on('update', (player) => {
    console.log('update', player);
    playerQueries.updatePlayerScore(player);
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

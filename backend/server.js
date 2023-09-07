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

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  const gameState = Game.initialize();

  sendUpdate(socket, gameState);

  socket.on('join', (player) => {
    updatePlayerName({ ...player });
    Game.addPlayer(player, socket.id);
    sendUpdate(socket, Game.getGameStateForSocketId(socket.id));
  });

  socket.on('ready', () => {
    sendUpdate(socket, Game.getGameStateForSocketId(socket.id));
  });

  socket.on('munch', () => {
    gameState.player.isMunching = true;
    sendUpdate(socket, gameState);

    setTimeout(() => {
      gameState.player.isMunching = false;
      sendUpdate(socket, gameState);
    }, 285);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

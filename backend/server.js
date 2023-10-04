// Load .env data into process.env
const ENV = require("./environment");
const ORIGIN = ENV === 'development' ? 'http://localhost:5173' : 'https://hungry-hungry-duckies.netlify.app';
const PORT = process.env.PORT || 8080;

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const api = require('./routes/players-api');
const db = require('./db/connection');
const index = require('./routes/index');
const players = require('./routes/players');
const GameController = require('./public/scripts/gameController');
const { Server } = require('socket.io');

const app = express();
app.use(cors({ credentials: true, origin: ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', index(db));
app.use('/players', players(db));
app.use('/api/players', api(db));

const httpServer = require('http').createServer(app);
const websocketServer = new Server(httpServer, { cors: { origin: ORIGIN } });
const gameController = new GameController();

websocketServer.on('connection', (socket) => {
  gameController.connectSocketToGame(socket);
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

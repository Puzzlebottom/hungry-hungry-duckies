// Load .env data into process.env
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const db = require('./db/connection');
const playerQueries = require('./db/queries/players');
const socketHelpers = require('./helpers/socketHelpers');


const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
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
app.use('/api/players', require('./routes/users-api'));


io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join', (playerNameObj) => {
    const { cookie_uuid, name } = playerNameObj;
    const socketFunction = (data) => {
      socket.emit('joinReply', { 'name': data });
    };

    playerQueries.getPlayerByUUID(cookie_uuid)
      .then(data => {
        if(data.rows[0]) {
          console.log('player exists');
          socketHelpers.compareName(data.rows[0].name, name, cookie_uuid, socketFunction);
        } else {
          console.log('player does not exist');
          socketHelpers.createNewPlayer(cookie_uuid, name, socketFunction);
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

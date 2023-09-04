// Load .env data into process.env
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const db = require('./db/connection');
const playerQueries = require('./db/queries/players');


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
app.use(cors({ credentials: true, origin: 'http://localhost:5173', methods: ['GET', 'POST'] }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/players', require('./routes/users-api'));

// Runs cookie check on page load and returns cookie_uuid
app.get('/', (req, res) => {
  const {cookie_uuid} = req.cookies
  console.log('HELLO: ', cookie_uuid)

  if(cookie_uuid) {
    console.log('cookie_uuid present');
    playerQueries.getPlayerByUUID(cookie_uuid)
      .then(data => {
        if(data.rows[0]) {
          res.json({ 'cookie_uuid': data.rows[0].cookie_uuid, 'name': data.rows[0].name })
        } else {
          const cookie_uuid = uuidv4();
          res.json({cookie_uuid, 'name': null});
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });
  } else {
    const cookie_uuid = uuidv4();
    res.json({ cookie_uuid, 'name': null });
    }
});

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('playerName', (playerNameObj) => {
    console.log('playerName: ' + playerNameObj.name);
    console.log('cookie_uuid: ' + playerNameObj.cookie_uuid);
    const { cookie_uuid, name } = playerNameObj;
    playerQueries.getPlayerByUUID(cookie_uuid)
      .then(data => {
        if(data.rows[0]) {
          console.log('player exists');
          if(data.rows[0].name !== name) {
            console.log('name changed');
            playerQueries.updatePlayerName(cookie_uuid, name)
              .then(data => {
                socket.emit('serverReply', {'msg': `server says: name => ${data.rows[0].name}`, 'name': data.rows[0].name});
              })
              .catch(err => {
                console.log('err: ', err);
              });
          } else {
            socket.emit('serverReply', {'msg': `server says: name => ${data.rows[0].name}`, 'name': data.rows[0].name});
          }
        } else {
          console.log('player does not exist');
          playerQueries.addPlayer(cookie_uuid, name)
            .then(data => {
              socket.emit('serverReply', {'msg': `server says: name => ${data.rows[0].name}`, 'name': data.rows[0].name});
            })
            .catch(err => {
              console.log('err: ', err);
            });
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });


    socket.emit('serverReply', `server says: name => ${playerNameObj.name}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

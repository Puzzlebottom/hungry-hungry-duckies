// Load .env data into process.env
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const db = require('./db/connection');


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
  if(req.cookies.cookie_uuid) {
    console.log('cookie_uuid present');
    const query = `
      SELECT * FROM players
      WHERE cookie_uuid = $1;
    `;
    const values = [req.cookies.cookie_uuid];
    db.query(query, values)
      .then(data => {
        if(data.rows[0]) {
          res.json(data.rows[0].cookie_uuid)
        } else {
          const cookie_uuid = uuidv4();
          res.json(cookie_uuid);
        }
      })
      .catch(err => {
        console.log('err: ', err);
      });
  } else {
    const cookie_uuid = uuidv4();
    res.json(cookie_uuid);
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

  socket.on('playerName', (name) => {
    console.log('playerName: ' + name);

    socket.emit('serverReply', `server says: name => ${name}`);
  });

  // You can handle other socket.io events here
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

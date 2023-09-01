// load .env data into process.env
require('dotenv').config();

const morgan = require('morgan');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
});


const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
  console.log('SLASH GOTTEN');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

// Load .env data into process.env
require('dotenv').config();

const morgan = require('morgan');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app); // Create an HTTP server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: 'http://127.0.0.1:5173', // Allow requests from this origin
  },
});

const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('SLASH GOTTEN');
  res.send('Hello World!'); // Respond to the root route
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // You can handle other socket.io events here
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

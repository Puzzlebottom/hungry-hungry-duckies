// load .env data into process.env
require('dotenv').config();


const morgan = require('morgan');

//express server set
const express = require('express');
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//socket server setup
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });


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

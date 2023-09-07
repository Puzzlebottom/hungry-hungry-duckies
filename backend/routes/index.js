const express = require('express');
const router = express.Router();
const playerQueries = require('../db/queries/players');
const { v4: uuidv4 } = require('uuid');

// Runs cookie check on page load and returns cookie_uuid and player name

router.get('/', (req, res) => {
  const { addOrUpdatePlayer } = playerQueries;
  const cookie = req.cookies.player;
  console.log('COOKIES: ', req.cookies);

  const uuid = cookie ? cookie : uuidv4();

  addOrUpdatePlayer(uuid)
    .then(result => {
      res.send({ name: result.name, uuid: result.cookie_uuid });
    });
});

module.exports = router;

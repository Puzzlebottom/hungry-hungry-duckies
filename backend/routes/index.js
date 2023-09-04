const express = require('express');
const router  = express.Router();
const playerQueries = require('../db/queries/players');
const { v4: uuidv4 } = require('uuid');

// Runs cookie check on page load and returns cookie_uuid and player name

router.get('/', (req, res) => {
  const {cookie_uuid} = req.cookies

  if(cookie_uuid) {
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

module.exports = router;

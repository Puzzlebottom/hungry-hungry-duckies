const express = require('express');
const router = express.Router();
const {addOrUpdatePlayer} = require('../db/queries/players');
const { v4: uuidv4 } = require('uuid');


router.get('/', (req, res) => {
  const uuid = uuidv4()

  addOrUpdatePlayer(uuid)
  .then(result => {
    res.send({ name: result.name, uuid: result.uuid });
  });
})

router.get('/players/:uuid', (req, res) => {
  const uuid = req.params.uuid;

  addOrUpdatePlayer(uuid)
    .then(result => {
      res.send({ name: result.name, uuid: result.uuid });
    });
});

module.exports = router;

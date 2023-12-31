const router = require('express').Router();
const { addOrUpdatePlayer } = require('../db/queries/players');
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
  router.get('/', (req, res) => {
    const uuid = uuidv4();

    addOrUpdatePlayer(db, uuid)
      .then(result => {
        res.send({ name: result.name, uuid: result.uuid });
      });
  });

  return router;
}


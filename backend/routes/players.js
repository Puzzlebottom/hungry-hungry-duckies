const router = require('express').Router();
const { addOrUpdatePlayer } = require('../db/queries/players');

module.exports = (db) => {
  router.get('/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    addOrUpdatePlayer(db, uuid)
      .then(result => {
        res.send({ name: result.name, uuid: result.uuid });
      });
  });

  return router;
};

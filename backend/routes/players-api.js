const router = require('express').Router();
const { getTopPlayers } = require('../db/queries/players');


module.exports = (db) => {
  router.get('/', (req, res) => {
    getTopPlayers(db)
      .then(result => {
        res.send({ players: result.rows });
      })
      .catch(err => {
        res.status(500).send({ error: err.message });
      });
  });

  return router;
};

const db = require('../connection');

const getAllPlayers = () => {
  const query = `
    SELECT * FROM players;
  `;
  return db.query(query);
}

const getTopPlayers = () => {
  const query = `
    SELECT * FROM players
    ORDER BY hi_score DESC
    LIMIT 10;
  `;
  return db.query(query);
}

module.exports = { getAllPlayers, getTopPlayers };

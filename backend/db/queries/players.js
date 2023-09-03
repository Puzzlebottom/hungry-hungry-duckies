const db = require('../connection');

const getAllPlayers = () => {
  const query = `
    SELECT * FROM players;
  `;
  return db.query(query);
}

exports.getAllPlayers = getAllPlayers;

const db = require('../connection');

const getAllPlayers = () => {
  const query = `
    SELECT * FROM players;
  `;
  return db.query(query);
};

const getTopPlayers = () => {
  const query = `
    SELECT name, total_score FROM players
    WHERE total_score > 0 AND name != ''
    ORDER BY total_score DESC;
  `;
  return db.query(query);
};

const updatePlayerName = ({ name, uuid }) => {
  const query = `
    UPDATE players
    SET name = $1
    WHERE uuid = $2
  `;
  const values = [name, uuid];
  return db.query(query, values);
};

const addOrUpdatePlayer = async (uuid) => {
  let result = await db.query('SELECT * FROM players WHERE uuid = $1', [uuid]);
  let player = result.rows[0];

  if (player) {
    return player;
  };

  result = await db.query('INSERT INTO players (name, uuid) VALUES ($1, $2) RETURNING *;', ['', uuid]);
  return result.rows[0];
};

const updatePlayerScore = ({ uuid, current_score }) => {
  const query = `
    UPDATE players
    SET total_score = total_score + $1
    WHERE uuid = $2
  `;
  const values = [current_score, uuid];
  return db.query(query, values);
};

module.exports = { getAllPlayers, getTopPlayers, updatePlayerName, addOrUpdatePlayer, updatePlayerScore };

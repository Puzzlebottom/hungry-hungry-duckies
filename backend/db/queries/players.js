const db = require('../connection');

const getAllPlayers = () => {
  const query = `
    SELECT * FROM players;
  `;
  return db.query(query);
};

const getTopPlayers = () => {
  const query = `
    SELECT * FROM players
    ORDER BY hi_score DESC
    LIMIT 10;
  `;
  return db.query(query);
};

const updatePlayerName = (name, uuid) => {
  const query = `
    UPDATE players
    SET name = $1
    WHERE cookie_uuid = $2
    RETURNING *;
  `;
  const values = [name, uuid];
  return db.query(query, values);
};

const addOrUpdatePlayer = async (uuid) => {
  let result = await db.query('SELECT * FROM players WHERE cookie_uuid = $1', [uuid]);
  let player = result.rows[0];

  if (player) {
    return player;
  };

  result = await db.query('INSERT INTO players (name, cookie_uuid) VALUES ($1, $2) RETURNING *;', ['', uuid]);
  return result.rows[0];
};


module.exports = { getAllPlayers, getTopPlayers, updatePlayerName, addOrUpdatePlayer };

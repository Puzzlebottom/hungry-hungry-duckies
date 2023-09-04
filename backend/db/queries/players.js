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

const getPlayerByUUID = (UUID) => {
  const query = `
    SELECT * FROM players
    WHERE cookie_uuid = $1;
  `;
  const values = [UUID];
  return db.query(query, values);
}

const updatePlayerName = (UUID, name) => {
  const query = `
    UPDATE players
    SET name = $1
    WHERE cookie_uuid = $2
    RETURNING *;
  `;
  const values = [name, UUID];
  return db.query(query, values);
}

const addPlayer = (UUID, name) => {
  const query = `
    INSERT INTO players (cookie_uuid, name)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [UUID, name];
  return db.query(query, values);
}


module.exports = { getAllPlayers, getTopPlayers, getPlayerByUUID, updatePlayerName, addPlayer };

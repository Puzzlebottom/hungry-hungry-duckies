// PG database client/connection setup
const { Client } = require('pg');

const dbParams = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
};

const db = new Client(dbParams);

db.connect();

module.exports = db;

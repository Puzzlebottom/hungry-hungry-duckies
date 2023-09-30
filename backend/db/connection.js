// PG database client/connection setup
const pg = require('pg');

let dbParams = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
};

if (process.env.NODE_ENV === 'production') {
  dbParams = {
    connectionString: process.env.DATABASE_URL || "",
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  };
}


const db = new pg.Client(dbParams);

db.connect();

module.exports = db;

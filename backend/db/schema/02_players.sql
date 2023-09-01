-- Drop and recreate players table

DROP TABLE IF EXISTS players CASCADE;
CREATE TABLE players (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  hi_score integer NOT NULL DEFAULT 0,
  cookie_uuid UUID NOT NULL,
  game_id NOT NULL DEFAULT 0,
  current_score INTEGER NOT NULL DEFAULT 0,
  current_seat INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

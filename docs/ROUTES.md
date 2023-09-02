# Game Routes
- / 

# Http Data Structures

Player = {id: 1, name: 'Super Player', hi_score: 25, cookie_uuid: uuid, game_id: 0, current_score: 0, current_seat: 0, created_at: timestamp}

Game = {id: 1, socket_address: 'wss://javascript.info/chat', is_active: boolean}


# Socket Listeners

  ## Client Emissions
    
  - Munch, payload: timestamp <!-- make duck eat -->
  - Join, payload: playerName <!-- Go from homepage (or post-game) to loading THEN pending -->
  - Ready <!-- Go from pending to in-game -->
  - Home <!-- Go from post-game to homescreen -->

  ## Server Emissions

  - Gamestate, payload: Gamestate


# Websocket Data Structures

GameState = {marbles: [Marble], player: sanitizedPlayer, opponents: [sanitizedPlayer, sanitizedPlayer, sanitizedPlayer], isActive: boolean}

sanitizedPlayer = {name: 'Super Player', current_score: 0, current_seat: 0, isMunching: boolean}

Marble = Matter.js Body Object

# Game States

  Current view state will also impact new loaded view logic, to maintain desired flow

  - Homepage = no game_id
  - Pending = game_id, !game.isActive
  - In-Game = game_id, game.isActive
  - Post-Game = no game_id

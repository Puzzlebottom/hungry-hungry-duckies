# Milestones

Basic socket communication
  - sending messages

Intermediate Socket communincation
  - All Emitters and listeners wired
    - Munch
    - Join
    - Ready
    - Home
    - Gamestate

Complete socket communication
  - All logic on all emissions
    - Munch
    - Join
    - Ready
    - Home
    - Gamestate

React View components
  - Home screen
    - Hero
    - Leaderboard
      PROPS
      - hiScores={[{playername: "Bob", hi-score: 25}]}

    - PlayerNameForm
      - onSubmit={(playerName) => {
        payload = {playername: 'bob', uuid: string}
        read cookie (if existing player) {
           emits("join", {playername: 'bob', uuid: uuid})
        } else {
          emits("join", {playername: 'bob', uuid: uuid})
        }
        changes state to loading..
      }}

  - Loading
    - Dynamic element
      when all assets are load, change state to gametable.

  - GameTable

    - Table
    - Ducks
      onMunch = () => {
        emits('munch', timestamp.new())
        makeQuack()
        animateDuck()
      }
    - Player Info Panel (name, score, isReady?)
      PROPS
      - name, score, isReady from Sanitized Player

    - Countdown
      - Client side logic, count = 3, setInterval(1000, () => {render count, count-- when count === 0, renders GO!} set interval is called as soon as gameState.isActive is true.
      then release the swarm
  - PostGame
    - PlayerList
    - NewGameButton emits('join', payload: uuid)
    - HomeButton redirect to '/'
  
Styling
  - Everything sized and in place
  - Final palette in place

Music
  - Main screen track
  - In Game track
  - Post-game track
  - Quacks Quackophony.

Database
  - Built and accessible on all our machines
  - Seeded

Server-side game logic
  - Add players to game
  - Run the timer
  - Register a munch
  - Check munch collisions
  - Update Client with GameState
  - Player Rejoin
  - End Game

Client-side game logic
  - Join a game
  - Munch
  - Eat a bug and score
  - Render Dumb-Bugs
  - Update Dumb-Bugs with Gamestate

Client-side view logic
  - Visit Main page
  - See Loading Screen
  - See Table
  - See Post-game

# Stretch Milestones

Hosting
GameTimer

INTRODUCTIONS: 30sec
- Conor: Hi, I'm Conor Meldrum, a full-stack developer with a background in slinging drinks and pulling pints.
- Hassan: Hi, my name is Hassan, I am a full stack developer with a background in biotech an pharmaceuticals.
- Jackson: Hi, I'm Jackson, a full-stack developer with a background in retail management.

Conor: We're here today to show off our amazing new web app, a labour of love, Hungry Hungry Duckies: a fast and frenetic multiplayer button masher inspired by a classic children's game.

Description: 30sec
Hassan: In the world of programming, there's a phenomenon called rubber ducking, where we talk to a rubber duck because it helps us debug code. That inspired our app, where you play as a rubber duck munching bugs.
Our stack is Postgres Express React and Node, with socket.io for fast, bidirectional communication and matter.js, a 2D physics engine, to control the movement of the bugs.

### DEMONSTRATION: 60sec

### Design & Styling: 
For the visual experience, I've implemented CSS transformations on the backgrounds using multiple images to create the movement effects as well as adding shaking effects to the buttons and messages. and for the audio I composed the music for the game using ableton live and also assigned a unique quack sound to each duck.

Jackson: We think The best way to introduce you to our project, is by watching us play a quick round. Conor is going to be hosting the front and back end servers, while Hassan and I connect remotely.

#### notes
- Jackson connects through 2 tabs
- Hassan connects through 1
- DON'T HIT READY UNTIL WE'RE READY
- H & J mute mics?
- smash space bar for 45 seconds 

Conor: You're about to see a demonstration of strategy, tactics and planning, impeccably executed.  Like a ballet for the digital age. 
: When all the players click ready, the bugs are released. Are you all ready lads?
: Check out our scores rising, counting each bug munched

### 10 bugs left
: Check out the fun emotes we can send to each other

TRY to leave one bug for calm.

Conor: No question as to who won that game! These scores are all sent server-side to be persisted in our DB.

### Persistence: 
: A unique player identifier is saved on the browser in local storage, allowing us to pull up their records, including their total cumulative score as soon as they arrive at the page.

### Physics: 30sec
: As we said, matter.js is used both server and client side to make the bugs move.
: There's a gravity point at the center of the arena that keeps the bugs moving. The bugs also deflect one another on collision, and bounce off the walls.

: Because the position of the bugs is tracked server-side they're rendered identically on each player's screen

### Sockets: 30sec
: The gamestate, including individual player scores and bug positions are updated in real time using socket.io. The server sends updates to the client every 25 ms, allowing every player to have a seamless munching experience.


Hassan: And that's that! We had a blast building this, and we're super proud of how it turned out. 

Jackson: Thanks so much everyone for coming out and being *so* supportive. 

Conor: We've got a little bit of time left over, let's go out  munching!

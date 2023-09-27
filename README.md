# ABOUT

Hungry Hungry Duckies is a fast and frenetic multiplayer button masher inspired by a classic children's game. You're a rubber duckie, and you're trying to eat more bugs than your hungry hungry neighbours.<br>

The game leverages both server side and client side 2D physics engines, with websocket communications ensuring near perfect synchronicity
between each player's gameview. Each bug has their position, vector and angle updated 40 times per second by the authoritative server, while the client side physics ensures that any dropped packets are seamlessly covered over until the next update.

This project was build over an intensive 10 day sprint by Hassan Issak, Jackson Lionheart and Conor Meldrum for their Lighthouse Labs Web Development bootcamp final. No duckies were harmed in the making of this game. Tens of thousands of bugs were mercilessly munched.

# GETTING STARTED

#### SET UP YOUR BACKEND! => Follow the instructions [here](./backend/README.md)

#### SET UP YOUR FRONTEND! => Follow the instructions [here](./frontend/README.md)

#### PLAY HUNGRY HUNGRY DUCKIES! => Go [here](http://localhost:5173)!

# DEPENDENCIES

- node.js
- express.js
- pg
- matter.js
- matter-attractors.js
- socket.io
- react
- vite
- axios
- sass

# FEATURES

## Socket Communication

You'll agree that above any other consideration, strategy is the key to winning this game; and that the key to good strategy is accurate intel.<br>
But bugs move fast, and we needed a way to make sure that each player could see the bugs moving identically. The solution was to calculate the motion of all the bugs server-side and communicate the results to be rendered at each client. We needed fast bi-directional communication, and used websockets to achieve it.

#### Library

Socket.io was a breeze to work with. Honestly one of the most straightforward functions of this project to implement.

#### Game State

On socket connection, an interval is set that sends an update to each player every 25ms. But since each player controls a different duck, the `getGameStateForSocketId` function in `game.js` first transforms the generalized gameState into a player-specific object that allows each client to attach event listeners (for `toggleReady`, `munch` and `message`) to the correct duck.

#### Munching

In order to maintain a crisp and responsive feeling for the controls, the animation for munching is triggered client-side by an event listener tied to the spacebar. But the actual collision detections for the munch are calculated at the server when the `munch` emission is received there, and relayed back to the players in the next gameState update. Thanks to the speed of the websocket connection however, the resultant roundtrip delay between a player munching and the update to the bugs is unnoticable.

#### Messages

The messaging function is operated in the same way as the munching; rendered at the triggering client and then relayed from server-side to the other players. Since the messaging function isn't considered critical to the outcome of the game however, there's no logic that needs to be implemented server-side to validate the message. Theoretically this could result in players modifying the array of random messages locally to send custom smack-talk. This could be used in the future to implement custom messages as a feature. It could also result in abuse, however.

## Physics

#### Library

Matter.js was a frustating library to work with because the documentation is...not good. Considering the most recent release happened this year(2023), there was almost no information on integrating the library with react. As a result, it's quite possible that our application of `useRef` to store the engine, renderer, runner and composite isn't the best way to go about it. Nevertheless, offloading the physics logic into the custom `useBugs` hook manages to keep the `Bugs` react component very clean and readable.

#### Attractor

The arena itself represents a slightly concave dish seen from above (if you're familiar with Hungry Hungry Hippos, we were trying to emulate the motion of those marbles as closely as possible). We used a plugin for `Matter.js` called `Matter-attractors.js` to generate an attractive force from a single point at the center of the arena. Unlike a gravitational attraction, the distance of the bug from the centerpoint has no effect on the strength of attraction.

#### Bugs

One challenge we had was to ensure that the bugs maintained a certain amount of activity even without input; otherwise, when none of the ducks were munching, the bugs would pack themselves into an ordered hexagonal matrix and the effect was decidely unnatural. This was solved by applying a tiny negative coeffecient of friction to the bugs; they would instead be inclined to bounce and slip away from each other, resulting in a pleasant degree of natural 'churn'.<br>

Many of the factors that contribute the bugs' motion rely on carefully tuned physical characteristics. Rather than having a dozen or more 'magic numbers' scattered throughout the code, `bugContants.js` holds all of these values, commented to indicate their various effects. In fact, this file exists in both the front and back ends, but since it's critical that the motions of the bugs are synchronized between a note is included in each reiterating that the contents of both files must remain identical.<br>

Updating the bugs was a particular challenge. We knew that the server must remain authoritative, but didn't want the client-view to be entirely dependent on the server for updates (since even a few missed emissions would result in jerky, unpredictable movements). This informed our decision to run two simulations simultaneously, one client side and one server side. Even if with significant lag in the server-side transmissions, the client side engine will keep the bugs moving realistically until updates resume. Updates are simple objects, containing keys for the `id`, `position`, `velocity` and `angle` of each bug; when a new gameState is received client side, the current array of bug objects is compared, any missing bugs are removed, any remaining bugs are updated with the new values, and any new bugs are added. The resulting fluidity is pretty seamless.

#### Munch-Detection

Each duckie is assigned a set of two concentric, circular sensors called the `munchSensor` and the `missSensor`. When a munch event is registered on the server, it calculates any collisions between the bug objects and the relevant munch sensor, removing any colliding bugs from the field of play and increasing the player's score accordingly. Next, the miss sensor checks for any bug collisions, and updates their velocity with a vector calculated to send them shooting directly away from the sensor. This is how we create a feeling of chaos and dynamism with the bugs; near misses are blasted away, ricocheting of the walls and other bugs.

## Persistence

#### DB Layer

We planned our schema to include a game entity, since we hoped we might be able to implement instanced games and match-matchmaking as a stretch goal. It might happen in the future, but currently we persist only player information and support only a single game instance.

#### Local Storage

We'd originally included our player uuid client-side as a session cookie, but later in development decided to pivot to local storage so that the player data can be accessed across multiple sessions. We much prefer the sense of continuity that this allows, and transitioned our home-page leaderboard from tracking high-scores to tracking cumulative scores (which made more sense, since high scores are limited to a relatively narrow range).

## Design and Styling

We're very proud of the attention-grabbing and unified design for this game. Unleashing a single team-member (Jackson) to be in charge of all design decisions meant that each of our views is integrated into an overarching theme.

#### Sass

The Sass Preprocessor is used to convert our scss files into css. This was our first time using Sass, and configuring vite to build our stylesheets for production is at the top of our TO DO list.

#### Background Animations

Layering images with transparent elements and using CSS animations to create a parallax effect evokes the feeling of classic console games. Keen eyed users might notice a motif of progressive elevation repeated between our views: mountains in the loading view, clouds in the game view and space in the post-game screen. Who says devs can't be designers too?

## Sound and Music

The audio volume is set very low. this can be adjusted in the `useAudio` hook. These levels were applied specifically for our final presentation on the Hop-in platform, which has some...questionable audio integration. More sensible volume levels would be 0.08 for the music and 0.5 for the quacks.

#### Original Music

All the music was written and recorded by Jackson Lionheart for this project. This wouldn't have been as much fun without the awesome tunes.

#### useAudio

We were able to centralize our audio function in a custom hook. On invocation a reference is returned that is attached to an `<audio>` tag, along with controls for playing music or quacking, as the use-case demands. A frustation was working around the limitations modern browsers place on auto-play music. The compromise we arrive at was a click listener that starts the music as soon as it registers a user interaction.

#### Mute button

The mute function applies only to the music, and the html element it's assigned to is rendered from the `App` component. We felt that the quacking noises were integral to the game experience, although this choice could be revisted in the future.

## Glamour Shots

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/homescreen.png?raw=true" alt="a screenshot of the homepage hero" height="50%" width="50%"><br>
The home page hero. The credits link to our CVs and this repo. Hire us!

---

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/leaderboard.png?raw=true" alt="a screenshot of the leaderboard" height="50%" width="50%"><br>
The leaderboard! It'll keep track of your score even if you change your name.

---

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/bugs.png?raw=true" alt="a screenshot of creepy bugs" height="50%" width="50%"><br>
It's tough to see, but the bugs legs move when they skitter around.

---

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/duckie.png?raw=true" alt="a screenshot of a cute duckie" height="50%" width="50%"><br>
3D realism, with shadows!

---

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/player-detail-panel.png?raw=true" alt="a screenshot of the player panel" height="50%" width="50%"><br>
Scores and mores

---

<img src="https://github.com/Puzzlebottom/hungry-hungry-duckies/blob/docs/docs/results.png?raw=true" alt="a screenshot of the game results page" height="50%" width="50%"><br>
This is where you make fun of your friends.

---

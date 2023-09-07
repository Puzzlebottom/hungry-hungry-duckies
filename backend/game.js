import Matter from 'matter-js';
import Instance from './physics.js';

const { Body, Composite } = Matter;
const { composite, getNewBug } = Instance.run();

const players = {};
const bugs = {};
const isActive = false;

// const a = getNewBug();
// const b = getNewBug();

// Composite.add(composite, [a, b]);

// setInterval(() => {
//   console.log('A: ', a.position, a.id);
//   console.log('B: ', b.position, b.id);
// }, 500);


const munch = (composite, seat) => {
  const labelPrefix = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ][seat];

  const bugs = [];
  let innerSensor;
  let outerSensor;

  const innerLabel = labelPrefix + '-inner';
  const outerLabel = labelPrefix + '-outer';

  Composite.allBodies(composite).forEach(body => {
    if (body.label === innerLabel) innerSensor = body;
    if (body.label === outerLabel) outerSensor = body;
    if (body.label === 'bug') bugs.push(body);
  });

  const munchedBugs = Query.collides(innerSensor, bugs);
  munchedBugs.forEach(munch => Composite.remove(composite, munch.bodyB));

  const missedBugs = Query.collides(outerSensor, bugs);
  missedBugs.forEach(miss => {
    const bug = miss.bodyB;
    bounceBug(outerSensor, bug);
  });
};

//PLAYER ACTIONS { name: 'Top Left', current_score: 0, current_seat: 0, isMunching: false, isReady: false }
// add player
// remove player
// setName
// setScore
// setSeat
// setIsMunching
// setIsReady

//BUG ACTIONS {position: {x: 0, y: 0}, velocity: {x: 0, y:0}, }
// getBugUpdate
// addBug
// removeBug(id)

//GAME ACTIONS
// checkReady()
// beginGame
// munch(composite, seat)
// updatePlayer(seat)
// getGameStateForSeat(seat) game state will be calculated on an arena 1260 x 1260, client side rectification will have to happen
// endGame


const getGameStateForSeat = (seat) => {
  if (Object.keys(players).length === 0) return {};

  const player = players[seat] || {};

  const opponents = [0, 1, 2, 3]
    .filter(i => i !== seat)
    .map(i => players[i]);

  return { bugs, player, opponents, isActive };
};

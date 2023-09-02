import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Mouse, Events, Vector } = Matter;

// create an engine
var engine = Engine.create();
engine.gravity.scale = 0;

const width = 800;
const height = 800;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    showPerformance: true
  }
});

const centerpoint = { x: width / 2, y: height / 2 };
const numberOfSides = 100;

const smallerSide = Math.min(width, height);
let ratio = 0.45;
let radius = smallerSide * ratio;

const bgCollisionCategory = 0x0001;
const gamePiecesCollisionCategory = 0x0002;


let wallSegments = [];

for (let i = 0; i < numberOfSides; i++) {
  let segments = numberOfSides;
  // let angle = i / numberOfSides;
  let angle2 = i / numberOfSides * Math.PI * 2 + segments / 2;
  // let x = Math.cos(angle);
  // let y = Math.sin(angle);
  let x2 = Math.cos(angle2);
  let y2 = Math.sin(angle2);
  // let cx = x * r;
  // let cy = y * r;
  let cx2 = x2 * radius + width / 2;
  let cy2 = y2 * radius + height / 2;
  // let circ = addRect({ x: cx, y: cy, w: 120 / 1000 * m, h: 30 / 1000 * m, options: { angle: angle, isStatic: true } });
  let rect = Bodies.rectangle(cx2, cy2, 45 / 1000 * smallerSide, 150 / 1000 * smallerSide, { angle: angle2, isStatic: true, collisionFilter: { category: gamePiecesCollisionCategory, mask: gamePiecesCollisionCategory } });
  wallSegments.push(rect);
}

const arena = Bodies.circle(centerpoint.x, centerpoint.y, 800, {
  isStatic: true,
  collisionFilter: { category: bgCollisionCategory },
  render: {
    sprite: {
      texture: '../public/arena.png',
      xScale: 0.8,
      yScale: 0.8
    }
  }
});

const center = Bodies.circle(centerpoint.x, centerpoint.y, 0, {
  isStatic: true,
  collisionFilter: { category: gamePiecesCollisionCategory, mask: gamePiecesCollisionCategory },
  plugin: {
    attractors: [
      function(bodyA, bodyB) {
        if (bodyA.label === "marble") {
          return console.log('marble');
        }
        return {
          x: (bodyA.position.x - bodyB.position.x) * 1e-6,
          y: (bodyA.position.y - bodyB.position.y) * 1e-6,
        };
      }
    ]
  }
});

const ducks = [];

const textures = [
  '../public/duckie-top-right-3.png',
  '../public/duckie-bottom-right-1.png',
  '../public/duckie-bottom-left-1.png',
  '../public/duckie-top-left-1.png'
];

for (let i = 0; i < 4; i++) {
  const duck = Bodies.circle(width / 2, height / 2, 80,
    {
      isStatic: true,
      collisionFilter: { category: gamePiecesCollisionCategory }, //fix the offsets
      render: {
        sprite: {
          texture: textures[i]
        }
      }
    });
  ducks.push(duck);
}

const marbles = [];
for (let i = 0; i < 25; i++) {
  const newMarble = Bodies.circle(width / 2, height / 2, 15, {
    restitution: 1, friction: -0.2, frictionAir: 0.01, frictionStatic: 0, label: 'marble',
    collisionFilter: { category: gamePiecesCollisionCategory, mask: gamePiecesCollisionCategory },
    render: {
      sprite: {
        texture: '../public/bug1.png',
        xScale: 0.25,
        yScale: 0.25,
        // the offset is to more accurately line up the bugs center of mass with the sprite
        xOffset: 0,
        yOffset: -0.05
      }
    }
  });
  newMarble.label = "marble";
  Body.setMass(newMarble, 0.5);
  marbles.push(newMarble);
}

Body.setMass(center, 1);

const composite = Composite.add(engine.world, [...wallSegments, center, arena, ...marbles, ...ducks]);

let mouse = Mouse.create(render.canvas);

Events.on(engine, 'afterUpdate', function() {
  if (!mouse.position.x) {
    return;
  }

  // smoothly move the attractor body towards the mouse
  Body.translate(center, {
    x: (mouse.position.x - center.position.x) * 0.25,
    y: (mouse.position.y - center.position.y) * 0.25
  });
});

let tickCounter = 0;

// Makes the bugs face where they're headed.
Events.on(engine, 'afterUpdate', () => {

  const marbles = Matter.Composite.allBodies(composite).filter(body => body.label === 'marble');
  tickCounter++;

  for (const marble of marbles) {
    if (tickCounter === 8) {
      toggleBugSprite(marble);
    }
    alignMarble(marble);
  }

  if (tickCounter === 8) tickCounter = 0;
});

const toggleBugSprite = (marble) => {
  const currentTexture = marble.render.sprite.texture;
  const texture1 = '../public/bug1.png';
  const texture2 = '../public/bug2.png';
  if (currentTexture === texture1) {
    marble.render.sprite.texture = texture2;
  } else {
    marble.render.sprite.texture = texture1;
  }
};

const alignMarble = (marble) => {
  const velocity = Body.getVelocity(marble);
  const bearing = Vector.angle({ x: 0, y: 0 }, velocity);
  // - Math.:PI / 2 is needed because the png is facing the wrong way.
  const currentAngle = marble.angle;
  Body.setAngle(marble, bearing - Math.PI / 2);
};

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
export const table = () => Runner.run(runner, engine);


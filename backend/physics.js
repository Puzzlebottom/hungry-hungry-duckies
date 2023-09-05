import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Bodies, Composite } = Matter;

const TOTAL_BOUNDARY_FACES = 100; // controls the smoothness of the arena walls; more faces = smoother walls
const WALL_SEGMENT_DIMENSIONAL_COEFFICIENT = 0.15; // controls the thickness of the arena walls; bigger number = thicker walls
const INSIDE_DIAMETER_ADJUSTMENT = 0.436; // used to scale boundary radius to match arena.png; bigger number = bigger arena
const ATTRACTION_COEFFICIENT = 160e-10; // contols how strongly bugs are pulled toward the center. default 5e-7
const BUG_SIZE_COEFFECIENT = 44e-3; // scales the bug physics object; bigger number = bigger bugs
const SPRITE_SIZE_COEFFECIENT = 71e-5; // scales the bug sprite; bigger number = bigger sprite
const SPRITE_Y_OFFSET = -0.05; // shifts the sprite to more accurately match the apparent center of gravity
const BUG_FRICTION_COEFFICIENT = -55e-5; // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
const AIR_FRICTION_COEFFICIENT = 199e-7; // controls how rapidly the bugs slow down; bigger number = slower bugs
const RESTITUTION = 1; // controls the bounciness of the bugs; bigger number = more bouncy;

const instance = () => {

  const engine = Engine.create();
  const render = Render.create({
    element: arena.current,
    engine: engine.current,
    options: {
      width: viewWidth,
      height: viewHeight,
      wireframes: false,
      background: 'transparent',
    }
  });
  render.engine.gravity.scale = 0;
  const runner = Runner.create();
  Render.run(render);
  Runner.run(runner, engine.current);

  const centerpoint = { x: viewWidth / 2, y: viewHeight / 2 };
  const smallerSide = Math.min(viewWidth, viewHeight);
  const radius = smallerSide * INSIDE_DIAMETER_ADJUSTMENT;

  const getAttractor = () => {
    const attractor = (bodyA, bodyB) => {
      const a = bodyA.position;
      const b = bodyB.position;
      return { x: (a.x - b.x) * radius * ATTRACTION_COEFFICIENT, y: (a.y - b.y) * radius * ATTRACTION_COEFFICIENT * radius / 350 };
    };

    const center = Bodies.circle(centerpoint.x, centerpoint.y, 0, {
      isStatic: true,
      plugin: { attractors: [attractor] }
    });

    return center;
  };

  const getBounds = () => {
    const wallSegments = [];
    const totalSegments = TOTAL_BOUNDARY_FACES;
    const segmentSideLength = WALL_SEGMENT_DIMENSIONAL_COEFFICIENT * smallerSide;

    for (let i = 0; i < totalSegments; i++) {
      const segmentAngle = i / totalSegments * Math.PI * 2 + totalSegments / 2;
      const segmentCenter = {
        x: Math.cos(segmentAngle) * (radius + segmentSideLength / 2) + centerpoint.x,
        y: Math.sin(segmentAngle) * (radius + segmentSideLength / 2) + centerpoint.y
      };
      const segment = Bodies.rectangle(segmentCenter.x, segmentCenter.y, segmentSideLength, segmentSideLength,
        { angle: segmentAngle, isStatic: true, render: { visible: false } }
      );
      wallSegments.push(segment);

    }
    return wallSegments;
  };

  const getRandomCoordinateInCircle = (radius) => {
    const x = Math.random() * radius * Math.cos(Math.random() * 2 * Math.PI);
    const y = Math.random() * radius * Math.sin(Math.random() * 2 * Math.PI);
    return { x, y };
  };

  const getNewBug = () => {
    const randomOffset = getRandomCoordinateInCircle(radius / Math.PI);
    const x = centerpoint.x + randomOffset.x;
    const y = centerpoint.y + randomOffset.y;
    const size = radius * BUG_SIZE_COEFFECIENT;
    const newBug = Bodies.circle(x, y, size, {
      restitution: RESTITUTION, friction: radius * BUG_FRICTION_COEFFICIENT, frictionAir: radius * AIR_FRICTION_COEFFICIENT, frictionStatic: 0, label: 'bug',
      render: {
        sprite: {
          texture: bug1,
          xScale: radius * SPRITE_SIZE_COEFFECIENT,
          yScale: radius * SPRITE_SIZE_COEFFECIENT,
          yOffset: SPRITE_Y_OFFSET
        }
      }
    });

    return newBug;
  };

  const composite = Composite.add(engine.current.world, [getAttractor(), ...getBounds(), ...bugs]);

  return { composite, getNewBug };
};

export default instance;

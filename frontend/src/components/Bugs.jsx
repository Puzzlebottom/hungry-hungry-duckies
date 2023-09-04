import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import { useEffect, useRef, useState } from 'react';

import bug1 from '../assets/bug1.png';
import bug2 from '../assets/bug2.png';

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Events, Vector } = Matter;

const TOTAL_BOUNDARY_FACES = 100; // controls the smoothness of the arena walls; more faces = smoother walls
const WALL_SEGMENT_DIMENSIONAL_COEFFICIENT = 0.15; // controls the thickness of the arena walls; bigger number = thicker walls
const INSIDE_DIAMETER_ADJUSTMENT = 0.436; // used to scale boundary radius to match arena.png; bigger number = bigger arena
const ATTRACTION_COEFFICIENT = 160e-10; // contols how strongly bugs are pulled toward the center. default 5e-7
const NUMBER_OF_BUGS = 25;
const BUG_SIZE_COEFFECIENT = 44e-3; // scales the bug physics object; bigger number = bigger bugs
const BUG_TEMPO = 8; // controls the speed of the bug leg animation; bigger number = slower steps; must be > 1
const SPRITE_SIZE_COEFFECIENT = 71e-5; // scales the bug sprite; bigger number = bigger sprite
const SPRITE_Y_OFFSET = -0.05; // shifts the sprite to more accurately match the apparent center of gravity
const BUG_FRICTION_COEFFICIENT = -55e-5; // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
const AIR_FRICTION_COEFFICIENT = 199e-7; // controls how rapidly the bugs slow down; bigger number = slower bugs
const RESTITUTION = 1; // controls the bounciness of the bugs; bigger number = more bouncy;

export default function Bugs({ bugUpdate }) {

  const arena = useRef(); // arena element
  const engine = useRef(Engine.create());
  let tickCounter = useRef(0); // counts engine render updates

  const [viewWidth, setViewWidth] = useState(document.body.clientWidth);
  const [viewHeight, setViewHeight] = useState(document.body.clientHeight);
  const [bugs, setBugs] = useState([]);

  const handleResize = () => {
    setViewWidth(document.body.clientWidth);
    setViewHeight(document.body.clientHeight);
  };

  const updateBugs = (composite) => {
    if (bugs.length === 0) {
      setBugs(bugUpdate);
      return;
    }

    const removeBug = (bug) => Composite.remove(composite, bug);
    const addBug = (bug) => Composite.add(composite, bug);

    const oldBugs = Composite.allBodies(composite).filter(body => body.label === 'bug');
    const updatedBugs = [...bugUpdate];

    const oldBugMap = oldBugs.reduce((map, bug) => { return { ...map, [bug.id]: bug }, {}; });
    const updatedBugMap = updatedBugs.reduce((map, bug) => { return { ...map, [bug.id]: bug }; }, {});

    Object.keys(oldBugMap).forEach(id => {
      // update surviving bugs
      if (updatedBugMap[id]) {
        Body.setPosition(oldBugMap[id], updatedBugMap[id].position);
        Body.setVelocity(oldBugMap[id], updatedBugMap[id].velocity);
        // Body.setAngle(oldBugMap[id], updatedBugMap[id].angle);
      }
      // remove eaten bugs
      removeBug(oldBugMap[id]);
      delete oldBugMap[id];
    });

    if (Object.keys(oldBugMap).length !== Object.keys(updatedBugMap).length) {
      Object.keys(updatedBugMap).forEach(id => {
        // add new bugs
        if (!oldBugMap[id]) {
          addBug(updatedBugMap[id]);
        }
      });
    }
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);

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

    // const getRandomCoordinateInCircle = (radius) => {
    //   const x = Math.random() * radius * Math.cos(Math.random() * 2 * Math.PI);
    //   const y = Math.random() * radius * Math.sin(Math.random() * 2 * Math.PI);
    //   return { x, y };
    // };

    // const getBugs = () => {
    //   const bugs = [];

    //   for (let i = 0; i < NUMBER_OF_BUGS; i++) {
    //     const randomOffset = getRandomCoordinateInCircle(radius / Math.PI);
    //     const x = centerpoint.x + randomOffset.x;
    //     const y = centerpoint.y + randomOffset.y;
    //     const size = radius * BUG_SIZE_COEFFECIENT;
    //     const newBug = Bodies.circle(x, y, size, {
    //       restitution: RESTITUTION, friction: radius * BUG_FRICTION_COEFFICIENT, frictionAir: radius * AIR_FRICTION_COEFFICIENT, frictionStatic: 0, label: 'bug',
    //       render: {
    //         sprite: {
    //           texture: bug1,
    //           xScale: radius * SPRITE_SIZE_COEFFECIENT,
    //           yScale: radius * SPRITE_SIZE_COEFFECIENT,
    //           yOffset: SPRITE_Y_OFFSET
    //         }
    //       }
    //     });
    //     bugs.push(newBug);
    //   }
    //   return bugs;
    // };

    const render = Render.create({
      element: arena.current,
      engine: engine.current,
      options: {
        width: viewWidth,
        height: viewHeight,
        wireframes: false,
        background: 'transparent',
        showPerformance: true
      }
    });

    render.engine.gravity.scale = 0; // removes standard y-axis gravity; we're looking down at a table

    const toggleBugSprite = (bug) => {
      const currentTexture = bug.render.sprite.texture;
      const texture1 = bug1;
      const texture2 = bug2;
      if (currentTexture === texture1) {
        bug.render.sprite.texture = texture2;
      } else {
        bug.render.sprite.texture = texture1;
      }
    };

    const alignBug = (bug) => {
      const velocity = Body.getVelocity(bug);
      const bearing = Vector.angle({ x: 0, y: 0 }, velocity);
      Body.setAngle(bug, bearing - Math.PI / 2); // Math.PI / 2 (-90deg) adjustment is needed because the png is facing the wrong way.
    };

    const composite = Composite.add(engine.current.world, [getAttractor(), ...getBounds(), ...bugs]);
    const runner = Runner.create();

    Events.on(runner, 'tick', () => {
      const bugs = Matter.Composite.allBodies(composite).filter(body => body.label === 'bug');
      tickCounter.current++;

      for (const bug of bugs) {
        if (tickCounter.current === BUG_TEMPO) {
          toggleBugSprite(bug);
        }
        alignBug(bug);
      }

      if (tickCounter.current === BUG_TEMPO) tickCounter.current = 0;
    });

    Render.run(render);
    Runner.run(runner, engine.current);
    updateBugs(composite, engine);

    const cleanup = () => {
      Render.stop(render);
      Composite.clear(engine.current.world);
      Engine.clear(engine.current);
      Runner.stop(runner);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      window.removeEventListener('resize', handleResize);
    };


    return cleanup;
  }, [viewHeight, viewWidth, bugUpdate]);

  return (
    <div ref={arena} className='arena' style={{ width: '100%', height: '100%' }} />
  );
}

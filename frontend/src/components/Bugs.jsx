import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import { useEffect, useRef, useState } from 'react';

import bug1 from '../assets/bug1.png';
import bug2 from '../assets/bug2.png';

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Events } = Matter;

const SERVER_SIMULATION_SIZE = 1260; // the size of the physics world server side. It's gotta match backend/physics.js

const ATTRACTION_COEFFICIENT = 160e-10; // contols how strongly bugs are pulled toward the center. default 5e-7

const TOTAL_BOUNDARY_FACES = 100; // controls the smoothness of the arena walls; more faces = smoother walls
const WALL_SEGMENT_DIMENSIONAL_COEFFICIENT = 0.15; // controls the thickness of the arena walls; bigger number = thicker walls
const INSIDE_DIAMETER_ADJUSTMENT = 0.436; // used to scale boundary radius to match arena.png; bigger number = bigger arena

const BUG_SIZE_COEFFECIENT = 44e-3; // scales the bug physics object; bigger number = bigger bugs
const BUG_TEMPO = 8; // controls the speed of the bug leg animation; bigger number = slower steps; must be > 1
const SPRITE_SIZE_COEFFECIENT = 71e-5; // scales the bug sprite; bigger number = bigger sprite
const SPRITE_Y_OFFSET = -0.05; // shifts the sprite to more accurately match the apparent center of gravity

const BUG_FRICTION_COEFFICIENT = -55e-5; // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
const AIR_FRICTION_COEFFICIENT = 199e-7; // controls how rapidly the bugs slow down; bigger number = slower bugs
const RESTITUTION = 1; // controls the bounciness of the bugs; bigger number = more bouncy;

export default function Bugs({ bugState }) {

  const arena = useRef(); // arena element
  const engine = useRef(Engine.create());
  let tickCounter = useRef(0); // counts engine render updates
  let composite = useRef();
  let sprite = useRef(bug1);

  const [viewWidth, setViewWidth] = useState(document.body.clientWidth);
  const [viewHeight, setViewHeight] = useState(document.body.clientHeight);

  const smallerSide = Math.min(viewWidth, viewHeight);
  const serverClientSizeRatio = smallerSide / SERVER_SIMULATION_SIZE;
  const centerpoint = { x: smallerSide / 2, y: smallerSide / 2 };
  const radius = smallerSide * INSIDE_DIAMETER_ADJUSTMENT;

  const handleResize = () => {
    setViewWidth(document.body.clientWidth);
    setViewHeight(document.body.clientHeight);
  };

  const getAttractor = () => {
    const attractor = (bodyA, bodyB) => {
      const a = bodyA.position;
      const b = bodyB.position;
      return {
        x: (a.x - b.x) * radius * ATTRACTION_COEFFICIENT,
        y: (a.y - b.y) * radius * ATTRACTION_COEFFICIENT
      };
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

  const getNewBug = (id, position, velocity, angle) => {
    const x = centerpoint.x + position.x;
    const y = centerpoint.y + position.y;
    const size = radius * BUG_SIZE_COEFFECIENT;
    const newBug = Bodies.circle(x, y, size, {
      restitution: RESTITUTION,
      friction: radius * BUG_FRICTION_COEFFICIENT,
      frictionAir: radius * AIR_FRICTION_COEFFICIENT * serverClientSizeRatio,
      frictionStatic: 0, label: 'bug',
      render: {
        sprite: {
          texture: sprite.current,
          xScale: radius * SPRITE_SIZE_COEFFECIENT,
          yScale: radius * SPRITE_SIZE_COEFFECIENT,
          yOffset: SPRITE_Y_OFFSET
        }
      }
    });

    newBug.id = id;
    Body.setPosition(newBug, position);
    Body.setVelocity(newBug, velocity);
    Body.setAngle(newBug, angle);

    return newBug;
  };

  const updateBugs = (composite) => {

    const removeBug = (bug) => Composite.remove(composite, bug);
    const addBug = (bug) => Composite.add(composite, bug);
    const oldBugs = Composite.allBodies(composite).filter(body => body.label === 'bug');
    const updatedBugs = [...bugState].map(bug => {
      let { position, velocity } = bug;
      position = { x: position.x * serverClientSizeRatio, y: position.y * serverClientSizeRatio };
      velocity = { x: velocity.x * serverClientSizeRatio, y: velocity.y * serverClientSizeRatio };
      return { ...bug, position, velocity };
    });

    const oldBugMap = oldBugs.reduce((map, bug) => { return { ...map, [bug.id]: bug }; }, {});
    const updatedBugMap = updatedBugs.reduce((map, bug) => { return { ...map, [bug.id]: bug }; }, {});

    Object.keys(oldBugMap).forEach(id => {
      // update surviving bugs
      if (updatedBugMap[id]) {
        Body.setPosition(oldBugMap[id], updatedBugMap[id].position);
        Body.setVelocity(oldBugMap[id], updatedBugMap[id].velocity);
        Body.setAngle(oldBugMap[id], updatedBugMap[id].angle);
      }
      // remove eaten bugs
      removeBug(oldBugMap[id]);
      delete oldBugMap[id];
    });

    if (Object.keys(oldBugMap).length !== Object.keys(updatedBugMap).length) {
      Object.keys(updatedBugMap).forEach(id => {
        // add new bugs
        if (!oldBugMap[id]) {
          const { position, velocity, angle } = updatedBugMap[id];
          addBug(getNewBug(id, position, velocity, angle));
        }
      });
    }
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);

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

    render.engine.gravity.scale = 0; // removes standard y-axis gravity; we're looking down at a table

    composite.current = Composite.add(engine.current.world, [getAttractor(), ...getBounds()]);
    const runner = Runner.create();

    Events.on(runner, 'tick', () => {
      tickCounter.current++;

      const newSprite = sprite.current === bug1 ? bug2 : bug1;

      if (tickCounter.current === BUG_TEMPO) {
        sprite.current = newSprite;
        tickCounter.current = 0;
      }
    });

    Render.run(render);
    Runner.run(runner, engine.current);

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
  }, []);

  useEffect(() => {
    updateBugs(composite.current);
  }, [bugState]);

  return (
    <div ref={arena} className='arena' />
  );
}

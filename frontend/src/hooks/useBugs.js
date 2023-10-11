import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import BugConstants from "../constants/bugConstants.js";
import { useRef, useState } from 'react';
import Images from "../assets/images.js";

const { SERVER_SIMULATION_SIZE, TOTAL_BOUNDARY_FACES, WALL_SEGMENT_DIMENSIONAL_COEFFICIENT, INSIDE_DIAMETER_ADJUSTMENT, ATTRACTION_COEFFICIENT, BUG_SIZE_COEFFICIENT, BUG_FRICTION_COEFFICIENT, BUG_TEMPO, SPRITE_SIZE_COEFFICIENT, SPRITE_Y_OFFSET, AIR_FRICTION_COEFFICIENT, RESTITUTION } = BugConstants;

Matter.use(MatterAttractors);
const { Bodies, Body, Composite, Engine, Events, Render, Runner } = Matter;

const useBugs = () => {

  const arena = useRef();
  const engine = useRef();
  const render = useRef();
  const runner = useRef();
  const composite = useRef();

  const tickCounter = useRef(0); // counts engine render updates
  const sprite = useRef(Images.bugs.bug1);

  const [viewWidth, setViewWidth] = useState(document.body.clientWidth);
  const [viewHeight, setViewHeight] = useState(document.body.clientHeight);

  const smallerSide = Math.min(viewWidth, viewHeight);
  const serverClientSizeRatio = smallerSide / SERVER_SIMULATION_SIZE;
  const centerpoint = { x: SERVER_SIMULATION_SIZE / 2 * serverClientSizeRatio, y: SERVER_SIMULATION_SIZE / 2 * serverClientSizeRatio };
  const radius = smallerSide * INSIDE_DIAMETER_ADJUSTMENT;

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
    const size = radius * BUG_SIZE_COEFFICIENT;
    const newBug = Bodies.circle(x, y, size, {
      restitution: RESTITUTION,
      friction: radius * BUG_FRICTION_COEFFICIENT,
      frictionAir: radius * AIR_FRICTION_COEFFICIENT * serverClientSizeRatio,
      frictionStatic: 0, label: 'bug',
      render: {
        sprite: {
          texture: sprite.current,
          xScale: radius * SPRITE_SIZE_COEFFICIENT,
          yScale: radius * SPRITE_SIZE_COEFFICIENT,
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

  const updateBugs = (bugState) => {

    const removeBug = (bug) => Composite.remove(composite.current, bug);
    const addBug = (bug) => Composite.add(composite.current, bug);
    const oldBugs = Composite.allBodies(composite.current).filter(body => body.label === 'bug');
    const updatedBugs = bugState.map(bug => {
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

  const handleResize = () => {
    setViewWidth(document.body.clientWidth);
    setViewHeight(document.body.clientHeight);
    render.current.canvas.width = document.body.clientWidth;
    render.current.canvas.height = document.body.clientHeight;
  };

  const startBugs = (width, height) => {
    setViewWidth(width);
    setViewHeight(height);
    window.addEventListener('resize', handleResize);

    engine.current = Engine.create();
    composite.current = Composite.add(engine.current.world, [getAttractor(), ...getBounds()]);
    runner.current = Runner.create();
    render.current = Render.create({
      element: arena.current,
      engine: engine.current,
      options: {
        width: viewWidth,
        height: viewHeight,
        wireframes: false,
        background: 'transparent',
        gravity: {
          scale: 0
        }
      }
    });

    Render.run(render.current);
    Runner.run(runner.current, engine.current);
    Events.on(runner.current, 'tick', () => {
      tickCounter.current++;
      const { bug1, bug2 } = Images.bugs;
      const newSprite = sprite.current === bug1 ? bug2 : bug1;

      if (tickCounter.current === BUG_TEMPO) {
        sprite.current = newSprite;
        tickCounter.current = 0;
      }
    });
  };

  const stopBugs = () => {
    Render.stop(render.current);
    Composite.clear(engine.current.world);
    Engine.clear(engine.current);
    Runner.stop(runner.current);
    render.current.canvas.remove();
    render.current.canvas = null;
    render.current.context = null;
    render.current.textures = {};
    window.removeEventListener('resize', handleResize);
  };

  return { startBugs, stopBugs, updateBugs, arena };
};

export default useBugs;

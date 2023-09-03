import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import { useEffect, useRef } from 'react';

import bug1 from '../assets/bug1.png';
import bug2 from '../assets/bug2.png';

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Events, Vector } = Matter;

export default function Bugs(props) {
  const arena = useRef();
  const engine = useRef(Engine.create());
  let tickCounter = useRef(0);

  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const render = Render.create({
      element: arena.current,
      engine: engine.current,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
      }
    });

    render.engine.gravity.scale = 0;

    const centerpoint = { x: width / 2, y: height / 2 };
    const numberOfSides = 100;
    const smallerSide = Math.min(width, height);
    let ratio = 0.45;
    let radius = smallerSide * ratio;

    const getCenter = () => {
      const center = Bodies.circle(centerpoint.x, centerpoint.y, 0, {
        isStatic: true,
        plugin: {
          attractors: [
            function(bodyA, bodyB) {
              return {
                x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                y: (bodyA.position.y - bodyB.position.y) * 1e-6,
              };
            }
          ]
        }
      });
      Body.setMass(center, 1);

      return center;
    };


    const getBounds = () => {
      const segments = [];

      for (let i = 0; i < numberOfSides; i++) {
        let totalSegments = numberOfSides;
        let angle2 = i / numberOfSides * Math.PI * 2 + totalSegments / 2;
        let x2 = Math.cos(angle2);
        let y2 = Math.sin(angle2);
        let cx2 = x2 * radius + width / 2;
        let cy2 = y2 * radius + height / 2;
        let rect = Bodies.rectangle(cx2, cy2, 45 / 1000 * smallerSide, 150 / 1000 * smallerSide, { angle: angle2, isStatic: true, render: { visible: false } });
        segments.push(rect);

      }
      return segments;
    };

    const getBugs = () => {
      const bugs = [];
      for (let i = 0; i < 25; i++) {
        const newBug = Bodies.circle(width / 2, height / 2, 15, {
          restitution: 1, friction: -0.05, frictionAir: 0.01, frictionStatic: 0, label: 'bug',
          render: {
            sprite: {
              texture: bug1,
              xScale: 0.25,
              yScale: 0.25,
              // the offset is to more accurately line up the bugs center of mass with the sprite
              xOffset: 0,
              yOffset: -0.05
            }
          }
        });
        Body.setMass(newBug, 0.5);
        bugs.push(newBug);
      }
      return bugs;
    };

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
      // - Math.:PI / 2 is needed because the png is facing the wrong way.
      Body.setAngle(bug, bearing - Math.PI / 2);
    };

    const center = getCenter();
    const bounds = getBounds();
    const bugs = getBugs();

    const composite = Composite.add(engine.current.world, [center, ...bounds, ...bugs]);

    Events.on(engine.current, 'afterUpdate', () => {

      const bugs = Matter.Composite.allBodies(composite).filter(body => body.label === 'bug');
      tickCounter.current++;

      for (const bug of bugs) {
        if (tickCounter.current === 8) {
          toggleBugSprite(bug);
        }
        alignBug(bug);
      }

      if (tickCounter.current === 8) tickCounter.current = 0;
    });

    Render.run(render);

    let runner = Runner.create();
    Runner.run(runner, engine.current);

    return () => {
      Render.stop(render);
      Composite.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return (
    <div ref={arena} style={{ width: '100%', height: '100%', position: 'absolute' }} />
  );
}

import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import { useEffect, useRef } from 'react';

import bugSprite1 from '../assets/bug1.png';
import bugSprite2 from '../assets/bug2.png';

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Mouse, Events, Vector } = Matter;

export default function Bugs(props) {
  const scene = useRef();
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());

  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
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
        let rect = Bodies.rectangle(cx2, cy2, 45 / 1000 * smallerSide, 150 / 1000 * smallerSide, { angle: angle2, isStatic: true });
        segments.push(rect);

      }
      return segments;
    };

    const getBugs = () => {
      const bugs = [];
      for (let i = 0; i < 25; i++) {
        const newBug = Bodies.circle(width / 2, height / 2, 15, {
          restitution: 1, friction: -0.2, frictionAir: 0.01, frictionStatic: 0,
          // render: {
          //   sprite: {
          //     texture: { bugSprite1 },
          //     xScale: 0.25,
          //     yScale: 0.25,
          //     // the offset is to more accurately line up the bugs center of mass with the sprite
          //     xOffset: 0,
          //     yOffset: -0.05
          //   }
          // }
        });
        Body.setMass(newBug, 0.5);
        bugs.push(newBug);
      }
      return bugs;
    };

    const center = getCenter();
    const bounds = getBounds();
    const bugs = getBugs();

    Composite.add(engine.current.world, [center, ...bounds, ...bugs]);

    Engine.run(engine.current);
    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

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
    <div ref={scene} style={{ width: '100%', height: '100%' }} />
  );
}

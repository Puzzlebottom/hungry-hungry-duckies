import Matter from "matter-js";
import MatterAttractors from "matter-attractors";

import bug1 from '../assets/bug1.png';
import bug2 from '../assets/bug2.png';

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Events, Vector } = Matter;

const physicsHelpers = {
  getAttractor() {
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
  }
};

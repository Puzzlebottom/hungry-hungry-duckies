const Matter = require("matter-js");
const MatterAttractors = require("matter-attractors");

Matter.use(MatterAttractors);
const { Engine, Runner, Body, Bodies, Composite, Vector, Query } = Matter;

const ATTRACTION_COEFFICIENT = 160e-10; // contols how strongly bugs are pulled toward the center. default 5e-7

const TOTAL_BOUNDARY_FACES = 100; // controls the smoothness of the arena walls; more faces = smoother walls
const WALL_SEGMENT_DIMENSIONAL_COEFFICIENT = 0.15; // controls the thickness of the arena walls; bigger number = thicker walls
const INSIDE_DIAMETER_ADJUSTMENT = 0.436; // used to scale boundary radius to match arena.png; bigger number = bigger arena

const SENSOR_OFFSET_COEFFICIENT = 0.125; // positions the sensors under the duckie's munching mouths; bigger number = further from center
const MUNCH_DETECTOR_SIZE_COEFFICIENT = 44e-3; // controls the size of the munch detection sensor; bigger number = bigger sensor
const MISS_DETECTOR_SIZE_COEFFICIENT = 0.1364; // controlls the size of the miss detections sensor; bigger number = bigger sensor
const REPULSOR_SCALAR_COEFFICIENT = 0.05; // controls the knockback on a missed munch; bigger number = more knockback

const BUG_SIZE_COEFFICIENT = 44e-3; // scales the bug physics object; bigger number = bigger bugs
const BUG_FRICTION_COEFFICIENT = -55e-5; // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
const AIR_FRICTION_COEFFICIENT = 199e-7; // controls how rapidly the bugs slow down; bigger number = slower bugs
const RESTITUTION = 1; // controls the bounciness of the bugs; bigger number = more bouncy;

const Instance = {

  run: () => {
    const engine = Engine.create();
    engine.gravity.scale = 0;
    const runner = Runner.create();
    Runner.run(runner, engine);

    const WIDTH = 487;
    const HEIGHT = 487;

    const centerpoint = { x: WIDTH / 2, y: HEIGHT / 2 };
    const smallerSide = Math.min(WIDTH, HEIGHT);
    const radius = smallerSide * INSIDE_DIAMETER_ADJUSTMENT;

    const getAttractor = () => {
      const attractor = (bodyA, bodyB) => {
        const a = bodyA.position;
        const b = bodyB.position;
        return { x: (a.x - b.x) * radius * ATTRACTION_COEFFICIENT, y: (a.y - b.y) * radius * ATTRACTION_COEFFICIENT };
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
          { angle: segmentAngle, isStatic: true }
        );
        wallSegments.push(segment);

      }
      return wallSegments;
    };

    const getMunchSensor = (seat) => {
      const absoluteOffset = radius * SENSOR_OFFSET_COEFFICIENT;
      const munchSensorRadius = radius * MUNCH_DETECTOR_SIZE_COEFFICIENT;
      const missSensorRadius = radius * MISS_DETECTOR_SIZE_COEFFICIENT;

      const offset = [
        { x: -absoluteOffset, y: -absoluteOffset },
        { x: absoluteOffset, y: -absoluteOffset },
        { x: -absoluteOffset, y: absoluteOffset },
        { x: absoluteOffset, y: absoluteOffset }
      ][seat];

      const labelPrefix = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ][seat];

      const position = { x: centerpoint.x + offset.x, y: centerpoint.y + offset.y };

      const munchSensor = Bodies.circle(position.x, position.y, munchSensorRadius, {
        isStatic: true, isSensor: true, label: labelPrefix + '-munch', render: { visible: false }
      });

      const missSensor = Bodies.circle(position.x, position.y, missSensorRadius, {
        isStatic: true, isSensor: true, label: labelPrefix + '-miss', render: { visible: false }
      });

      return [munchSensor, missSensor];
    };

    const getSensors = () => {
      const sensors = [];
      for (let i = 0; i < 4; i++) sensors.push(...getMunchSensor(i));
      return sensors;
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
      const size = radius * BUG_SIZE_COEFFICIENT;

      const newBug = Bodies.circle(x, y, size, {
        restitution: RESTITUTION,
        friction: radius * BUG_FRICTION_COEFFICIENT,
        frictionAir: radius * AIR_FRICTION_COEFFICIENT,
        frictionStatic: 0, label: 'bug',
      });

      return newBug;
    };

    const bounceBug = (sensor, bug) => {
      const vector = Vector.sub(bug.position, sensor.position);
      const normalized = Vector.normalise(vector);
      const scalar = radius * REPULSOR_SCALAR_COEFFICIENT;

      Body.setVelocity(bug, Vector.mult(normalized, scalar));
    };

    const composite = Composite.add(engine.world, [getAttractor(), ...getBounds(), ...getSensors()]);

    const addBugs = (numberOfBugs) => {
      const newBugs = [];
      for (let i = 0; i < numberOfBugs; i++) {
        newBugs.push(getNewBug());
      }
      Composite.add(composite, [...newBugs]);
    };

    const processMunch = (seat) => {
      const labelPrefix = ['top-left', 'top-right', 'bottom-left', 'bottom-right'][seat];

      const bugs = [];
      let innerSensor;
      let outerSensor;

      const innerLabel = labelPrefix + '-munch';
      const outerLabel = labelPrefix + '-miss';

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

    const getBugUpdate = () => {
      return Composite.allBodies(composite).filter(body => body.label === 'bug');
    };

    return { addBugs, processMunch, getBugUpdate };
  }
};

module.exports = Instance;

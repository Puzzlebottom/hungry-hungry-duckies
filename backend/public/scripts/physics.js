const Matter = require("matter-js");
const MatterAttractors = require("matter-attractors");
const BugConstants = require('../constants/bugConstants');

Matter.use(MatterAttractors);
const { Engine, Runner, Body, Bodies, Composite, Vector, Query, Events } = Matter;
const { SERVER_SIMULATION_SIZE, ATTRACTION_COEFFICIENT, TOTAL_BOUNDARY_FACES, WALL_SEGMENT_DIMENSIONAL_COEFFICIENT, INSIDE_DIAMETER_ADJUSTMENT, SENSOR_OFFSET_COEFFICIENT, MUNCH_DETECTOR_SIZE_COEFFICIENT, MISS_DETECTOR_SIZE_COEFFICIENT, REPULSOR_SCALAR_COEFFICIENT, BUG_FRICTION_COEFFICIENT, BUG_SIZE_COEFFICIENT, AIR_FRICTION_COEFFICIENT, RESTITUTION } = BugConstants;

const Instance = {
  run: () => {
    const engine = Engine.create();
    engine.gravity.scale = 0;
    const runner = Runner.create();
    Runner.run(runner, engine);

    const WIDTH = SERVER_SIMULATION_SIZE;
    const HEIGHT = SERVER_SIMULATION_SIZE;

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

    const alignBug = (bug) => {
      const velocity = Body.getVelocity(bug);
      const bearing = Vector.angle({ x: 0, y: 0 }, velocity);
      Body.setAngle(bug, bearing - Math.PI / 2); // Math.PI / 2 (-90deg) adjustment is needed because the png is facing the wrong way.
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

      return munchedBugs.length;
    };

    Events.on(runner, 'tick', () => {
      Composite.allBodies(composite)
        .filter(body => body.label === 'bug')
        .map(alignBug);
    });

    const getBugUpdate = () => {
      return Composite.allBodies(composite).filter(body => body.label === 'bug');
    };

    const stop = () => {
      Composite.clear(engine.world);
      Engine.clear(engine);
      Runner.stop(runner);
    };

    return { addBugs, processMunch, getBugUpdate, stop };
  },
};

module.exports = Instance;

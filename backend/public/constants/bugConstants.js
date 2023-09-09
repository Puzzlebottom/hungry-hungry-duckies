//The contents of this file must match frontend/src/constants/bugConstants.js

const BugConstants = {
  SERVER_SIMULATION_SIZE: 360, // the size of the physics world server side. It's gotta match backend/physics.js

  ATTRACTION_COEFFICIENT: 160e-10, // contols how strongly bugs are pulled toward the center. default 5e-7

  TOTAL_BOUNDARY_FACES: 100, // controls the smoothness of the arena walls; more faces: smoother walls
  WALL_SEGMENT_DIMENSIONAL_COEFFICIENT: 0.15, // controls the thickness of the arena walls; bigger number: thicker walls
  INSIDE_DIAMETER_ADJUSTMENT: 0.436, // used to scale boundary radius to match arena.png; bigger number: bigger arena

  SENSOR_OFFSET_COEFFICIENT: 0.125, // positions the sensors under the duckie's munching mouths; bigger number: further from center
  MUNCH_DETECTOR_SIZE_COEFFICIENT: 44e-3, // controls the size of the munch detection sensor; bigger number: bigger sensor
  MISS_DETECTOR_SIZE_COEFFICIENT: 0.1364, // controlls the size of the miss detections sensor; bigger number: bigger sensor
  REPULSOR_SCALAR_COEFFICIENT: 0.05, // controls the knockback on a missed munch; bigger number: more knockback

  BUG_SIZE_COEFFICIENT: 44e-3, // scales the bug physics object; bigger number: bigger bugs
  BUG_FRICTION_COEFFICIENT: -55e-5, // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
  AIR_FRICTION_COEFFICIENT: 199e-7, // controls how rapidly the bugs slow down; bigger number: slower bugs
  RESTITUTION: 1, // controls the bounciness of the bugs; bigger number: more bouncy;
  BUG_TEMPO: 8, // controls the speed of the bug leg animation; bigger number = slower steps; must be >= 0
  SPRITE_SIZE_COEFFECIENT: 71e-5, // scales the bug sprite; bigger number = bigger sprite
  SPRITE_Y_OFFSET: -0.05, // shifts the sprite to more accurately match the apparent center of gravity
};

export default BugConstants;

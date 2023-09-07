export default {
  TOTAL_BOUNDARY_FACES: 100, // controls the smoothness of the arena walls; more faces = smoother walls
  WALL_SEGMENT_DIMENSIONAL_COEFFICIENT: 0.15, // controls the thickness of the arena walls; bigger number = thicker walls
  INSIDE_DIAMETER_ADJUSTMENT: 0.436, // used to scale boundary radius to match arena.png; bigger number = bigger arena
  ATTRACTION_COEFFICIENT: 160e-10, // contols how strongly bugs are pulled toward the center. default 5e-7
  BUG_SIZE_COEFFECIENT: 44e-3, // scales the bug physics object; bigger number = bigger bugs
  BUG_TEMPO: 8, // controls the speed of the bug leg animation; bigger number = slower steps; must be > 1
  SPRITE_SIZE_COEFFECIENT: 71e-5, // scales the bug sprite; bigger number = bigger sprite
  SPRITE_Y_OFFSET: -0.05, // shifts the sprite to more accurately match the apparent center of gravity
  BUG_FRICTION_COEFFICIENT: -55e-5, // controls the negative friction of the bugs applying an innate churn without input; default -57e-5
  AIR_FRICTION_COEFFICIENT: 199e-7, // controls how rapidly the bugs slow down; bigger number = slower bugs
  RESTITUTION: 1 // controls the bounciness of the bugs; bigger number = more bouncy;
};



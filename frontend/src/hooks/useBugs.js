import Matter from "matter-js";
import MatterAttractors from "matter-attractors";
import BugConstants from "../constants/bugConstants";
import { useEffect, useRef, useState } from 'react';

import bug1 from '../assets/bug1.png';
import bug2 from '../assets/bug2.png';
const { TOTAL_BOUNDARY_FACES, WALL_SEGMENT_DIMENSIONAL_COEFFICIENT, INSIDE_DIAMETER_ADJUSTMENT, ATTRACTION_COEFFICIENT, BUG_SIZE_COEFFICIENT, BUG_FRICTION_COEFFICIENT, BUG_TEMPO, SPRITE_SIZE_COEFFECIENT, SPRITE_Y_OFFSET, AIR_FRICTION_COEFFICIENT, RESTITUTION } = BugConstants;

Matter.use(MatterAttractors);
const { Engine, Render, Runner, Body, Bodies, Composite, Events, Vector } = Matter;


const useBugs = (viewWidth, viewHeight, element) => {

  const engine = useRef(Engine.create());
  let tickCounter = useRef(0); // counts engine render updates

  const centerpoint = { x: viewWidth / 2, y: viewHeight / 2 };
  const smallerSide = Math.min(viewWidth, viewHeight);
  const radius = smallerSide * INSIDE_DIAMETER_ADJUSTMENT;



  return { bugs, };
};

export default useBugs;

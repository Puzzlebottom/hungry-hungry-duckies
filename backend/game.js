import Matter from 'matter-js';
import Instance from './physics.js';

const { Body, Composite } = Matter;
const { composite, getNewBug } = Instance.run();

const a = getNewBug();
const b = getNewBug();

Composite.add(composite, [a, b]);

setInterval(() => {
  console.log('A: ', a.position, a.id);
  console.log('B: ', b.position, b.id);
}, 500);

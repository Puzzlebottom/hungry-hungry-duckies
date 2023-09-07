

const quacks = [
  '../../public/audio/munchquack.mp3',
  '/audio/munchquack2.mp3',
  '/audio/munchquack3.mp3',
  '/audio/munchquack4.mp3',
  '/audio/munchquack5.mp3',
  '/audio/munchquack6.mp3',
  // '/audio/munchquack7.mp3',
  '/audio/munchquack8.mp3',
  // '/audio/munchquack9.mp3',
  '/audio/munchquack10.mp3'
].map(soundFile => new Audio(soundFile));

export default quacks;

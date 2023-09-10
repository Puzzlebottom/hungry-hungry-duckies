
const Sounds = {
  quacks: [
    '/audio/quack-1.mp3',
    '/audio/quack-2.mp3',
    '/audio/quack-3.mp3',
    '/audio/quack-4.mp3',
  ].map(soundFile => new Audio(soundFile)),

  music: [
    '/audio/song-loading.mp3',
    '/audio/song-menu.mp3',
    '/audio/song-theme.mp3',
  ].map(soundFile => new Audio(soundFile))
};

export default Sounds;

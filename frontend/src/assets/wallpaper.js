const backgrounds = {
  home: [
    { layer: '/wallpaper/home-background.png', rotation: 0 },
    { layer: '/wallpaper/home-midground.png', rotation: 0 },
    { layer: '/wallpaper/home-foreground.png', rotation: 0 }
  ],

  loading: [
    { layer: '/wallpaper/loading-background.png', rotation: 0 },
    { layer: '/wallpaper/loading-midground.png', rotation: 0 },
    { layer: '/wallpaper/loading-foreground.png', rotation: 0 }
  ],

  table: [
    { layer: '/wallpaper/table-background.png', rotation: 0 },
    { layer: '/wallpaper/table-right.png', rotation: 90 * Math.PI / 180 },
    { layer: '/wallpaper/table-left.png', rotation: 90 * Math.PI / 180 },
    { layer: '/wallpaper/table-top.png', rotation: 0 },
    { layer: '/wallpaper/table-bottom.png', rotation: 0 },
  ],

  postgame: [
    { layer: '/wallpaper/postgame-twinkle.gif', rotation: 22.5 * Math.PI / 180 },
    { layer: '/wallpaper/postgame-stars.png', rotation: 0 },
    { layer: '/wallpaper/postgame-planets.png', rotation: 45 * Math.PI / 180 },
    { layer: '/wallpaper/postgame-meteors.png', rotation: 45 * Math.PI / 180 },
  ]
};

export default backgrounds;

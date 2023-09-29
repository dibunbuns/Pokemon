const monsters = {
  Emby: {
    position: {
      x: 290,
      y: 326,
    },
    image: {
      src: "./IMG/embySprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Ember],
  },

  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./IMG/draggleSprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Ember],
  },
};

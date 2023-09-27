const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const battlezonesMap = [];
for (let i = 0; i < battlezonesData.length; i += 70) {
  battlezonesMap.push(battlezonesData.slice(i, 70 + i));
}

const boundaries = [];
const offset = {
  x: -675,
  y: -400,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battlezones = [];

battlezonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battlezones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "./img/Pokemon Map.png";

const ForegroundImg = new Image();
ForegroundImg.src = "./img/ForegroundImg.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 2.185 / 6,
    y: canvas.height / 2 + 110 / 1.15,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    Up: playerUpImage,
    Right: playerRightImage,
    Left: playerLeftImage,
    Down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: ForegroundImg,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battlezones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
};

function animate() {
  const animationid = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battlezones.forEach((battlezone) => {
    battlezone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  if (keys.s.pressed || keys.a.pressed || keys.w.pressed || keys.d.pressed) {
    for (let i = 0; i < battlezones.length; i++) {
      const battlezone = battlezones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battlezone.position.x + battlezone.width
        ) -
          Math.max(player.position.x, battlezone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battlezone.position.y + battlezone.height
        ) -
          Math.max(player.position.y, battlezone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battlezone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.05
      ) {
        window.cancelAnimationFrame(animationid);

        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();
        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initiateBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  player.image = player.sprites.Down;
  if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 2,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 2;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.Left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 2,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 2;
      });
  } else if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.Up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 2,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 2;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.Right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 2,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 2;
      });
  }
}
//animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});

/*
Based on the code provided, there are some issues that might affect the collision detection and player movement:

Case Sensitivity: JavaScript is case-sensitive, and in the collision checks inside the animate function, 
there is a mismatch in the property name used for the Y coordinate. 
It should be lowercase "y" (e.g., y: boundary.position.y + 2) instead of uppercase "Y" (Y: boundary.position.y + 2).
The same applies to other occurrences of the "Y" coordinate.

Overlapping Boundaries: The collision checks are only performed if the player is moving in a specific direction 
(keys.w.pressed, keys.a.pressed, etc.) and if the last key pressed (lastKey) matches the direction. 
This approach could lead to the player moving into the boundaries if multiple keys are pressed simultaneously. 
It's better to separate the collision detection from the movement direction checks.

Movement Speed: The player's movement speed is fixed at 2 pixels per frame in each direction. 
It's better to decouple the movement speed from the frame rate to ensure smooth movement across different devices.

Delta Time: To achieve consistent movement across different frame rates, consider using delta 
time (the time elapsed between frames) to update the player's position based on the movement speed.

Edge Handling: The current implementation allows the player to move outside the canvas boundaries. 
You might want to add checks to prevent the player from going beyond the game world's limits.

Collision Precision: The current collision detection is based on rectangular collision between the player and the boundaries. 
Depending on the game's requirements, you might want to consider using more advanced collision detection techniques, 
such as pixel-perfect collision or incorporating a physics engine.

Optimizations: Depending on the size of the game world and the number of boundaries, 
the current collision detection approach might not be efficient. If performance becomes an issue, 
you can explore techniques like spatial partitioning or broad-phase collision detection to optimize the collision checks.

Overall, while the current code provides a basic implementation of collision detection and player movement, 
it can be improved to handle more complex scenarios and provide a smoother game play experience. 
Addressing the above issues and considering further optimizations will help to enhance the collision behavior in the game.
*/

//make scorbunny pixel animation instead: just create 4 various image of scorbunny and change img source....piskelapp//

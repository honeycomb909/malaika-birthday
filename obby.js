// ---------- CANVAS SETUP ----------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let animationId;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ---------- PLAYER ----------
const player = {
  x: 20,
  y: HEIGHT - 40,
  w: 18,
  h: 18,
  vx: 0,
  vy: 0,
  speed: 2,
  jump: -6,
  grounded: false
};

// ---------- PLATFORMS ----------
const platforms = [
  { x: 0, y: HEIGHT - 20, w: WIDTH, h: 20 },
  { x: 60, y: 160, w: 60, h: 10 },
  { x: 150, y: 120, w: 60, h: 10 },
  { x: 240, y: 80, w: 60, h: 10 }
];

// ---------- GOAL ----------
const goal = {
  x: 280,
  y: 40,
  r: 10
};

// ---------- INPUT ----------
const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// Mobile buttons
document.querySelectorAll(".control-btn").forEach(btn => {
  const dir = btn.dataset.dir;

  btn.addEventListener("touchstart", () => keys[dir] = true);
  btn.addEventListener("touchend", () => keys[dir] = false);
});

// ---------- PHYSICS ----------
function update() {
  // Horizontal movement
  if (keys["ArrowLeft"] || keys["a"] || keys["left"]) {
    player.vx = -player.speed;
  } else if (keys["ArrowRight"] || keys["d"] || keys["right"]) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }

  // Jump
  if (
    (keys["ArrowUp"] || keys["w"] || keys[" "] || keys["jump"]) &&
    player.grounded
  ) {
    player.vy = player.jump;
    player.grounded = false;
  }

  // Gravity
  player.vy += 0.3;

  // Apply velocity
  player.x += player.vx;
  player.y += player.vy;

  // Bounds
  player.x = Math.max(0, Math.min(WIDTH - player.w, player.x));

  // Platform collision
  player.grounded = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h < p.y + 10 &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  });

  // Fall reset (forgiving)
  if (player.y > HEIGHT) {
    player.x = 20;
    player.y = HEIGHT - 40;
    player.vy = 0;
  }

  // Win check
  const dx = player.x - goal.x;
  const dy = player.y - goal.y;
  if (Math.sqrt(dx * dx + dy * dy) < goal.r + player.w / 2) {
    finishObby();
  }
}

// ---------- DRAW ----------
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Platforms
  ctx.fillStyle = "#fbcfe8";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  // Player
  ctx.fillStyle = "#60a5fa";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Goal
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI * 2);
  ctx.fill();
}

// ---------- LOOP ----------
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

// ---------- FINISH ----------
function finishObby() {
  cancelAnimationFrame(animationId);

  setTimeout(() => {
    // Hide obby
    document.getElementById("obbyScreen").classList.add("hidden");

    // Show DTI screen instead of main
    document.getElementById("dtiScreen").classList.remove("hidden");
  }, 500);
}

// ---------- START ----------
loop();
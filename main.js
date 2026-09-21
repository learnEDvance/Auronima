// Auronima rendering engine — Canvas 2D seed.
//
// Pipeline (mirrors the spec in rendering engine1.txt):
//   Update Manager -> Spatial Processor -> Projection -> Ordering -> Render Preparation
//
// Spec formulas, applied literally per object:
//   m = k / z                 size (z here = distance to camera)
//   theta = atan2(x|y, z)     screen position (pure angular projection)
//   g = z / 0.25              transparency, fades as object passes z < 0.25
//   ordering: zn .. z1        painter's algorithm, far to near

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');

// ---- Config ----------------------------------------------------------------
const config = {
  k: 1.6,           // scale constant in m = k / z
  nearFade: 0.25,   // z below this fades out (g = z / 0.25)
  fov: 60,          // vertical field of view (degrees)
  minDist: 0.05,    // never let an object pass through the camera
  maxDist: 60,
};

const cam = { z: 6 };
const sq = { x: 0, y: 0, z: 0, half: 0.6 };

let w = 1, h = 1;
const pxRatio = window.devicePixelRatio || 1;
function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * pxRatio;
  canvas.height = h * pxRatio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
resize();
window.addEventListener('resize', resize);

// ---- Controls ---------------------------------------------------------------
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'r') { cam.z = 6; sq.x = 0; sq.y = 0; sq.z = 0; }
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  cam.z *= Math.exp(e.deltaY * 0.001);
  cam.z = Math.max(0.3, Math.min(60, cam.z));
}, { passive: false });

// ---- Projection (spec math) ---------------------------------------------------
// Returns the square's screen x/y in px, half-size in px, and opacity.
function project(o) {
  const dist = Math.min(config.maxDist, Math.max(config.minDist, cam.z - o.z));
  const fovY = config.fov * Math.PI / 180;
  const pxPerRad = (h / pxRatio) / fovY; // pixels per radian (constant, no z)

  // m = k / z  ->  scale directly gives size. No extra perspective multiplier.
  const scale = config.k / dist;
  const halfSizePx = o.half * scale * pxPerRad;

  // theta = atan2(offset, z)  ->  angular position -> screen px.
  const thetaX = Math.atan2(o.x, dist);
  const thetaY = Math.atan2(o.y, dist);
  const halfAngX = fovY * (w / pxRatio) / (h / pxRatio) / 2; // fov/2 for x (aspect-correct)
  const halfAngY = fovY / 2;
  const px = (w / pxRatio) / 2 + (thetaX / halfAngX) * ((w / pxRatio) / 2);
  const py = (h / pxRatio) / 2 - (thetaY / halfAngY) * ((h / pxRatio) / 2);

  // g = z / 0.25  (opacity; 1 while far, fades as dist drops below 0.25)
  let opacity = 1;
  if (dist < config.nearFade) opacity = dist / config.nearFade;

  return { px, py, halfSizePx, opacity, dist, scale };
}

// ---- Render -------------------------------------------------------------------
function drawSquare(p) {
  if (p.opacity <= 0 || p.halfSizePx <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, p.opacity));
  ctx.beginPath();
  ctx.rect(p.px - p.halfSizePx, p.py - p.halfSizePx, p.halfSizePx * 2, p.halfSizePx * 2);
  ctx.fillStyle = '#1d8cf2';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#b6dcff';
  ctx.stroke();
  ctx.restore();
}

function frame(time) {
  // --- Update Manager: input -> world movement.
  // Move the world in a constant human-speed (units per second), then let
  // the projection convert to screen space. On-screen speed then follows
  //   d(px)/dt = (H/fov) * dist/(dist^2 + x^2) * vx
  // so a CLOSE object sweeps FAST and a FAR one slow (natural perspective).
  // Same formula for x and y. dt from rAF timestamps.
  const dt = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
  lastTime = time;

  const speed = 3.0; // world units per second
  const inp = { x: 0, y: 0, z: 0 };
  if (keys['w']) inp.z += speed;          // W = closer to camera
  if (keys['s']) inp.z -= speed;          // S = farther
  if (keys['a']) inp.x -= speed;
  if (keys['d']) inp.x += speed;
  if (keys['q']) inp.y += speed;
  if (keys['e']) inp.y -= speed;

  sq.x += inp.x * dt;
  sq.y += inp.y * dt;
  sq.z += inp.z * dt;

  // --- Spatial Processor + Projection.
  const p = project(sq);
  const fovY = config.fov * Math.PI / 180;
  const pw = (h / fovY) * (p.dist / (p.dist * p.dist + sq.x * sq.x)); // px per world-unit-x
  const ph = (h / fovY) * (p.dist / (p.dist * p.dist + sq.y * sq.y)); // px per world-unit-y
  const onX = Math.abs(inp.x) * pw; // on-screen px/sec
  const onY = Math.abs(inp.y) * ph;

  // --- Ordering: painter's algorithm. Single object now; sort desc by dist
  //     once multiple objects exist so farthest draws first.
  //     (objects = [{ data, proj }]).sort((a,b)=>b.dist-a.dist)

  // --- Render Preparation + draw.
  ctx.setTransform(pxRatio, 0, 0, pxRatio, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  drawSquare(p);

  hud.textContent =
    `dist z            = ${p.dist.toFixed(3)}\n` +
    `scale m=k/z       = ${p.scale.toFixed(3)}\n` +
    `screen size       = ${(p.halfSizePx*2).toFixed(1)} px\n` +
    `opacity g=z/0.25  = ${p.opacity.toFixed(3)}\n` +
    `screen center     = ${p.px.toFixed(1)}, ${p.py.toFixed(1)}\n` +
    `on-screen speed   = ${onX.toFixed(0)} px/s (x)  ${onY.toFixed(0)} px/s (y)`;

  requestAnimationFrame(frame);
}

let lastTime = performance.now();
requestAnimationFrame(frame);
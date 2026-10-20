import * as THREE from "three";

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//scene:black void(questioning life)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//camera:still(live cam in 1.3)
const camera = new THREE.PerspectiveCamera(
  60,                                    // fov (deg)
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,                                   // near
  10000                                  // far
);
camera.position.set(0, 0, 5); // 5u away from square in z

//DA square
//in x/y plane. at z=0, size=2*2
const square = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: 0x39ff14 }) //cyberpunk neon, hell yeah!
);
scene.add(square);

const grid = new THREE.GridHelper(100, 100, 0x3a4256, 0x22262f);
grid.position.y = -2; //grid placed at y=-2
scene.add(grid);

//keebmap
const keys = {
  a: false, d: false,                   //(-/+)x
  arrowleft: false, arrowright: false,  //(-/+)x
  w: false, s: false,                   //(-/+)z forward/backward
  arrowup: false, arrowdown: false,     //(-/+)z
  " ": false,                           //(+/-)y up
  shift: false,                         //(+/-)y down
}
//keeb events
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k in keys) keys[k] = true;
});

window.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  if (k in keys) keys[k] = false;
});

//prevent window focus loss issues
window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
});

//framedraw
//framegen loop
function draw() {
  renderer.render(scene, camera);
}

//move time forward
 let last = performance.now(); //prev frame
  
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1); //time interval
    last = now; //update last framegen timestamp

    //1.3.3: which direction?
    let dx = 0, dy = 0, dz = 0;
    if (keys.a || keys.arrowleft) dx -= 1;             //x
    if (keys.d || keys.arrowright) dx += 1;            //x
    if (keys[" "]) dy += 1;                            //y: space = up
    if (keys.shift) dy -= 1;                           //y: shift = down
    if (keys.w || keys.arrowup) dz -= 1;               //z: w/↑ = forward
    if (keys.s || keys.arrowdown) dz += 1;             //z: s/↓ = backward

    //fix physics: dir × speed × time
    const len = Math.hypot(dx, dy, dz);
    if (len > 1) { dx /= len; dy /= len; dz /= len; }
    const SPEED = 10;
    camera.position.x += dx * SPEED * dt;
    camera.position.y += dy * SPEED * dt;
    camera.position.z += dz * SPEED * dt;

    draw(); //draw the damn frame

    requestAnimationFrame(frame); //asks for current frame
  }
  requestAnimationFrame(frame);

//change screen aspect ratio with real screen
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  draw();
});
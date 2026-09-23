import * as THREE from "three";

// ------------------------------------------------------------------ renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------------------------------------- scene: the black screen
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// --------------- camera: exists but frozen (movement comes in step 1.3) ------
const camera = new THREE.PerspectiveCamera(
  60,                                    // fov (degrees)
  window.innerWidth / window.innerHeight, // aspect
  0.1,                                   // near
  10000                                  // far
);
camera.position.set(0, 0, 5); // parked in front of the square; aim untouched (fixed orientation)

// --------------------------------------------------------------- the square --
// PlaneGeometry lies flat in the x/y plane at z = 0, facing the camera.
const square = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ color: 0x39ff14 }) // bright neon green; no lights needed
);
scene.add(square);

// -------------------------------------------------------- draw a single frame
// 1.1 spec: exactly one render call. Step 1.3 replaces this with the loop.
function draw() {
  renderer.render(scene, camera);
}
draw();

// Small nicety: keep the square centered and undistorted when the window
// changes size. Still no loop — this only redraws when the window actually changes.
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  draw();
});
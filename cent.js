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

//framedraw
//1 framegen call.WIP to loop it
function draw() {
  renderer.render(scene, camera);
}
draw();

//change screen aspect ratio with real screen
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  draw();
});
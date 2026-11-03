import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
// camera.position.set(6, 4, 10);
camera.lookAt(0, 0, 0); 

const blanc = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, wireframe: true});

const sphere_1 = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), blanc);
sphere_1.position.x = -2;
scene.add(sphere_1);

const sphere_2 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), blanc);
sphere_2.position.x = 0;
scene.add(sphere_2);

const renderer = new THREE.WebGLRenderer();

const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0);            // on tourne autour du milieu du mât
controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 25;
// controls.maxPolarAngle = Math.PI / 2 - 0.05; // jamais sous le sol
controls.update();

function redimensionner() {
  const largeur = conteneur.clientWidth;
  const hauteur = conteneur.clientHeight;
  if (largeur === 0 || hauteur === 0) return;
  camera.aspect = largeur / hauteur;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(largeur, hauteur);
}
redimensionner();
new ResizeObserver(redimensionner).observe(conteneur);

function animation(time) {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);


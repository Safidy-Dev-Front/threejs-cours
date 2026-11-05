import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); // aspect réglé par redimensionner()
camera.position.set(6, 4, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);   

const rouge_candy = new THREE.MeshStandardMaterial({ color: 0xcc2222, wireframe: false, roughness: 0.6 });
const car = new THREE.Group();
scene.add(car);

const body = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 7), rouge_candy);
body.position.y = 1;
car.add(body);

const cabin = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 6), rouge_candy);
cabin.position.set(0, 2, 0);
car.add(cabin);

const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
wheelGeometry.rotateZ(Math.PI / 2);
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const wheelPositions = [
  [-2, 0.4, -2], // arrière gauche
  [2, 0.4, -2],  // arrière droite
  [-2, 0.4, 2],  // avant gauche
  [2, 0.4, 2]    // avant droite
];
wheelPositions.forEach(pos => {
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(...pos);
  car.add(wheel);
});
const VITESSE = 5;        // unités par seconde
const RAYON_CERCLE = 10;


let tempsPrecedent = null;

renderer.setAnimationLoop((temps) => {
    // temps est en millisecondes ; delta en secondes
    const delta = tempsPrecedent === null ? 0 : (temps - tempsPrecedent) / 1000;
    tempsPrecedent = temps;
    car.rotation.y += (VITESSE / RAYON_CERCLE) * delta;   // virage constant
    car.translateZ(VITESSE * delta); 
    controls.update();
    renderer.render(scene, camera);
});

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
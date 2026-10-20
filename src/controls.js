import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101418);
scene.fog = new THREE.Fog(0x101418, 1, 1000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2 - 0.05; 

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhongMaterial({ color: 0xffff00 , wireframe: false }); // réagit à la lumière
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);
const lumiere_ambiance = new THREE.DirectionalLight(0xffffff, 1);
scene.add(cube);
scene.add(cube1);
scene.add(cube2);
cube.position.x = 2;
cube.position.y = 0;
cube.position.z = 0;
cube1.position.x = -2;
cube1.position.y = 0;
cube1.position.z = 0;
cube2.position.x = 0;
cube2.position.y = 0;
cube2.position.z = 0;
camera.position.x = 0;
 camera.position.y = 0;
 camera.position.z = 5;

scene.add(lumiere_ambiance);        // lumière d'ambiance, partout
const lumiere = new THREE.DirectionalLight(0xffffff, 3); // comme le soleil
lumiere.position.set(5, 15, 10);
scene.add(lumiere);
const timer = new THREE.Timer();

const charniere = new THREE.Group();
charniere.position.set(-4, 0, -4);
scene.add(charniere);

const porte = new THREE.Mesh(
  new THREE.BoxGeometry(2, 3, 0.1),
  new THREE.MeshPhongMaterial({ color: 0x8b5a2b })
);
porte.position.set(1, 0, 0);
charniere.add(porte);

// Scénario de la porte (en secondes) : s'ouvre, reste ouverte, se ferme, reste fermée, puis recommence
const DUREE_MOUVEMENT = 1;
const DUREE_OUVERTE = 2;
const DUREE_FERMEE = 2;
const ANGLE_OUVERT = -Math.PI / 2;
const CYCLE = DUREE_MOUVEMENT + DUREE_OUVERTE + DUREE_MOUVEMENT + DUREE_FERMEE;

function ouverturePorte(temps) {
  const t = temps % CYCLE; // position dans le cycle, repart à 0 à chaque boucle
  if (t < DUREE_MOUVEMENT) {
    return t / DUREE_MOUVEMENT;                                      // ouverture : 0 → 1
  }
  if (t < DUREE_MOUVEMENT + DUREE_OUVERTE) {
    return 1;                                                        // ouverte
  }
  if (t < DUREE_MOUVEMENT * 2 + DUREE_OUVERTE) {
    return 1 - (t - DUREE_MOUVEMENT - DUREE_OUVERTE) / DUREE_MOUVEMENT; // fermeture : 1 → 0
  }
  return 0;                                                          // fermée
}

function redimensionner(conteneur) {
  const largeur = conteneur.clientWidth;
  const hauteur = conteneur.clientHeight;
  if (largeur === 0 || hauteur === 0) return;   // conteneur masqué : ne rien faire

  camera.aspect = largeur / hauteur;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(largeur, hauteur);
}

const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);
redimensionner(conteneur);                                   // taille initiale
new ResizeObserver(() => redimensionner(conteneur)).observe(conteneur);

renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  const delta = timer.getDelta();

  controls.update(delta);   
  const s = 1 + 0.2 * Math.sin(timer.getElapsed() * 3);
    cube.scale.setScalar(s);
  const ouverture = THREE.MathUtils.smoothstep(ouverturePorte(timer.getElapsed()), 0, 1); // démarre et s'arrête en douceur
  charniere.rotation.y = ANGLE_OUVERT * ouverture;
//   controls.addEventListener('change', () => renderer.render(scene, camera));
  renderer.render(scene, camera); 
});




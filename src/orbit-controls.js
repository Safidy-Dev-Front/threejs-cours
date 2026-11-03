import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const blanc = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.6 });
const fabriques = [
  () => new THREE.MeshBasicMaterial({ color: 0xf2f2f2 }),
  () => new THREE.MeshLambertMaterial({ color: 0xf2f200 }),
  () => new THREE.MeshStandardMaterial({ color: 0x00f2f2, roughness: 0.6 }),
];
let indice = 2;                 // on démarre sur le Standard d'origine
let materiauActuel = blanc;

const sol = new THREE.Mesh(
    new THREE.PlaneGeometry( 40, 40),
     new THREE.MeshStandardMaterial({ color: 0x7fa86a })
);
sol.rotation.x = -Math.PI / 2;
scene.add(sol);

const eolienne = new THREE.Group();
scene.add(eolienne);

const mat = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 6, 24), blanc);
mat.position.y = 3;                      // cylindre centré : on le monte de la moitié de sa hauteur
eolienne.add(mat);

const nacelle = new THREE.Group();       // pivot horizontal, en haut du mât
nacelle.position.y = 6;
eolienne.add(nacelle);

const capot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.2), blanc);
nacelle.add(capot);


const rotor = new THREE.Group();         // pivot des pales, à l'avant du capot
rotor.position.z = 0.7;
nacelle.add(rotor);

rotor.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12), blanc));

const geoPale = new THREE.BoxGeometry(0.25, 2.5, 0.05);

for (let i = 0; i < 3; i++) {
  const bras = new THREE.Group();        // pivot de la pale, au centre du moyeu
  bras.rotation.z = (i * Math.PI * 2) / 3; // 0°, 120°, 240°
  const pale = new THREE.Mesh(geoPale, blanc);
  pale.position.y = 1.35;                // demi-longueur de la pale + rayon du moyeu
  bras.add(pale);
  rotor.add(bras);
}


const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); // aspect réglé par redimensionner()
camera.position.set(6, 4, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0);            // on tourne autour du milieu du mât
controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 25;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // jamais sous le sol
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

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'm') return;
  indice = (indice + 1) % fabriques.length;
  const nouveau = fabriques[indice]();

  eolienne.traverse((objet) => {
    if (objet.isMesh && objet.material === materiauActuel) objet.material = nouveau;
  });

  materiauActuel.dispose();     // l'ancien n'est plus utilisé : on libère le GPU
  materiauActuel = nouveau;
});

const timer = new THREE.Timer();
timer.connect(document);


renderer.setAnimationLoop((time) => {
    timer.update(time);
  const delta = timer.getDelta();
  const elapsed = timer.getElapsed();

  rotor.rotation.z += 2 * delta;                       // les pales : 2 rad/s
  nacelle.rotation.y = 0.5 * Math.sin(elapsed * 0.3);  // la nacelle suit le vent (±0,5 rad)

  controls.update(delta);
  renderer.render(scene, camera);
});
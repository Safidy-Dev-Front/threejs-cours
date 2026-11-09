import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xbfd8ee);
// scene.background = new THREE.Color(t);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const materiau = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.6 });

const profil = [];
for (let i = 0; i <= 10; i++) {
  const y = i * 0.3;                          // de 0 à 3 unités de haut
  const rayon = 0.5 + Math.sin(i * 0.5) * 0.4; // un galbe de vase
  profil.push(new THREE.Vector2(rayon, y));
}
const vase = new THREE.Mesh(new THREE.LatheGeometry(profil, 48), materiau);

const facade = new THREE.Shape();
facade.moveTo(0, 0);
facade.lineTo(2, 0);
facade.lineTo(2, 1);
facade.lineTo(1, 1.6);   // le pignon
facade.lineTo(0, 1);
facade.closePath();

const maison = new THREE.Mesh(
  new THREE.ExtrudeGeometry(facade, { depth: 1.5, bevelEnabled: false }),
  materiau
);
maison.position.y = 1.5;
maison.rotation.x = Math.PI / 2;

scene.add(maison);

scene.add(vase);

const geo = new THREE.BufferGeometry();
const positions = new Float32Array([
  -1, 0, 0,
  1, 0, 0,
  0, 1.5, 0
]);
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const triangle = new THREE.Mesh(geo, materiau);
triangle.position.set(-2, 0.5, -2);
scene.add(triangle);

const quad = new THREE.BufferGeometry();
quad.setAttribute('position', new THREE.Float32BufferAttribute([
  -1, -1, 0,    1, -1, 0,    1, 1, 0,    -1, 1, 0,   // sommets 0, 1, 2, 3
], 3));

quad.setAttribute('uv', new THREE.Float32BufferAttribute([
   0, 0,         1, 0,        1, 1,        0, 1,    // coin de texture de chaque sommet
], 2));
quad.setIndex([0, 1, 2,   2, 3, 0]);   // deux triangles, sens antihoraire
quad.computeVertexNormals();

const carre = new THREE.Mesh(quad, materiau);
carre.position.set(2, 0.5, -2);
scene.add(carre);

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

renderer.setAnimationLoop((temps) => {
    renderer.render(scene, camera);
});
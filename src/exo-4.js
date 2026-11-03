import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);
const sol = new THREE.Mesh(
    new THREE.PlaneGeometry( 40, 40),
     new THREE.MeshStandardMaterial({ color: 0x7fa86a })
);
sol.rotation.x = -Math.PI / 2;
scene.add(sol);


const table = new THREE.Group();
table.position.y = 3; // hauteur des pieds : leur base (-3 dans le groupe) touche le sol
scene.add(table);
const treecolor = new THREE.MeshStandardMaterial({ color: 0x664704, roughness: 0.6 });
const plateau = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 4), treecolor);
plateau.position.y = 0.0; // on le monte de la moitié de sa hauteur
table.add(plateau);

const pied1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), treecolor);
pied1.position.set(-2.8, -1.5, -1.8);
table.add(pied1);

const pied2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), treecolor);
pied2.position.set(2.8, -1.5, -1.8);
table.add(pied2);

const pied3 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), treecolor);
pied3.position.set(-2.8, -1.5, 1.8);
table.add(pied3);

const pied4 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), treecolor);
pied4.position.set(2.8, -1.5, 1.8);
table.add(pied4);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); // aspect réglé par redimensionner()
camera.position.set(6, 4, 10);
camera.lookAt(0, 0, 0);                  // sans OrbitControls, la caméra regarde -Z par défaut : on la tourne vers les objets



const renderer = new THREE.WebGLRenderer({ antialias: true });
const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);

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


const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.05; // jamais sous le sol

renderer.setAnimationLoop((time) => {

  renderer.render(scene, camera)
});
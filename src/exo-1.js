import * as THREE from 'three';

console.log("exo-1.js chargé");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const six_geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.ConeGeometry(0.5, 1, 32),
  new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  new THREE.TetrahedronGeometry(0.5)
];
const blanc = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.6 });

six_geometries.forEach((geo , i)=> {
  const forme = new THREE.Mesh(geo, blanc);
  forme.position.x = (i - 2.5) * 2;   
  scene.add(forme);
});

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

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
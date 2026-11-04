import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8ee);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const lumiere = new THREE.DirectionalLight(0xffffff, 2);
lumiere.position.set(5, 10, 7);
scene.add(lumiere);

const horloge = new THREE.Group();
scene.add(horloge);
const blanc = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.6 });

const cadran = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.1, 32), blanc);
cadran.rotation.x = -Math.PI / 2;
horloge.add(cadran);

const create_aiguille = (largeur, longueur, color , z) => {
    const pivot = new THREE.Group();   // au centre du cadran
  pivot.position.z = z;              // un peu devant le cadran, chaque aiguille sur son plan
  const aiguille = new THREE.Mesh(
    new THREE.BoxGeometry(largeur, longueur, 0.02),
    new THREE.MeshStandardMaterial({ color: color })
  );
  aiguille.position.y = longueur / 2; // une extrémité sur le pivot, l'autre vers midi
  pivot.add(aiguille);
  horloge.add(pivot);
  return pivot;
}

const heures   = create_aiguille(0.25, 2.5, 0x222222, 0.07);
const minutes  = create_aiguille(0.15, 3.8, 0x222222, 0.10);
const secondes = create_aiguille(0.05, 4.3, 0xcc2222, 0.13);


const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); // aspect réglé par redimensionner()
camera.position.set(6, 4, 10);
camera.lookAt(0, 0, 0);      

const renderer = new THREE.WebGLRenderer({ antialias: true });
const conteneur = document.querySelector('#scene-3d');
conteneur.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);            // on tourne autour du centre du cadran
controls.maxPolarAngle = Math.PI / 2 - 0.05; // jamais sous le sol

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
    const d = new Date();                // relue à chaque image, sinon les aiguilles restent figées
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const m = d.getMinutes() + s / 60;
    const h = (d.getHours() % 12) + m / 60;

    secondes.rotation.z = -(s / 60) * Math.PI * 2;   // négatif = sens horaire vu de face
    minutes.rotation.z  = -(m / 60) * Math.PI * 2;
    heures.rotation.z   = -(h / 12) * Math.PI * 2;
    controls.update();                   // obligatoire avec enableDamping
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);
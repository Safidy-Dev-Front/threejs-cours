import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101418);
scene.fog = new THREE.Fog(0x101418, 1, 1000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

function profondeur(objet) {
  let n = 0;
  while (objet.parent) {
    objet = objet.parent;
    n++;
  }
  return n;
}
let detache = false; 
const posMode = new THREE.Vector3();


const systemSolaire = new THREE.Group();
systemSolaire.name = "System Solaire";
scene.add(systemSolaire);

const soleil = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
soleil.name = "Soleil";
systemSolaire.add(soleil);

const terre = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
terre.position.x = 15;
terre.name = "Terre";
const orbitTerre = new THREE.Group();
systemSolaire.add(orbitTerre);
orbitTerre.add(terre);
orbitTerre.name = "Orbit Terre";

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
mars.position.x = 10;
mars.name = "Mars";
const orbitMars = new THREE.Group();
systemSolaire.add(orbitMars);
orbitMars.add(mars);
orbitMars.name = "Orbit Mars";
camera.position.z = 40;

const lune = new THREE.Mesh(
  new THREE.SphereGeometry(0.27, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x888888 })
);
lune.name = "Lune";
lune.position.x = 2;
terre.add(lune);

const timer = new THREE.Timer();



scene.traverse((object) => {
   console.log('  '.repeat(profondeur(object)) + `${object.name} (${object.type})`);
});

function afficher(etape) {
  lune.getWorldPosition(posMode);
  console.log(
    etape,
    'local :', lune.position.toArray().map((v) => v.toFixed(2)),
    'monde :', posMode.toArray().map((v) => v.toFixed(2))
  );
}



renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  const delta = timer.getDelta(); // en secondes
  orbitTerre.rotation.z += 0.5 * delta;   // vitesse de la Terre (radians/seconde)
  orbitMars.rotation.z  += 0.35 * delta;  // Mars, plus lente
  terre.rotation.z += 2.5 * delta;
  
  if (!detache && timer.getElapsed() > 5) {
    afficher('avant');
    // scene.add(lune);          // version 1
    scene.attach(lune);    // version 2 : commentez la ligne au-dessus
    afficher('après');
    detache = true;          // pour ne le faire qu'une fois
  }else if (detache && timer.getElapsed() > 10) {
    afficher('avant');
    orbitTerre.attach(lune); // version 2 : commentez la ligne au-dessus
    afficher('après');
    detache = false;         // pour ne le faire qu'une fois
  }

  renderer.render(scene, camera);
});
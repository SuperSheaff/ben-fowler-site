import '../css/style.css'
import '../css/fonts.css'

import * as THREE from 'three';

import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';
import { MTLLoader }      from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader }      from 'three/examples/jsm/loaders/OBJLoader';

const scene       = new THREE.Scene();
scene.background  = new THREE.Color('#232323');

const camera      = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer    = new THREE.WebGLRenderer({
  canvas: document.querySelector('#hero__background'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setY(23);
camera.position.setZ(11);

renderer.render(scene, camera);

var   oshIcon;
const material      = new THREE.MeshStandardMaterial({ color: 0xC4C4C4 });
const objectLoader  = new OBJLoader();
  
objectLoader.load('/assets/3D/icon__osh.obj', function(object) {
  object.traverse( function( child ) {
      if ( child instanceof THREE.Mesh ) {
          child.material = material;
      }
  } );
  oshIcon = object;
  scene.add( object );
});

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

var handler = function (element, type, func) {
  if (element.addEventListener) {
    element.addEventListener(type, func, false);
  } else if (window.attachEvent) {
    element.attachEvent("on" + type, func);
  } else {
    element["on" + type] = func;
  }
};

let canvas = document.querySelector('#hero__background')
// NOTE: this function will set the camera to follow the box
handler(canvas, "mousemove", function (event) {

  var offX = 0;
  var offY = 0;
  if (typeof window.pageXOffset != "undefined") {
    offX = window.pageXOffset;
    offY = window.pageYOffset;
  }
  else {
    if (document.documentElement.scrollTop == 0) {
      offX = document.body.scrollLeft;
      offY = document.body.scrollTop;
    }
    else {
      offX = document.documentElement.scrollLeft;
      offY = document.documentElement.scrollTop;
    }
  }
  var x, y;
  if (typeof event.pageX != "undefined") {
    x = event.pageX;
    y = event.pageY;
  }
  else {
    x = event.clientX;
    y = event.clientY;
  }
  x -= offX;
  y -= offY;
  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }

  // NOTE: move the camera
  oshIcon.rotation.x += (y - window.innerHeight / 2) / window.innerWidth;
  oshIcon.rotation.y += (x - window.innerWidth / 2) / window.innerHeight;

  animate();

});

function animate() {
  requestAnimationFrame(animate);

  
  // oshIcon.rotation.x += 0.01;
  // oshIcon.rotation.y += 0.01;
  // oshIcon.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})

animate();


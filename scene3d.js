import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  'use strict';

  var container = document.getElementById('model-3d-container');
  if (!container) return;

  var scene = new THREE.Scene();
  scene.background = null;

  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, 3.5);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  var ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  var key = new THREE.DirectionalLight(0xfff8e7, 1);
  key.position.set(2, 2, 4);
  scene.add(key);

  var fill = new THREE.DirectionalLight(0xc9a050, 0.5);
  fill.position.set(-2, 1, 2);
  scene.add(fill);

  var model = null;
  var scrollY = 0;

  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function onScroll() {
    scrollY = window.scrollY || document.documentElement.scrollTop;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function animate() {
    requestAnimationFrame(animate);

    if (model) model.rotation.y += 0.003;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();

  var loader = new GLTFLoader();
  loader.load(
    'altynai/hair_dryer.glb',
    function (gltf) {
      model = gltf.scene;
      var box = new THREE.Box3().setFromObject(model);
      var center = box.getCenter(new THREE.Vector3());
      var size = box.getSize(new THREE.Vector3());
      model.position.sub(center);

      var maxDim = Math.max(size.x, size.y, size.z);
      var scale = 2.2 / maxDim;
      model.scale.setScalar(scale);

      model.position.y = 0.35;

      scene.add(model);
    },
    undefined,
    function (err) {
      console.warn('3D model load error:', err);
    }
  );
})();

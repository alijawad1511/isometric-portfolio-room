import * as THREE from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.createPerspectiveCamera();
    this.createOrthographicCamera();
    this.setOrbitControls();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );

    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.z = 5;
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustumSize) / 2,
      (this.sizes.aspect * this.sizes.frustumSize) / 2,
      this.sizes.frustumSize / 2,
      -this.sizes.frustumSize / 2,
      -100,
      100
    );

    this.scene.add(this.orthographicCamera);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera,this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }

  resize() {
    // Update Perspective Camera on resize
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    // Update Orthographic Camera on resize
    this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustumSize) / 2;
    this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustumSize) / 2;
    this.orthographicCamera.top = this.sizes.frustumSize / 2;
    this.orthographicCamera.bottom = -this.sizes.frustumSize / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
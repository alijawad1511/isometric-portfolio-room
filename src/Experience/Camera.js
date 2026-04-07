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
    this.perspectiveCamera.position.x = 29;
    this.perspectiveCamera.position.y = 14;
    this.perspectiveCamera.position.z = 12;
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustumSize) / 2,
      (this.sizes.aspect * this.sizes.frustumSize) / 2,
      this.sizes.frustumSize / 2,
      -this.sizes.frustumSize / 2,
      -10,
      10
    );

    this.orthographicCamera.position.y = 3.5;
    this.orthographicCamera.position.z = 5;
    this.orthographicCamera.rotation.x = -Math.PI / 6;

    this.scene.add(this.orthographicCamera);

    // this.cameraHelper = new THREE.CameraHelper(this.orthographicCamera);
    // this.scene.add(this.cameraHelper);

    // Show 20x20 Grid
    // const size = 20;
    // const divisions = 20;
    // const gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add(gridHelper);
    
    // Axis Helper to show 3D Coordinate Lines x,y,z
    // const axesHelper = new THREE.AxesHelper( 10 );
    // this.scene.add( axesHelper );
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

    // this.cameraHelper.matrixWorldNeedsUpdate = true;
    // this.cameraHelper.update();
    // this.cameraHelper.position.copy(this.orthographicCamera.position);
    // this.cameraHelper.rotation.copy(this.orthographicCamera.rotation);
  }
}
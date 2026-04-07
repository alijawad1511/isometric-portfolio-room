import * as THREE from 'three';
import Experience from "../Experience";
import GSAP from 'gsap';

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    
    this.progress = 0;
    this.dummyVector = new THREE.Vector3();

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1
    };

    // Current Position
    this.position = new THREE.Vector3(0,0,0);

    // LookAt Position, next to current position of camera
    this.lookAtPosition = new THREE.Vector3(0,0,0);

    // Vectors to calculate direction vector outwards of circular path movement
    this.directionalVector = new THREE.Vector3(0,0,0);
    this.staticVector = new THREE.Vector3(0,1,0); // Upward (+Y Up)
    this.crossVector = new THREE.Vector3(0,0,0);

    this.setPath();
    this.onWheel();
  }

  onWheel() {
    window.addEventListener('wheel',(e) => {
      console.log(e);
      if (e.deltaY > 0) {
        // when mouse wheel scroll down
        this.lerp.target += 0.01;
      } else {
        // when mouse wheel scroll up
        this.lerp.target -= 0.01;
      }
    })
  }

  setPath() {
    // Create path which camera will follow
    this.curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( -5, 0, 0 ),
      new THREE.Vector3( 0, 0, -5 ),
      new THREE.Vector3( 5, 0, 0 ),
      new THREE.Vector3( 0, 0, 5 ),
    ],true);

    const points = this.curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry,material);
    this.scene.add(curveObject);
  } 

  resize() {}
  
  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current)
    this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target)

    // Copies current position into this.position vector (% keeps point below 1)
    this.curve.getPointAt(this.lerp.current % 1,this.position);
    // Copies this.position vector into camera position
    this.camera.orthographicCamera.position.copy(this.position);

    this.directionalVector.subVectors(
      this.curve.getPointAt((this.lerp.current % 1) + 0.000001), // Next Position Vector
      this.position // Current Position Vector
    );
    this.directionalVector.normalize(); // Make this vector a unit vector
    // crossVector will be point inward
    this.crossVector.crossVectors(
      this.directionalVector,
      this.staticVector
    )

    this.camera.orthographicCamera.lookAt(this.crossVector);
  }
}
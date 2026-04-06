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

    this.setPath();
    this.onWheel();
  }

  onWheel() {
    window.addEventListener('wheel',(e) => {
      console.log(e);
      if (e.deltaY > 0) {
        // when mouse wheel scroll down
        this.lerp.target += 0.01;
        this.back = false;
      } else {
        // when mouse wheel scroll up
        this.lerp.target -= 0.01;
        this.back = true;
      }
    })
  }

  setPath() {
    // Create path which camera will follow
    this.curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( -10, 0, 10 ),
      new THREE.Vector3( -5, 5, 5 ),
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 5, -5, 5 ),
      new THREE.Vector3( 10, 0, 10 )
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

    // Scroll up or down turn movement back or forward
    if (this.back) {
      this.lerp.target -= 0.0001;
    } else {
      this.lerp.target += 0.0001;
    }

    this.lerp.target = GSAP.utils.clamp(0,1,this.lerp.target);
    this.lerp.current = GSAP.utils.clamp(0,1,this.lerp.current);
    
    this.curve.getPointAt(this.lerp.current,this.position);
    this.curve.getPointAt(this.lerp.current+0.00001,this.lookAtPosition);

    this.camera.orthographicCamera.position.copy(this.position);
    this.camera.orthographicCamera.lookAt(this.lookAtPosition)
  }
}
import * as THREE from 'three';
import Experience from "../Experience";

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

    this.setPath();
    this.onWheel();
  }

  onWheel() {
    window.addEventListener('wheel',(e) => {
      console.log(e);
      if (e.deltaY > 0) {
        this.progress += 0.001;
      } else {
        this.progress -= 0.001;
        if (this.progress < 0) {
          this.progress = 1;
        }
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
    this.curve.getPointAt(this.progress % 1,this.dummyVector);
    // this.progress -= 0.01;
    // if (this.progress < 0) this.progress = 1;
    this.camera.orthographicCamera.position.copy(this.dummyVector);
  }
}
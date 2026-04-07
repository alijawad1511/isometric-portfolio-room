import * as THREE from 'three';
import GSAP from 'gsap';
import Experience from "../Experience";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    
    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    // Cast shadow for all children
    this.actualRoom.children.forEach(child => {


      child.castShadow = true;
      child.receiveShadow = true;
        
      if (child.type === 'Group') {
        child.children.forEach(groupChild => {
          groupChild.castShadow = true;
          groupChild.receiveShadow = true;
        })
      }

      if (child.name === 'Fishpound_Glass') {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.roughness = 0;
        child.material.color.set(0x93ddf5);
        child.material.ior = 1.5;
        child.material.transmission = 1;
        child.material.opacity = 1;
      }

      if (child.name === 'Screen') {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen
        });
      }
    })

    // Add to room scene
    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.11,0.11,0.11);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
  }

  onMouseMove() {
    window.addEventListener('mousemove',(e) => {
      this.rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.1;
      console.log(this.rotation, this.lerp.target);
    })
  }

  resize() {}
  
  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    // Rotation of room along y
    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.000001);
  }
}
import * as THREE from 'three';
import Experience from "../Experience";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    
    this.setModel();
    this.setAnimation();
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

  resize() {}
  
  update() {
    this.mixer.update(this.time.delta * 0.000001);
  }
}
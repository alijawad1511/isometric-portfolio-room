import * as THREE from 'three';

import Sizes from './utils/Sizes';
import Time from './utils/Time'

import Camera from './Camera';
import Renderer from './Renderer';

import World from './World/Room'

export default class Experience {
  static instance;

  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.time.on('resize',() => {
      this.resize();
    });

    this.time.on('update',() => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}
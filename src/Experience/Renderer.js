import * as THREE from 'three';
import Experience from './Experience';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;

    this.setRenderer();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.physicallyCorrectLights = true;
    this.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.setSize(this.sizes.width,this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.renderer.setSize(this.sizes.width,this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    // this.renderer.setViewport(0,0,this.sizes.width,this.sizes.height);
    // this.renderer.setScissorTest(false);
    this.renderer.render(this.scene,this.camera.orthographicCamera);

    // Mini viewport (top-right)
    // const w = this.sizes.width / 3;
    // const h = this.sizes.height / 3;
    // const x = this.sizes.width - w;
    // const y = this.sizes.height - h;

    // this.renderer.setViewport(x,y,w,h);
    // this.renderer.setScissor(x,y,w,h);
    // this.renderer.setScissorTest(true);

    // this.renderer.render(this.scene, this.camera.perspectiveCamera);
    // this.renderer.setScissorTest(false);
  }
}
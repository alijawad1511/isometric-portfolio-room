import { EventEmitter } from "events";
import * as THREE from 'three';

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

import Experience from '../Experience'

export default class Resource extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assets = assets;

    this.items = {}; // Hold all loaded items
    this.queue = this.assets.length; // How many items in queue to be loaded
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath('/draco/');
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    for (const asset of this.assets) {
      if (asset.type === 'glbModel') {
        this.loaders.gltfLoader.load(asset.path,(file) => {
          this.singleAssetLoaded(asset,file);
        })
      } else if (asset.type === 'videoTexture') {
        this.video = {};
        this.videoTexture = {};
  
        this.video[asset.name] = document.createElement('video');
        this.video[asset.name].src = asset.path
        this.video[asset.name].playsInline = true;
        this.video[asset.name].autoplay = true;
        this.video[asset.name].muted = true;
        this.video[asset.name].loop = true;
        const playPromise = this.video[asset.name].play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore: autoplay blocked, or play interrupted (e.g. background power saving)
            console.warn('The play() request was interrupted because video-only background media was paused to save power');
          });
        }
        
        this.videoTexture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
        this.videoTexture[asset.name].flipY = true;
        this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].generateMipmaps = false;
        this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

        this.singleAssetLoaded(asset,this.videoTexture[asset.name]);
      }
    }
  }

  singleAssetLoaded(asset,file) {
    this.items[asset.name] = file;
    this.loaded++;

    console.log(`${asset.type}:`,file);

    // Emit ready event when all assets loaded
    if (this.loaded === this.queue) {
      this.emit('ready');
    }
  }
}
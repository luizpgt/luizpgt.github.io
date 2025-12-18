import * as THREE from 'three';
import { GlobalState } from './globals.js';

export class BaseObject {
    constructor() {
        // meshes related to an object are in the same group
        this.group = new THREE.Group();
    }

    // add object to scene
    addToScene() {
        GlobalState.scene.add(this.group);
    }

    update(deltaTime) { }
}
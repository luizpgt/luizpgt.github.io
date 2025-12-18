import * as THREE from 'three';
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js'; // New Loader
import { BaseObject } from './BaseObject.js';

export class Tree extends BaseObject {
    constructor(x = 110, y = 0, z = 170) {
        super();
        this.group.position.set(x, y, z);
        this.loadModel();
    }

    loadModel() {
        const loader = new TDSLoader();

        loader.setResourcePath('assets/tree/textures/');

        loader.load('assets/tree/Tree1.3ds', (object) => {
            object.rotation.x = -Math.PI / 2; // tree lies on its side if removed

            object.scale.setScalar(8);

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.group.add(object);
            console.log('tree loaded successfully');

        }, undefined, (error) => {
            console.error('error loading tree:', error);
        });
    }
}
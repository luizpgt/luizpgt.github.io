import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { BaseObject } from './BaseObject.js';
import { GlobalState, CONFIG } from './globals.js';

export class Character extends BaseObject {
    constructor() {
        super();
        this.path = 'assets/walk.fbx';

        this.moveSpeed = 15;// + Math.floor(Math.random() * 21) - 10;

        this.group.position.x = -200 + 10 * (Math.random() * 40);
        this.group.position.z = 90 + 2 * Math.random();

        this.loadModel();
    }

    loadModel() {
        const loader = new FBXLoader();
        loader.load(this.path, (object) => {
            object.scale.setScalar(0.15);

            object.position.set(0, 0, (Math.random() * 60) - 30);

            object.rotation.y = Math.PI / 2;

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            if (object.animations && object.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(object);
                const clip = object.animations[0];
                const action = mixer.clipAction(clip);
                action.play();
                GlobalState.mixers.push(mixer);
            }

            this.group.add(object);
        });
    }

    update(deltaTime) {
        // move to right
        this.group.position.x += this.moveSpeed * deltaTime;

        // teleport
        if (this.group.position.x > 200) {
            this.group.position.x = -180 + ((Math.random() * 100) - 50);
            this.group.position.z = 90 + 2 * Math.random();
        }
    }
}
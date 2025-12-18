import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { BaseObject } from './BaseObject.js';
import { GlobalState, CONFIG } from './globals.js';

export class Owner extends BaseObject {
    constructor() {
        super();
        this.path = 'assets/walk.fbx';  // from mixamo

        this.startPos = new THREE.Vector3(0, 0, 160);
        this.endPos = new THREE.Vector3(0, 0, 120);
        this.moveSpeed = 7;

        // spin
        this.waitDuration = 2;
        this.spinSpeed = 2.5;

        this.currentState = 'TO_END';
        this.nextStateAfterSpin = 'TO_START';
        this.timer = 0;

        // start at start position
        this.group.position.copy(this.startPos);

        this.loadModel();
    }

    loadModel() {
        const loader = new FBXLoader();
        loader.load(this.path, (object) => {
            object.scale.setScalar(0.15);
            object.position.set(0, 0, 0);

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            if (object.animations && object.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(object);
                this.action = this.mixer.clipAction(object.animations[0]);
                this.action.play();
                GlobalState.mixers.push(this.mixer);
            }

            this.group.add(object);
        });
    }

    update(delta) {
        if (this.group.children.length === 0) return;

        switch (this.currentState) {
            case 'TO_END':
                this.moveTowards(this.endPos, delta, 'TO_START');
                break;

            case 'TO_START':
                this.moveTowards(this.startPos, delta, 'TO_END');
                break;

            case 'SPINNING':
                this.handleSpin(delta);
                break;
        }
    }

    moveTowards(targetVector, delta, nextMoveState) {
        const direction = new THREE.Vector3().subVectors(targetVector, this.group.position);
        const distance = direction.length();
        if (distance > 0.5) {
            this.group.lookAt(targetVector.x, this.group.position.y, targetVector.z);
        }

        if (distance > 0.5) { // moving 
            direction.normalize();
            this.group.position.add(direction.multiplyScalar(this.moveSpeed * delta));

            if (this.action && this.action.paused) {
                this.action.paused = false; // start walking
            }
        } else { // spinning
            this.group.position.copy(targetVector);
            this.currentState = 'SPINNING';
            this.nextStateAfterSpin = nextMoveState;
            this.timer = this.waitDuration;  // resets timer 

            if (this.action) {
                this.action.paused = true; // stop to spin
            }
        }
    }

    handleSpin(delta) {
        this.group.rotation.y += this.spinSpeed * delta;
        this.timer -= delta;

        if (this.timer <= 0) {
            this.currentState = this.nextStateAfterSpin;
        }
    }
}
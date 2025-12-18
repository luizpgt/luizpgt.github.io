import * as THREE from 'three';

export const CONFIG = {
    BEDROOM_ELEVATION: 80
};

export const GlobalState = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,

    // animation globals
    clock: new THREE.Clock(),
    mixers: [], // animation mixers here

    move: {
        f: false, b: false, l: false, r: false,
        velocity: new THREE.Vector3(),
        direction: new THREE.Vector3(),
    },

    prevTime: performance.now()
};
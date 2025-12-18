import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { GlobalState, CONFIG } from './globals.js';
import { Environment } from './Environment.js';
import { Bedroom } from './Bedroom.js';
import { City } from './City.js';
import { Character } from './Character.js';
import { Tree } from './Tree.js';
import { Owner } from './Owner.js';

let peasants = []
let owner;
let bedroom; // global para simplificar colisao

const playerHitbox = new THREE.Box3();
const wallBox = new THREE.Box3();

init();
animate();

function init() {
    GlobalState.scene = new THREE.Scene();
    GlobalState.scene.background = new THREE.Color(0x111111);
    GlobalState.scene.fog = new THREE.Fog(0x111111, 0, 800);

    GlobalState.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    GlobalState.camera.position.y = CONFIG.BEDROOM_ELEVATION + 10;
    GlobalState.camera.position.z = 0;
    GlobalState.camera.lookAt(0, CONFIG.BEDROOM_ELEVATION + 10, GlobalState.camera.position.z + 1);
    // ^ look at tabacaria

    GlobalState.renderer = new THREE.WebGLRenderer({ antialias: true });
    GlobalState.renderer.setPixelRatio(window.devicePixelRatio);
    GlobalState.renderer.setSize(window.innerWidth, window.innerHeight);
    GlobalState.renderer.shadowMap.enabled = true;
    document.body.appendChild(GlobalState.renderer.domElement);

    // light > 
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    GlobalState.scene.add(ambientLight);
    const cityLight = new THREE.DirectionalLight(0xaaccff, 1.5);
    cityLight.position.set(0, 300, 80);
    cityLight.castShadow = true;
    cityLight.target.position.set(0, 0, 100);
    GlobalState.scene.add(cityLight.target);
    GlobalState.scene.add(cityLight);
    // light <

    // ------------------ add objects ------------------
    const environment = new Environment();
    environment.addToScene();

    bedroom = new Bedroom();
    bedroom.addToScene();

    const city = new City();
    city.addToScene();

    for (let i = 0; i < 5; i++) {
        let char = new Character();
        char.addToScene();
        peasants.push(char);
    }

    const tree = new Tree(110, 0, 110);
    const tree2 = new Tree(-110, 0, 110);
    tree.addToScene();
    tree2.addToScene();

    owner = new Owner();
    owner.addToScene();
    // ------------------ add objects ------------------

    setupControls();
    window.addEventListener('resize', onWindowResize);
}

function setupControls() {
    GlobalState.controls = new PointerLockControls(GlobalState.camera, document.body);
    const instructions = document.getElementById('trigger-element');
    document.addEventListener('click', () => GlobalState.controls.lock());
    GlobalState.controls.addEventListener('lock', () => instructions.style.display = 'none');
    GlobalState.controls.addEventListener('unlock', () => instructions.style.display = 'block');
    GlobalState.scene.add(GlobalState.controls.getObject());

    const onKeyDown = (e) => {
        switch (e.code) {
            case 'KeyW': GlobalState.move.f = true; break;
            case 'KeyA': GlobalState.move.l = true; break;
            case 'KeyS': GlobalState.move.b = true; break;
            case 'KeyD': GlobalState.move.r = true; break;
        }
    };
    const onKeyUp = (e) => {
        switch (e.code) {
            case 'KeyW': GlobalState.move.f = false; break;
            case 'KeyA': GlobalState.move.l = false; break;
            case 'KeyS': GlobalState.move.b = false; break;
            case 'KeyD': GlobalState.move.r = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

function onWindowResize() {
    GlobalState.camera.aspect = window.innerWidth / window.innerHeight;
    GlobalState.camera.updateProjectionMatrix();
    GlobalState.renderer.setSize(window.innerWidth, window.innerHeight);
}

// player colision to walls 
function checkWallCollision() {
    const camPos = GlobalState.camera.position;
    playerHitbox.setFromCenterAndSize(camPos, new THREE.Vector3(3, 10, 3));

    for (const wall of bedroom.colliders) {
        wallBox.setFromObject(wall);
        if (playerHitbox.intersectsBox(wallBox)) {
            return true;
        }
    }
    return false;
}

function animate() {
    requestAnimationFrame(animate);

    const delta = GlobalState.clock.getDelta();

    if (GlobalState.mixers.length > 0) {
        for (const mixer of GlobalState.mixers) {
            mixer.update(delta);
        }
    }

    if (peasants.length > 0) {
        for (const peasant of peasants) {
            peasant.update(delta);
        }
    }

    if (owner) {
        owner.update(delta)
    }

    const time = performance.now();
    const move = GlobalState.move;
    const controls = GlobalState.controls;

    if (controls.isLocked === true) {
        const physicsDelta = (time - GlobalState.prevTime) / 1000;

        move.velocity.x -= move.velocity.x * 10.0 * physicsDelta;
        move.velocity.z -= move.velocity.z * 10.0 * physicsDelta;

        move.direction.z = Number(move.f) - Number(move.b);
        move.direction.x = Number(move.r) - Number(move.l);
        move.direction.normalize();

        if (move.f || move.b) move.velocity.z -= move.direction.z * 400.0 * physicsDelta;
        if (move.l || move.r) move.velocity.x -= move.direction.x * 400.0 * physicsDelta;

        // collision logic to x and z 

        // move in x 
        const originalX = controls.getObject().position.x;
        controls.moveRight(-move.velocity.x * physicsDelta);
        // collision in x 
        if (checkWallCollision()) {
            controls.getObject().position.x = originalX; // keeps position
            move.velocity.x = 0;
        }

        // move in z 
        const originalZ = controls.getObject().position.z;
        controls.moveForward(-move.velocity.z * physicsDelta);
        // collision in z
        if (checkWallCollision()) {
            controls.getObject().position.z = originalZ; // keeps original pos
            move.velocity.z = 0;
        }
    }

    GlobalState.prevTime = time;
    GlobalState.renderer.render(GlobalState.scene, GlobalState.camera);
}
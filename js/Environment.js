import * as THREE from 'three';
import { BaseObject } from './BaseObject.js';

export class Environment extends BaseObject {
    constructor() {
        super();
        this.createSkyBox();
        this.createGround();
    }

    createSkyBox() {
        const geometry = new THREE.BoxGeometry(500, 300, 500);
        const material = new THREE.MeshStandardMaterial({
            color: 0x82C8E5,
            side: THREE.BackSide,
            roughness: 0.8
        });

        const env = new THREE.Mesh(geometry, material);
        env.position.y = 150;
        this.group.add(env);
    }

    createGround() {
        const textureLoader = new THREE.TextureLoader();

        // load textures 
        const colorTexture = textureLoader.load('assets/ground/PavingStones138_1K-JPG_Color.jpg');
        const normalTexture = textureLoader.load('assets/ground/PavingStones138_1K-JPG_NormalGL.jpg');
        const roughnessTexture = textureLoader.load('assets/ground/PavingStones138_1K-JPG_Roughness.jpg');
        const aoTexture = textureLoader.load('assets/ground/PavingStones138_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = textureLoader.load('assets/ground/PavingStones138_1K-JPG_Displacement.jpg');

        const textureRepeat = 10;
        // repeats the tiling
        [colorTexture, normalTexture, roughnessTexture, aoTexture, displacementTexture].forEach(tex => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(textureRepeat, textureRepeat);
        });
        const geometry = new THREE.PlaneGeometry(500, 500, 100, 100);

        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,

            normalMap: normalTexture,
            normalScale: new THREE.Vector2(1, 1),

            roughnessMap: roughnessTexture,

            aoMap: aoTexture,
            aoMapIntensity: 1,

            displacementMap: displacementTexture,
            displacementScale: 2,

            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0;

        this.group.add(mesh);
    }
}
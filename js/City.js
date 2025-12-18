import * as THREE from 'three';
import { BaseObject } from './BaseObject.js';

export class City extends BaseObject {
    constructor() {
        super();
        this.createTabacaria();
        this.createBuilding();

        let poss = [
            [110, 120 + Math.random() * 140, 170], // x, height, z
            [-110, 120 + Math.random() * 140, 160],
            [-180, 120 + Math.random() * 140, 150],
        ]
        for (let i = 0; i < poss.length; i++) {
            this.createBuilding(...poss[i])
        }
    }

    createBuilding(x, h, z) {
        const w = 80;
        const d = 40;

        // texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('assets/Gemini_Generated_Image_cnsv4cnsv4cnsv4c.png');
        texture.colorSpace = THREE.SRGBColorSpace;

        const geometry = new THREE.BoxGeometry(w, h, d);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            transparent: true,
            roughness: 0.8,
            metalness: 0,

            // looks too dark if it does not emit light
            emissive: 0xffffff,
            emissiveMap: texture,
            emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        const xPos = x;
        const zPos = z;
        mesh.position.set(xPos, h / 2, zPos);
        this.group.add(mesh);
    }

    createTabacaria() {
        const w = 140;
        const h = 140 * 1.9;
        const d = 40;

        // texture 
        const loader = new THREE.TextureLoader();
        const texture = loader.load('assets/Gemini_Generated_Image_9l47rd9l47rd9l47.png');
        texture.colorSpace = THREE.SRGBColorSpace;

        const geometry = new THREE.BoxGeometry(w, h, d);

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            transparent: true,
            roughness: 0.8,
            metalness: 0,

            // textures emit light; otherwise looks too dark
            emissive: 0xffffff,
            emissiveMap: texture,
            emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);

        const xPos = 0;
        const zPos = 150;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(xPos, h / 2, zPos);
        this.group.add(mesh);
    }
}
import * as THREE from 'three';
import { BaseObject } from './BaseObject.js';
import { CONFIG } from './globals.js';

export class Bedroom extends BaseObject {
    constructor() {
        super();
        this.width = 100;
        this.height = 40;
        this.depth = 100;
        this.yBase = CONFIG.BEDROOM_ELEVATION;

        this.wallThickness = 5;

        this.colliders = []; // player collides with 

        // texture 
        const textureLoader = new THREE.TextureLoader();

        // floor 
        const floorBase = './assets/bedroom/floor/';
        const floorColor = textureLoader.load(floorBase + 'Planks037A_1K-JPG_Color.jpg');
        const floorAO = textureLoader.load(floorBase + 'Planks037A_1K-JPG_AmbientOcclusion.jpg');
        const floorDisp = textureLoader.load(floorBase + 'Planks037A_1K-JPG_Displacement.jpg');
        const floorNormal = textureLoader.load(floorBase + 'Planks037A_1K-JPG_NormalGL.jpg');
        const floorRough = textureLoader.load(floorBase + 'Planks037A_1K-JPG_Roughness.jpg');
        const floorMetal = textureLoader.load(floorBase + 'Planks037A_1K-JPG_Metalness.jpg');

        this.floorMat = new THREE.MeshStandardMaterial({
            map: floorColor,
            aoMap: floorAO,
            displacementMap: floorDisp,
            displacementScale: 0.5,
            normalMap: floorNormal,
            roughnessMap: floorRough,
            metalnessMap: floorMetal,
            side: THREE.DoubleSide
        });

        [floorColor, floorAO, floorDisp, floorNormal, floorRough, floorMetal].forEach(tex => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(4, 4); // repeat 4 times 
        });


        // walls 
        const wallBase = './assets/bedroom/wall/';
        const wallColor = textureLoader.load(wallBase + 'Concrete012_1K-JPG_Color.jpg');
        const wallDisp = textureLoader.load(wallBase + 'Concrete012_1K-JPG_Displacement.jpg');
        const wallNormal = textureLoader.load(wallBase + 'Concrete012_1K-JPG_NormalGL.jpg');
        const wallRough = textureLoader.load(wallBase + 'Concrete012_1K-JPG_Roughness.jpg');

        this.wallMat = new THREE.MeshStandardMaterial({
            map: wallColor,
            displacementMap: wallDisp,
            displacementScale: 0.1,
            normalMap: wallNormal,
            roughnessMap: wallRough
        });

        [wallColor, wallDisp, wallNormal, wallRough].forEach(tex => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 1);
        });

        this.buildStructure();
        this.addLight();
    }

    buildStructure() {
        const floorGeo = new THREE.PlaneGeometry(this.width, this.depth, 100, 100);

        floorGeo.setAttribute('uv2', new THREE.BufferAttribute(floorGeo.attributes.uv.array, 2));

        const floor = new THREE.Mesh(floorGeo, this.floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = this.yBase;
        this.group.add(floor);

        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.depth),
            new THREE.MeshStandardMaterial({ color: 0xE0E0E0, side: THREE.DoubleSide })
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.yBase + this.height;
        this.group.add(ceiling);

        // Walls
        this.createWalls();
        this.createDoorWay();
    }

    // create solid wall and add colliders
    createWall(w, h, d, x, y, z, rotY = 0) {
        const segW = Math.max(1, Math.floor(w / 2));
        const segH = Math.max(1, Math.floor(h / 2));
        const segD = 1;

        const geometry = new THREE.BoxGeometry(w, h, d, segW, segH, segD);

        const mesh = new THREE.Mesh(geometry, this.wallMat);

        mesh.position.set(x, y, z);
        if (rotY !== 0) mesh.rotation.y = rotY;

        this.group.add(mesh);

        // Add to collision list
        this.colliders.push(mesh);
    }

    createWalls() {
        const yPos = this.yBase + this.height / 2;

        // Back Wall
        this.createWall(
            this.width, this.height, this.wallThickness, // Dimensions
            0, yPos, -this.depth / 2,                    // Position
            0                                            // Rotation
        );

        // Left Wall
        this.createWall(
            this.depth, this.height, this.wallThickness,
            -this.width / 2, yPos, 0,
            Math.PI / 2
        );

        // Right Wall
        this.createWall(
            this.depth, this.height, this.wallThickness,
            this.width / 2, yPos, 0,
            Math.PI / 2
        );
    }

    createDoorWay() {
        const doorW = 20;
        const doorH = 15;

        const sideW = (this.width - doorW) / 2;
        const lintelH = this.height - doorH;

        const yPos = this.yBase + this.height / 2;
        const zPos = (this.depth / 2) - 3;

        // Front Left Panel
        this.createWall(
            sideW, this.height, this.wallThickness,
            -(doorW + sideW) / 2, yPos, zPos
        );

        // Front Right Panel
        this.createWall(
            sideW, this.height, this.wallThickness,
            (doorW + sideW) / 2, yPos, zPos
        );

        // Lintel (Top part above door)
        this.createWall(
            doorW, lintelH, this.wallThickness,
            0, this.yBase + doorH + lintelH / 2, zPos
        );
    }

    addLight() {
        const bedroomLight = new THREE.PointLight(0xffaa00, 800, 150);
        bedroomLight.position.set(0, this.yBase + 35, 0);
        this.group.add(bedroomLight);
    }
}
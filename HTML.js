<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft 3D Build Viewer</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #f0f0f0;
        }
        #3dViewer {
            width: 100%;
            height: 80vh;
        }
        #controls {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border-radius: 5px;
        }
        button {
            margin: 5px;
        }
    </style>
</head>
<body>
    <div id="3dViewer"></div>
    <div id="controls">
        <button id="randomBuildBtn">Generate Random Build</button>
        <button id="clearBuildBtn">Clear Build</button>
    </div>

    <script type="module">
        import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r147/three.module.js';
        import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r147/examples/jsm/controls/OrbitControls.js';

        let scene, camera, renderer, controls;
        let currentBuild = null;

        function init() {
            // Setup the scene
            scene = new THREE.Scene();

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(5, 5, 10);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
            document.getElementById('3dViewer').appendChild(renderer.domElement);

            // Orbit Controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;

            // Lighting
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(10, 10, 10).normalize();
            scene.add(light);

            // Add ground plane
            const groundGeometry = new THREE.PlaneGeometry(20, 20);
            const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            scene.add(ground);

            // Handle window resize
            window.addEventListener('resize', onWindowResize, false);

            // Animate and render
            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
        }

        // Generate Random Build
        document.getElementById('randomBuildBtn').addEventListener('click', generateRandomBuild);
        document.getElementById('clearBuildBtn').addEventListener('click', clearBuild);

        function generateRandomBuild() {
            clearBuild();  // Clear any previous build
            const buildHeight = 5;
            const buildWidth = 5;
            const buildDepth = 5;

            currentBuild = new THREE.Group();
            for (let y = 0; y < buildHeight; y++) {
                for (let x = 0; x < buildWidth; x++) {
                    for (let z = 0; z < buildDepth; z++) {
                        const block = createBlock();
                        block.position.set(x, y, z);
                        currentBuild.add(block);
                    }
                }
            }
            scene.add(currentBuild);
        }

        function clearBuild() {
            if (currentBuild) {
                scene.remove(currentBuild);
                currentBuild = null;
            }
        }

        function createBlock() {
            const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
            const blockMaterial = new THREE.MeshBasicMaterial({ color: getRandomColor() });
            return new THREE.Mesh(blockGeometry, blockMaterial);
        }

        function getRandomColor() {
            const colors = [0x8B4513, 0xA0522D, 0xFFD700, 0xC0C0C0, 0xFF4500];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        window.onload = init;
    </script>
</body>
</html>

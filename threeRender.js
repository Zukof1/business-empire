window.initThreeJS = function() {
    const canvas = document.getElementById('threeCanvas');
    const container = document.getElementById('app');
    if (!canvas || !container) return;

    // Core Setup
    const scene = new THREE.Scene();
    
    // Ensure the fog blends with the dark slate background smoothly
    scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

    // Create subtle emerald particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Dense enough to look good, sparse enough for 60fps
    
    const posArray = new Float32Array(particlesCount * 3);
    for(let i=0; i < particlesCount * 3; i++) {
        // Spread them wide across the X, Y, and depth axis
        posArray[i] = (Math.random() - 0.5) * 120;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.25,
        color: 0x10b981, // emerald-500
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending // gives it a subtle glow overlap
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Subtle ambient movement
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // Slowly drift the entire particle cloud
        particlesMesh.rotation.y = elapsedTime * 0.03;
        particlesMesh.rotation.x = elapsedTime * 0.01;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.1) * 2;
        
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler bounding purely to the container block
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);
};

window.addEventListener('DOMContentLoaded', () => {
    // Only init if THREE is fully loaded by CDN
    if (typeof THREE !== 'undefined') {
        window.initThreeJS();
    }
});

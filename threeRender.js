window.initThreeJS = function() {
    const canvas = document.getElementById('threeCanvas');
    const container = document.getElementById('app');
    if (!canvas || !container) return;

    // Core Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

    // Ambient Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Dense enough to look good, sparse enough for 60fps
    const posArray = new Float32Array(particlesCount * 3);
    for(let i=0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 120;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.25, color: 0x10b981, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending 
    });
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Glow Effect Background Plane
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x10b981, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false 
    });
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), glowMaterial);
    glowMesh.position.z = -15; // behind the particles
    scene.add(glowMesh);

    let glowIntensity = 0;
    const bursts = [];

    // Expose interactive APIs
    window.threeEffects = {
        triggerBalanceGlow: () => {
            glowIntensity = 1.0; 
        },
        triggerClickPulse: (clientX, clientY) => {
            const rect = renderer.domElement.getBoundingClientRect();
            // Convert to NDC correctly matching bounds
            const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
            
            const vector = new THREE.Vector3(nx, ny, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const clickPos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            // Generate quick burst particles
            const geo = new THREE.BufferGeometry();
            const pts = 12;
            const pos = new Float32Array(pts * 3);
            const vels = [];
            for(let i=0; i<pts; i++){
                pos[i*3] = clickPos.x;
                pos[i*3+1] = clickPos.y;
                pos[i*3+2] = clickPos.z;
                vels.push(new THREE.Vector3((Math.random()-0.5)*1.5, (Math.random())*2 + 0.5, (Math.random()-0.5)*1.5));
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const burstMat = new THREE.PointsMaterial({ 
                size: 0.5, color: 0x34d399, transparent: true, opacity: 1, blending: THREE.AdditiveBlending 
            });
            const burstMesh = new THREE.Points(geo, burstMat);
            scene.add(burstMesh);
            bursts.push({ mesh: burstMesh, vels, age: 0 });
        }
    };

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.1);
        const elapsedTime = clock.getElapsedTime();
        
        // Ambient rotation
        particlesMesh.rotation.y = elapsedTime * 0.03;
        particlesMesh.rotation.x = elapsedTime * 0.01;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.1) * 2;
        
        // Handle Glow Fade
        if (glowIntensity > 0) {
            glowIntensity -= dt * 2.0; // fade out fast
            if (glowIntensity < 0) glowIntensity = 0;
            glowMaterial.opacity = glowIntensity * 0.12; 
        }

        // Handle Particle Bursts
        for(let i = bursts.length - 1; i >= 0; i--) {
            const b = bursts[i];
            b.age += dt;
            b.mesh.material.opacity = 1 - (b.age / 0.8); // 0.8 second life
            
            const positions = b.mesh.geometry.attributes.position.array;
            for(let p=0; p<b.vels.length; p++){
                positions[p*3] += b.vels[p].x * dt * 20;
                positions[p*3+1] += b.vels[p].y * dt * 20;
                positions[p*3+2] += b.vels[p].z * dt * 20;
                b.vels[p].y -= dt * 3.0; // gravity curve
            }
            b.mesh.geometry.attributes.position.needsUpdate = true;
            
            if(b.age >= 0.8) {
                scene.remove(b.mesh);
                b.mesh.geometry.dispose();
                b.mesh.material.dispose();
                bursts.splice(i, 1);
            }
        }
        
        renderer.render(scene, camera);
    }
    animate();

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

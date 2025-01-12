// Get the scene, camera, and renderer set up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spaceship
const shipGeometry = new THREE.BoxGeometry(1, 0.5, 3);
const shipMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const ship = new THREE.Mesh(shipGeometry, shipMaterial);
scene.add(ship);

// Create asteroids
const asteroidGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
const asteroids = [];

function createAsteroid() {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.x = (Math.random() - 0.5) * 20;
    asteroid.position.y = 5;
    asteroid.position.z = (Math.random() - 0.5) * 20;
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Add asteroids at intervals
setInterval(createAsteroid, 1000);

// Set camera position
camera.position.z = 5;

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        ship.position.x -= 0.1;
    } else if (event.key === 'ArrowRight') {
        ship.position.x += 0.1;
    } else if (event.key === ' ') {
        shootBullet();
    }
});

// Create bullets
const bullets = [];
function shootBullet() {
    const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.set(ship.position.x, ship.position.y, ship.position.z - 2);
    scene.add(bullet);
    bullets.push(bullet);
}

// Game loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    asteroids.forEach((asteroid) => {
        asteroid.position.y -= 0.05; // Move asteroids down
        if (asteroid.position.y < -5) {
            scene.remove(asteroid); // Remove if it goes out of bounds
            const index = asteroids.indexOf(asteroid);
            if (index > -1) {
                asteroids.splice(index, 1);
            }
        }
    });

    bullets.forEach((bullet, index) => {
        bullet.position.z -= 0.1; // Move bullets forward
        if (bullet.position.z < -10) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }

        asteroids.forEach((asteroid, aIndex) => {
            if (bullet.position.distanceTo(asteroid.position) < 0.5) {
                scene.remove(bullet);
                scene.remove(asteroid);
                bullets.splice(index, 1);
                asteroids.splice(aIndex, 1);
            }
        });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();

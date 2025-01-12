const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ship = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    width: 60,
    height: 60,
    speed: 5,
    bullets: [],
};

let asteroids = [];
let score = 0;
let gameOver = false;

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        ship.x -= ship.speed;
    } else if (event.key === 'ArrowRight') {
        ship.x += ship.speed;
    } else if (event.key === ' ') {
        shootBullet();
    }
});

// Create asteroids
function createAsteroids() {
    let x = Math.random() * (canvas.width - 40);
    asteroids.push({ x: x, y: 0, width: 40, height: 40, speed: 3 });
}

// Shoot bullets
function shootBullet() {
    ship.bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y, width: 4, height: 10 });
}

// Update game state
function update() {
    if (gameOver) return;

    // Update asteroids
    if (Math.random() < 0.02) {
        createAsteroids();
    }

    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
            score++;
        }
        // Check for collision with ship
        if (
            ship.x < asteroid.x + asteroid.width &&
            ship.x + ship.width > asteroid.x &&
            ship.y < asteroid.y + asteroid.height &&
            ship.y + ship.height > asteroid.y
        ) {
            gameOver = true;
        }
    });

    // Update bullets
    ship.bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) {
            ship.bullets.splice(index, 1);
        }
        asteroids.forEach((asteroid, aIndex) => {
            if (
                bullet.x < asteroid.x + asteroid.width &&
                bullet.x + bullet.width > asteroid.x &&
                bullet.y < asteroid.y + asteroid.height &&
                bullet.y + bullet.height > asteroid.y
            ) {
                ship.bullets.splice(index, 1);
                asteroids.splice(aIndex, 1);
                score += 10;
            }
        });
    });
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ship
    ctx.fillStyle = 'blue';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

    // Draw asteroids
    ctx.fillStyle = 'gray';
    asteroids.forEach(asteroid => {
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });

    // Draw bullets
    ctx.fillStyle = 'red';
    ship.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Draw game over message
    if (gameOver) {
        ctx.fillText('Game Over!', canvas.width / 2 - 40, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

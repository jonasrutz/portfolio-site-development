// Spielvariablen
let scene, camera, renderer, player, targets = [], obstacles = [], finalGoal;
let powerUps = [];
let score = 0, lives = 3;
let gameActive = true;
const playerSpeed = 0.1;
const keysPressed = {};

// Power-Up-Zustände
let activePowerUps = {
    shield: false,
    speed: false,
    magnet: false
};
let powerUpTimers = {};

// Spiel initialisieren
function init() {
    // Szene erstellen
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Hellblauer Himmel

    // Kamera erstellen
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;

    // Renderer erstellen
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Licht hinzufügen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Boden erstellen
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x44aa44,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // Spieler (Kugel) erstellen
    const playerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 0;
    // Starte den Spieler am Anfang des Labyrinths
    player.position.z = 18;
    player.position.x = 0;
    scene.add(player);
    
    // Erstelle Labyrinth mit Hindernissen
    createObstacles();
    
    // Ziele erstellen
    createTargets(15);
    
    // Finales Ziel erstellen
    createFinalGoal();
    
    // Power-Ups erstellen
    createPowerUps();

    // Event-Listener für Tastaturbedienung
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    });

    // Event-Listener für Touch-Steuerung auf mobilen Geräten
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (event) => {
        if (!gameActive) return;
        
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        player.position.x += deltaX * 0.01;
        player.position.z -= deltaY * 0.01;
        
        touchStartX = touchX;
        touchStartY = touchY;
        
        event.preventDefault();
    });

    // Event-Listener für Fenster-Resize
    window.addEventListener('resize', onWindowResize);
    
    // Neustart-Button
    document.getElementById('restart-button').addEventListener('click', restartGame);

    // Animation starten
    animate();
}

// Hindernisse erstellen
function createObstacles() {
    // Labyrinthwände erstellen
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Braune Wände
    
    // Äußere Begrenzungen
    const wallPositions = [
        // Vertikale Wände (links und rechts)
        {x: -15, y: 0, z: 0, width: 1, height: 2, depth: 40},
        {x: 15, y: 0, z: 0, width: 1, height: 2, depth: 40},
        
        // Horizontale Wände (oben und unten)
        {x: 0, y: 0, z: -20, width: 30, height: 2, depth: 1},
        {x: 0, y: 0, z: 20, width: 30, height: 2, depth: 1},
        
        // Innere Wände
        {x: -8, y: 0, z: 10, width: 14, height: 2, depth: 1},
        {x: 8, y: 0, z: 0, width: 14, height: 2, depth: 1},
        {x: -8, y: 0, z: -10, width: 14, height: 2, depth: 1},
        {x: -5, y: 0, z: 5, width: 1, height: 2, depth: 10},
        {x: 5, y: 0, z: -5, width: 1, height: 2, depth: 10},
    ];
    
    wallPositions.forEach(wall => {
        const wallGeometry = new THREE.BoxGeometry(wall.width, wall.height, wall.depth);
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallMesh.position.set(wall.x, wall.y, wall.z);
        scene.add(wallMesh);
        obstacles.push(wallMesh);
    });
    
    // Bewegliche Hindernisse erstellen
    for (let i = 0; i < 5; i++) {
        const obstacleGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // Rötliche Hindernisse
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        
        // Zufällige Position im Spielfeld
        obstacle.position.x = (Math.random() - 0.5) * 25;
        obstacle.position.y = 0.5;
        obstacle.position.z = (Math.random() - 0.5) * 25;
        
        // Bewegungsparameter für Animation
        obstacle.userData = {
            speed: 0.05 + Math.random() * 0.1,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize(),
            bounceTime: 0
        };
        
        scene.add(obstacle);
        obstacles.push(obstacle);
    }
}

// Power-Ups erstellen
function createPowerUps() {
    const powerUpTypes = [
        { type: "shield", color: 0x00BFFF, duration: 10000 }, // Schutzschild (blau)
        { type: "speed", color: 0x00FF00, duration: 7000 },   // Geschwindigkeitsboost (grün)
        { type: "magnet", color: 0xFFFF00, duration: 8000 }   // Punkte-Magnet (gelb)
    ];
    
    for (let i = 0; i < 5; i++) {
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: randomType.type === "shield" ? 0x00BFFF : 
                  randomType.type === "speed" ? 0x00FF00 : 0xFFFF00,
            emissive: randomType.type === "shield" ? 0x00BFFF : 
                     randomType.type === "speed" ? 0x00FF00 : 0xFFFF00,
            emissiveIntensity: 0.5
        });
        
        const powerUp = new THREE.Mesh(geometry, material);
        powerUp.userData = {
            type: randomType.type,
            duration: randomType.duration
        };
        
        // Zufällige Position im Labyrinth
        let validPosition = false;
        while (!validPosition) {
            powerUp.position.x = (Math.random() - 0.5) * 28;
            powerUp.position.y = 0.5;
            powerUp.position.z = (Math.random() - 0.5) * 28;
            
            // Position validieren
            validPosition = true;
            if (powerUp.position.distanceTo(player.position) < 5) {
                validPosition = false;
                continue;
            }
            
            for (const obstacle of obstacles) {
                if (powerUp.position.distanceTo(obstacle.position) < 2.5) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        scene.add(powerUp);
        powerUps.push(powerUp);
    }
}

// Power-Up aktivieren
function activatePowerUp(type, duration) {
    // Power-Up-Status aktivieren
    activePowerUps[type] = true;
    
    // Visuellen Effekt für den Spieler hinzufügen
    updatePlayerAppearance();
    
    // Nachricht einblenden
    let message;
    switch(type) {
        case "shield":
            message = "Schutzschild aktiviert!";
            break;
        case "speed":
            message = "Geschwindigkeitsboost aktiviert!";
            break;
        case "magnet":
            message = "Punkte-Magnet aktiviert!";
            break;
    }
    
    // Temporäre Nachricht anzeigen
    const powerUpMessage = document.createElement("div");
    powerUpMessage.textContent = message;
    powerUpMessage.style.position = "absolute";
    powerUpMessage.style.top = "100px";
    powerUpMessage.style.left = "20px";
    powerUpMessage.style.color = "white";
    powerUpMessage.style.fontWeight = "bold";
    powerUpMessage.style.fontSize = "18px";
    powerUpMessage.style.backgroundColor = "rgba(0,0,0,0.5)";
    powerUpMessage.style.padding = "10px";
    powerUpMessage.style.borderRadius = "5px";
    powerUpMessage.style.zIndex = "100";
    document.body.appendChild(powerUpMessage);
    
    setTimeout(() => {
        document.body.removeChild(powerUpMessage);
    }, 3000);
    
    // Timer für das Ende des Power-Ups setzen
    if (powerUpTimers[type]) {
        clearTimeout(powerUpTimers[type]);
    }
    
    powerUpTimers[type] = setTimeout(() => {
        activePowerUps[type] = false;
        updatePlayerAppearance();
    }, duration);
}

// Spieleraussehen basierend auf aktiven Power-Ups aktualisieren
function updatePlayerAppearance() {
    // Grundfarbe rot
    let playerColor = 0xff0000;
    
    // Schild aktiv: bläulicher Schimmer
    if (activePowerUps.shield) {
        player.material.emissive = new THREE.Color(0x0044ff);
        player.material.emissiveIntensity = 0.5;
    } 
    // Geschwindigkeit aktiv: grünlicher Schimmer
    else if (activePowerUps.speed) {
        player.material.emissive = new THREE.Color(0x00ff44);
        player.material.emissiveIntensity = 0.5;
    }
    // Magnet aktiv: gelblicher Schimmer
    else if (activePowerUps.magnet) {
        player.material.emissive = new THREE.Color(0xffff00);
        player.material.emissiveIntensity = 0.5;
    }
    // Keine Power-Ups aktiv
    else {
        player.material.emissive = new THREE.Color(0x000000);
        player.material.emissiveIntensity = 0;
    }
}

// Finales Ziel erstellen
function createFinalGoal() {
    const goalGeometry = new THREE.BoxGeometry(2, 2, 2);
    const goalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700, // Gold
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xFFD700,
        emissiveIntensity: 0.4
    });
    
    finalGoal = new THREE.Mesh(goalGeometry, goalMaterial);
    finalGoal.position.set(0, 1, -18); // Am Ende des Labyrinths
    
    scene.add(finalGoal);
}

// Zufällige Ziele erstellen
function createTargets(count) {
    for (let i = 0; i < count; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: Math.random() * 0xffffff,
            emissive: 0x555555,
            emissiveIntensity: 0.2
        });
        const target = new THREE.Mesh(geometry, material);
        
        // Zufällige Position im Spielfeld innerhalb des Labyrinths
        let validPosition = false;
        while (!validPosition) {
            target.position.x = (Math.random() - 0.5) * 28;
            target.position.y = 0.5;
            target.position.z = (Math.random() - 0.5) * 28;
            
            // Prüfen, ob die Position nicht zu nahe an Hindernissen oder dem Spieler ist
            validPosition = true;
            
            // Abstand zum Spieler
            if (target.position.distanceTo(player.position) < 3) {
                validPosition = false;
                continue;
            }
            
            // Abstand zu Hindernissen
            for (const obstacle of obstacles) {
                if (target.position.distanceTo(obstacle.position) < 2) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        scene.add(target);
        targets.push(target);
    }
}

// Kollisionserkennung
function checkCollisions() {
    if (!gameActive) return;
    
    const playerPosition = player.position.clone();
    const playerRadius = 0.5; // Spieler-Kugelradius
    
    // Kollisionserkennung mit Punkten
    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        const distance = playerPosition.distanceTo(target.position);
        
        // Magnet-Power-Up erhöht die Sammelreichweite
        const collectionRange = activePowerUps.magnet ? playerRadius + 2.0 : playerRadius + 0.5;
        
        if (distance < collectionRange) {
            // Kollision erkannt, Ziel entfernen
            scene.remove(target);
            targets.splice(i, 1);
            
            // Punkte erhöhen
            score += 10;
            document.getElementById('score').textContent = 'Punkte: ' + score;
        }
    }
    
    // Kollisionserkennung mit Power-Ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        const distance = playerPosition.distanceTo(powerUp.position);
        
        if (distance < playerRadius + 0.5) {
            // Kollision erkannt, Power-Up aktivieren
            activatePowerUp(powerUp.userData.type, powerUp.userData.duration);
            
            // Power-Up entfernen
            scene.remove(powerUp);
            powerUps.splice(i, 1);
        }
    }
    
    // Kollisionserkennung mit Hindernissen
    for (const obstacle of obstacles) {
        // Nur für bewegliche Hindernisse (die mit userData.speed definiert sind)
        if (obstacle.userData && obstacle.userData.speed) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            const playerBox = new THREE.Box3().setFromObject(player);
            
            if (obstacleBox.intersectsBox(playerBox)) {
                // Bei aktivem Schild keine Kollision
                if (!activePowerUps.shield) {
                    handleObstacleCollision();
                }
                break;
            }
        }
    }
    
    // Kollisionsprüfung mit dem finalen Ziel
    const distanceToGoal = playerPosition.distanceTo(finalGoal.position);
    if (distanceToGoal < playerRadius + 1) {
        gameWon();
    }
}

// Behandelt Kollision mit einem Hindernis
function handleObstacleCollision() {
    lives--;
    document.getElementById('lives').textContent = 'Leben: ' + lives;
    
    // Spieler zurücksetzen
    player.position.set(0, 0, 18);
    
    if (lives <= 0) {
        gameOver();
    } else {
        // Kurze Unverwundbarkeit
        player.material.transparent = true;
        player.material.opacity = 0.5;
        setTimeout(() => {
            player.material.transparent = false;
            player.material.opacity = 1;
            updatePlayerAppearance(); // Spieleraussehen nach Unverwundbarkeit aktualisieren
        }, 1500);
    }
}

// Spiel vorbei
function gameOver() {
    gameActive = false;
    
    const messageElement = document.getElementById('message-text');
    messageElement.textContent = 'Game Over! Du hast ' + score + ' Punkte erreicht.';
    
    document.getElementById('game-message').style.display = 'block';
}

// Spiel gewonnen
function gameWon() {
    gameActive = false;
    
    // Bonus für übrige Leben
    const lifeBonus = lives * 50;
    score += lifeBonus;
    
    const messageElement = document.getElementById('message-text');
    messageElement.textContent = 'Gewonnen! Du hast ' + score + ' Punkte erreicht, inklusive ' + lifeBonus + ' Bonus-Punkte für übrige Leben.';
    
    document.getElementById('game-message').style.display = 'block';
}

// Spiel neustarten
function restartGame() {
    document.getElementById('game-message').style.display = 'none';
    
    // Szene aufräumen
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    
    // Variablen zurücksetzen
    targets = [];
    obstacles = [];
    powerUps = [];
    score = 0;
    lives = 3;
    gameActive = true;
    
    // Power-Up-Zustände zurücksetzen
    activePowerUps = {
        shield: false,
        speed: false,
        magnet: false
    };
    
    // Timer löschen
    for (let type in powerUpTimers) {
        if (powerUpTimers[type]) {
            clearTimeout(powerUpTimers[type]);
            powerUpTimers[type] = null;
        }
    }
    
    document.getElementById('score').textContent = 'Punkte: ' + score;
    document.getElementById('lives').textContent = 'Leben: ' + lives;
    
    // Spiel neu initialisieren
    init();
}

// Spieler-Bewegung
function movePlayer() {
    if (!gameActive) return;
    
    // Geschwindigkeitsboost durch Power-Up
    const moveSpeed = activePowerUps.speed ? playerSpeed * 1.75 : playerSpeed;
    const oldPosition = player.position.clone();
    
    if (keysPressed['w'] || keysPressed['arrowup']) {
        player.position.z -= moveSpeed;
    }
    if (keysPressed['s'] || keysPressed['arrowdown']) {
        player.position.z += moveSpeed;
    }
    if (keysPressed['a'] || keysPressed['arrowleft']) {
        player.position.x -= moveSpeed;
    }
    if (keysPressed['d'] || keysPressed['arrowright']) {
        player.position.x += moveSpeed;
    }
    
    // Spielfeldgrenzen
    player.position.x = Math.max(-14, Math.min(14, player.position.x));
    player.position.z = Math.max(-19, Math.min(19, player.position.z));
    
    // Kollisionserkennung mit statischen Hindernissen (Wänden)
    for (const obstacle of obstacles) {
        // Nur für statische Hindernisse (keine userData.speed)
        if (!obstacle.userData || !obstacle.userData.speed) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            const playerBox = new THREE.Box3().setFromObject(player);
            
            if (obstacleBox.intersectsBox(playerBox)) {
                // Bei Kollision die Bewegung rückgängig machen
                player.position.copy(oldPosition);
                break;
            }
        }
    }
}

// Kamera folgt dem Spieler
function updateCamera() {
    const cameraHeight = 7;
    const lookAheadDistance = 2;
    
    // Kamera positionieren
    camera.position.x = player.position.x;
    camera.position.y = cameraHeight;
    camera.position.z = player.position.z + 5;
    
    // Kamera schaut leicht vor den Spieler
    const lookTarget = player.position.clone();
    lookTarget.z -= lookAheadDistance;
    camera.lookAt(lookTarget);
}

// Fenster-Resize-Behandlung
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Bewegliche Hindernisse aktualisieren
function updateObstacles() {
    obstacles.forEach(obstacle => {
        // Nur bewegliche Hindernisse aktualisieren
        if (obstacle.userData && obstacle.userData.speed) {
            obstacle.position.x += obstacle.userData.direction.x * obstacle.userData.speed;
            obstacle.position.z += obstacle.userData.direction.z * obstacle.userData.speed;
            
            // Rotation für visuellen Effekt
            obstacle.rotation.x += 0.01;
            obstacle.rotation.y += 0.01;
            
            // Abprallen an Wänden und anderen Hindernissen
            if (Math.abs(obstacle.position.x) > 14) {
                obstacle.userData.direction.x *= -1;
            }
            if (Math.abs(obstacle.position.z) > 19) {
                obstacle.userData.direction.z *= -1;
            }
            
            // Zufällige Richtungsänderungen
            obstacle.userData.bounceTime += 0.01;
            if (obstacle.userData.bounceTime > 5) {
                obstacle.userData.direction.x = Math.random() - 0.5;
                obstacle.userData.direction.z = Math.random() - 0.5;
                obstacle.userData.direction.normalize();
                obstacle.userData.bounceTime = 0;
            }
        }
    });
}

// Power-Ups animieren
function updatePowerUps() {
    powerUps.forEach(powerUp => {
        // Rotation für visuellen Effekt
        powerUp.rotation.y += 0.02;
        
        // Schwebender Effekt
        powerUp.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
    });
}

// Animation-Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Spieler bewegen
    movePlayer();
    
    // Kamera aktualisieren
    updateCamera();
    
    // Bewegliche Hindernisse aktualisieren
    updateObstacles();
    
    // Power-Ups animieren
    updatePowerUps();
    
    // Kollisionen prüfen
    checkCollisions();
    
    // Ziele animieren
    targets.forEach(target => {
        target.rotation.x += 0.01;
        target.rotation.y += 0.01;
    });
    
    // Finales Ziel animieren
    if (finalGoal) {
        finalGoal.rotation.y += 0.01;
        finalGoal.rotation.x += 0.005;
        
        // Pulsierender Effekt
        const pulseFactor = Math.sin(Date.now() * 0.003) * 0.1 + 0.9;
        finalGoal.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
    
    renderer.render(scene, camera);
}

// Spiel starten, wenn das Dokument geladen ist
window.addEventListener('DOMContentLoaded', init);
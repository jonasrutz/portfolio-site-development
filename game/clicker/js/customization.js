// Customization system functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const customizeBtn = document.getElementById('customize-btn');
    const customizeGalaxyModal = document.getElementById('customize-galaxy-modal');
    const closeCustomizeBtn = document.getElementById('close-customize');
    const customizeDustBalance = document.getElementById('customize-dust-balance');
    const tabButtons = document.querySelectorAll('.customize-tab-btn');
    const tabContents = document.querySelectorAll('.customize-tab-content');

    // Initialize event listeners
    if (customizeBtn) {
        customizeBtn.addEventListener('click', openCustomizeModal);
    }

    if (closeCustomizeBtn) {
        closeCustomizeBtn.addEventListener('click', closeCustomizeModal);
    }

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Add event delegation for buy and select buttons in the customization modal
    customizeGalaxyModal.addEventListener('click', function(event) {
        const target = event.target;
        
        // Handle buy button clicks
        if (target.classList.contains('cosmetic-buy-btn')) {
            const cosmeticItem = target.closest('.cosmetic-item');
            if (cosmeticItem) {
                const itemId = cosmeticItem.getAttribute('data-id');
                const itemType = cosmeticItem.getAttribute('data-type');
                const itemCost = parseInt(cosmeticItem.getAttribute('data-cost'));
                
                purchaseCosmeticItem(itemType, itemId, itemCost);
            }
        }
        
        // Handle select button clicks
        if (target.classList.contains('cosmetic-select-btn') && !target.classList.contains('selected')) {
            const cosmeticItem = target.closest('.cosmetic-item');
            if (cosmeticItem) {
                const itemId = cosmeticItem.getAttribute('data-id');
                const itemType = cosmeticItem.getAttribute('data-type');
                
                selectCosmeticItem(itemType, itemId);
            }
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === customizeGalaxyModal) {
            closeCustomizeModal();
        }
    });

    // Functions for the customization system
    function openCustomizeModal() {
        // Update the dust balance display
        updateCosmeticDustDisplay();
        
        // Refresh the customization options based on current state
        refreshCustomizationOptions();
        
        // Show the modal
        customizeGalaxyModal.classList.add('show');
    }

    function closeCustomizeModal() {
        customizeGalaxyModal.classList.remove('show');
    }

    function updateCosmeticDustDisplay() {
        if (customizeDustBalance) {
            customizeDustBalance.textContent = gameState.cosmicDust;
        }
    }

    function refreshCustomizationOptions() {
        // Update the state of each cosmetic item in the UI based on the model
        updateCosmeticItemsUI('star-design', customizationSystem.starDesigns);
        updateCosmeticItemsUI('background', customizationSystem.backgrounds);
        updateCosmeticItemsUI('particle-effect', customizationSystem.particleEffects);
    }

    function updateCosmeticItemsUI(type, items) {
        // Get all UI elements for this type
        const itemElements = document.querySelectorAll(`.cosmetic-item[data-type="${type}"]`);
        
        itemElements.forEach(element => {
            const itemId = element.getAttribute('data-id');
            const item = items[itemId];
            
            if (item) {
                const buyButton = element.querySelector('.cosmetic-buy-btn');
                const selectButton = element.querySelector('.cosmetic-select-btn');
                
                if (item.owned) {
                    // If owned, show select button instead of buy button
                    if (buyButton) {
                        buyButton.style.display = 'none';
                    }
                    
                    if (!selectButton) {
                        // Create select button if it doesn't exist
                        const newSelectBtn = document.createElement('button');
                        newSelectBtn.className = 'cosmetic-select-btn';
                        newSelectBtn.textContent = item.selected ? 'Selected' : 'Select';
                        if (item.selected) {
                            newSelectBtn.classList.add('selected');
                        }
                        
                        element.appendChild(newSelectBtn);
                    } else {
                        // Update existing select button
                        selectButton.style.display = '';
                        selectButton.textContent = item.selected ? 'Selected' : 'Select';
                        
                        if (item.selected) {
                            selectButton.classList.add('selected');
                        } else {
                            selectButton.classList.remove('selected');
                        }
                    }
                } else {
                    // Not owned, show buy button
                    if (buyButton) {
                        buyButton.style.display = '';
                        buyButton.disabled = gameState.cosmicDust < item.cost;
                    }
                    
                    if (selectButton) {
                        selectButton.style.display = 'none';
                    }
                }
            }
        });
    }

    function purchaseCosmeticItem(type, id, cost) {
        const result = customizationSystem.purchaseCosmetic(type, id, gameState.cosmicDust);
        
        if (result.success) {
            // Update game state dust amount
            gameState.cosmicDust = result.dustLeft;
            
            // Update the UI
            updateCosmeticDustDisplay();
            refreshCustomizationOptions();
            
            // Show notification
            showCustomizationNotification(result.message, 'success');
            
            // Play purchase sound
            GameState.events.dispatch('playSound', { type: 'purchase' });
            
            // Save game state
            saveGameState();
            
            // Apply the customization if it's the first purchase of this type
            const selectedItems = customizationSystem.getSelectedCosmetics();
            const selectedItemForType = type === 'star-design' ? selectedItems.starDesign : 
                                       (type === 'background' ? selectedItems.background : 
                                       selectedItems.particleEffect);
                                       
            // If no item is currently selected for this type, auto-select this one
            if (!selectedItemForType.selected) {
                selectCosmeticItem(type, id);
            }
        } else {
            // Show error notification
            showCustomizationNotification(result.message, 'error');
        }
    }

    function selectCosmeticItem(type, id) {
        const result = customizationSystem.selectCosmetic(type, id);
        
        if (result.success) {
            // Update the UI
            refreshCustomizationOptions();
            
            // Apply the cosmetic change
            applyCosmetics();
            
            // Show notification
            showCustomizationNotification(result.message, 'success');
            
            // Play selection sound
            GameState.events.dispatch('playSound', { type: 'select' });
            
            // Save game state
            saveGameState();
        } else {
            // Show error notification
            showCustomizationNotification(result.message, 'error');
        }
    }

    function applyCosmetics() {
        // Get the currently selected cosmetics
        const selectedCosmetics = customizationSystem.getSelectedCosmetics();
        
        // Apply star design
        applyStarDesign(selectedCosmetics.starDesign);
        
        // Apply background
        applyBackground(selectedCosmetics.background);
        
        // Apply particle effect (will affect future clicks)
        applyParticleEffect(selectedCosmetics.particleEffect);
    }

    function applyStarDesign(starDesign) {
        // Remove all existing star design classes
        document.body.classList.remove(
            'star-design-classic-star',
            'star-design-neutron-star',
            'star-design-binary-star',
            'star-design-supernova',
            'star-design-pulsar-star'
        );
        
        // Add the selected star design class
        document.body.classList.add(`star-design-${starDesign.id}`);
        
        // Update the main clicker icon if needed
        const mainClicker = document.getElementById('main-clicker');
        if (mainClicker) {
            // Remove all existing icons
            Array.from(mainClicker.querySelectorAll('i')).forEach(icon => {
                mainClicker.removeChild(icon);
            });
            
            // Add the appropriate icon(s) based on the design
            switch (starDesign.id) {
                case 'classic-star':
                    addIconToClicker(mainClicker, 'fas fa-sun');
                    break;
                case 'neutron-star':
                    addIconToClicker(mainClicker, 'fas fa-atom');
                    break;
                case 'binary-star':
                    addIconToClicker(mainClicker, 'fas fa-sun');
                    addIconToClicker(mainClicker, 'fas fa-sun small');
                    break;
                case 'supernova':
                    addIconToClicker(mainClicker, 'fas fa-radiation');
                    break;
                case 'pulsar-star':
                    addIconToClicker(mainClicker, 'fas fa-compact-disc');
                    break;
            }
        }
    }

    function addIconToClicker(clicker, iconClasses) {
        const icon = document.createElement('i');
        icon.className = iconClasses;
        clicker.appendChild(icon);
    }

    function applyBackground(background) {
        // Remove all existing background classes
        document.body.classList.remove(
            'game-theme-deep-space',
            'game-theme-nebula-clouds',
            'game-theme-star-cluster',
            'game-theme-galactic-core',
            'game-theme-cosmic-void'
        );
        
        // Add the selected background class
        document.body.classList.add(`game-theme-${background.id}`);
    }

    function applyParticleEffect(effect) {
        // Store the selected effect ID in game state
        gameState.selectedParticleEffect = effect.id;
    }

    function showCustomizationNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `customization-notification ${type}`;
        notification.innerHTML = `
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <div>
                <p>${message}</p>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = type === 'success' ? 'var(--cosmic-primary)' : 'var(--error)';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '8px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateX(120%)';
        notification.style.transition = 'transform 0.3s ease-in-out';
        
        // Animation to slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});

// Function to create customized star particles based on the selected effect
function createCustomizedStarParticles(event) {
    const selectedEffect = gameState.selectedParticleEffect || 'starburst';
    const clickerArea = document.querySelector('.clicker-area');
    
    if (!clickerArea) return;
    
    const clickerRect = clickerArea.getBoundingClientRect();
    
    // Create different effects based on the selected particle effect
    switch (selectedEffect) {
        case 'starburst':
            createStarburstEffect(clickerArea, clickerRect);
            break;
        case 'cosmic-rays':
            createCosmicRaysEffect(clickerArea, clickerRect);
            break;
        case 'galaxy-swirl':
            createGalaxySwirlEffect(clickerArea, clickerRect);
            break;
        case 'constellation':
            createConstellationEffect(clickerArea, clickerRect);
            break;
        case 'wormhole':
            createWormholeEffect(clickerArea, clickerRect);
            break;
        default:
            // Default to starburst
            createStarburstEffect(clickerArea, clickerRect);
    }
}

// Standard starburst effect (original star particles)
function createStarburstEffect(container, rect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numParticles = 8 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'star-particle';
        
        const starTypes = ['★', '✦', '✯', '⋆', '✫'];
        const starType = starTypes[Math.floor(Math.random() * starTypes.length)];
        particle.textContent = starType;
        
        const colors = ['#ffff00', '#ffd700', '#ffcf40', '#ffac33', '#ff9966'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        
        const posX = centerX + Math.cos(angle) * distance * 0.2;
        const posY = centerY + Math.sin(angle) * distance * 0.2;
        
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.style.position = 'absolute';
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.color = color;
        particle.style.fontSize = `${14 + Math.random() * 10}px`;
        particle.style.textShadow = `0 0 5px ${color}`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '90';
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0.5)';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transition = `all 0.6s ease-out`;
            particle.style.opacity = '1';
            particle.style.left = `${endX}px`;
            particle.style.top = `${endY}px`;
            particle.style.transform = 'scale(1)';
            
            setTimeout(() => {
                particle.style.opacity = '0';
            }, 400);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 600);
        }, Math.random() * 50);
    }
}

// Cosmic rays effect - linear beams
function createCosmicRaysEffect(container, rect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numRays = 6 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numRays; i++) {
        const ray = document.createElement('div');
        ray.className = 'cosmic-ray-particle';
        
        const angle = (i / numRays) * Math.PI * 2;
        const rayLength = 30 + Math.random() * 50;
        
        ray.style.position = 'absolute';
        ray.style.left = `${centerX}px`;
        ray.style.top = `${centerY}px`;
        ray.style.width = `${rayLength}px`;
        ray.style.height = '2px';
        ray.style.backgroundColor = '#00e5ff';
        ray.style.boxShadow = '0 0 10px #00e5ff, 0 0 20px #00e5ff';
        ray.style.transformOrigin = '0 50%';
        ray.style.transform = `rotate(${angle}rad) translateX(10px)`;
        ray.style.pointerEvents = 'none';
        ray.style.zIndex = '90';
        ray.style.opacity = '0';
        
        container.appendChild(ray);
        
        setTimeout(() => {
            ray.style.transition = `opacity 0.3s ease-in, width 0.6s ease-out`;
            ray.style.opacity = '0.8';
            ray.style.width = `${rayLength}px`;
            
            setTimeout(() => {
                ray.style.opacity = '0';
            }, 300);
            
            setTimeout(() => {
                if (ray.parentNode) {
                    ray.parentNode.removeChild(ray);
                }
            }, 600);
        }, Math.random() * 50);
    }
}

// Galaxy swirl effect - particles that move in a spiral
function createGalaxySwirlEffect(container, rect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numParticles = 12 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'swirl-particle';
        
        const size = 3 + Math.random() * 4;
        const colors = ['#5d64cf', '#6a8cee', '#75b4fa', '#63c5ff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const startAngle = Math.random() * Math.PI * 2;
        const startRadius = 5 + Math.random() * 10;
        const endRadius = 30 + Math.random() * 40;
        
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        particle.style.left = `${centerX + Math.cos(startAngle) * startRadius}px`;
        particle.style.top = `${centerY + Math.sin(startAngle) * startRadius}px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '90';
        particle.style.opacity = '0';
        
        container.appendChild(particle);
        
        // Store the starting position and angle for animation
        const startX = centerX + Math.cos(startAngle) * startRadius;
        const startY = centerY + Math.sin(startAngle) * startRadius;
        
        // Custom animation for spiral movement
        let progress = 0;
        const animDuration = 600 + Math.random() * 400;
        const startTime = performance.now();
        
        const animate = (timestamp) => {
            progress = (timestamp - startTime) / animDuration;
            
            if (progress >= 1) {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                return;
            }
            
            const currentRadius = startRadius + (endRadius - startRadius) * progress;
            const currentAngle = startAngle + progress * Math.PI * 1.5; // 3/4 rotation
            
            const currentX = centerX + Math.cos(currentAngle) * currentRadius;
            const currentY = centerY + Math.sin(currentAngle) * currentRadius;
            
            particle.style.left = `${currentX}px`;
            particle.style.top = `${currentY}px`;
            particle.style.opacity = progress < 0.8 ? progress : (1 - (progress - 0.8) * 5);
            
            requestAnimationFrame(animate);
        };
        
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, Math.random() * 100);
    }
}

// Constellation effect - connected star points
function createConstellationEffect(container, rect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numPoints = 6 + Math.floor(Math.random() * 4);
    
    // Create star points first
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 40;
        
        const posX = centerX + Math.cos(angle) * distance;
        const posY = centerY + Math.sin(angle) * distance;
        
        points.push({x: posX, y: posY});
    }
    
    // Create lines connecting the points
    for (let i = 0; i < points.length - 1; i++) {
        createConstellationLine(container, points[i], points[i+1]);
    }
    
    // Connect last point to first to complete the constellation
    createConstellationLine(container, points[points.length-1], points[0]);
    
    // Create the star nodes
    points.forEach((point, index) => {
        const star = document.createElement('div');
        star.className = 'constellation-node';
        
        star.style.position = 'absolute';
        star.style.left = `${point.x}px`;
        star.style.top = `${point.y}px`;
        star.style.width = `${4 + Math.random() * 3}px`;
        star.style.height = `${4 + Math.random() * 3}px`;
        star.style.backgroundColor = '#ffffff';
        star.style.borderRadius = '50%';
        star.style.boxShadow = '0 0 8px #ffffff, 0 0 12px #2d95ff';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '91';
        star.style.opacity = '0';
        star.style.transform = 'scale(0.5)';
        
        container.appendChild(star);
        
        // Animation with slight delay for each star
        setTimeout(() => {
            star.style.transition = `all 0.5s ease-in-out`;
            star.style.opacity = '1';
            star.style.transform = 'scale(1)';
            
            setTimeout(() => {
                star.style.opacity = '0';
                star.style.transform = 'scale(0.3)';
            }, 400);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 700);
        }, index * 50);
    });
}

// Create a line connecting two points in the constellation
function createConstellationLine(container, point1, point2) {
    const line = document.createElement('div');
    line.className = 'constellation-line';
    
    // Calculate line properties
    const length = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    
    line.style.position = 'absolute';
    line.style.left = `${point1.x}px`;
    line.style.top = `${point1.y}px`;
    line.style.width = `${length}px`;
    line.style.height = '1px';
    line.style.backgroundColor = 'rgba(120, 180, 255, 0.5)';
    line.style.boxShadow = '0 0 3px #78b4ff';
    line.style.transformOrigin = '0 0';
    line.style.transform = `rotate(${angle}rad)`;
    line.style.pointerEvents = 'none';
    line.style.zIndex = '90';
    line.style.opacity = '0';
    
    container.appendChild(line);
    
    // Animate the line
    setTimeout(() => {
        line.style.transition = `opacity 0.3s ease-in`;
        line.style.opacity = '0.7';
        
        setTimeout(() => {
            line.style.opacity = '0';
        }, 500);
        
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 800);
    }, 50);
}

// Wormhole effect - a spiral tunnel effect
function createWormholeEffect(container, rect) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const numRings = 5;
    
    // Create multiple rings that expand outward
    for (let i = 0; i < numRings; i++) {
        const ring = document.createElement('div');
        ring.className = 'wormhole-ring';
        
        const size = 10 + (i * 10); // Increasing sizes
        const hue = 180 + (i * 30) % 360; // Color variation
        
        ring.style.position = 'absolute';
        ring.style.left = `${centerX - size/2}px`;
        ring.style.top = `${centerY - size/2}px`;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.border = `1px solid hsl(${hue}, 80%, 60%)`;
        ring.style.borderRadius = '50%';
        ring.style.boxShadow = `0 0 10px hsl(${hue}, 80%, 60%), inset 0 0 5px hsl(${hue}, 80%, 70%)`;
        ring.style.pointerEvents = 'none';
        ring.style.zIndex = `${90 - i}`; // Outer rings go behind inner rings
        ring.style.opacity = '0';
        ring.style.transform = 'scale(0.5) rotate(0deg)';
        
        container.appendChild(ring);
        
        // Animation with timing dependent on ring index
        setTimeout(() => {
            ring.style.transition = `all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)`;
            ring.style.opacity = '0.8';
            ring.style.transform = 'scale(2.5) rotate(180deg)';
            
            setTimeout(() => {
                ring.style.opacity = '0';
            }, 500);
            
            setTimeout(() => {
                if (ring.parentNode) {
                    ring.parentNode.removeChild(ring);
                }
            }, 800);
        }, i * 50);
    }
    
    // Add some particles that get "sucked in" to the wormhole center
    const numParticles = 8;
    const angleStep = (Math.PI * 2) / numParticles;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'wormhole-particle';
        
        const angle = i * angleStep;
        const distanceFromCenter = 40 + Math.random() * 20;
        
        const startX = centerX + Math.cos(angle) * distanceFromCenter;
        const startY = centerY + Math.sin(angle) * distanceFromCenter;
        
        particle.style.position = 'absolute';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 5px #ffffff, 0 0 8px #00ddff';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '92';
        particle.style.opacity = '0';
        
        container.appendChild(particle);
        
        // Animation with spiral path towards center
        setTimeout(() => {
            particle.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
            particle.style.opacity = '1';
            
            // Create a spiral path animation
            const keyframes = [];
            const steps = 10;
            for (let j = 0; j <= steps; j++) {
                const progress = j / steps;
                const currentDistance = distanceFromCenter * (1 - progress);
                const spiralAngle = angle + (progress * Math.PI * 4); // 2 full rotations
                
                const x = centerX + Math.cos(spiralAngle) * currentDistance;
                const y = centerY + Math.sin(spiralAngle) * currentDistance;
                
                keyframes.push({
                    left: `${x}px`,
                    top: `${y}px`,
                    opacity: j === steps ? 0 : 1,
                    offset: progress
                });
            }
            
            particle.animate(keyframes, {
                duration: 600,
                easing: 'ease-in',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 600);
        }, Math.random() * 100);
    }
}

// Update gameState to store customization system
function enhanceGameState() {
    // Add customization to game state if it doesn't exist
    if (!gameState.customization) {
        gameState.customization = customizationSystem.toJSON();
    } else {
        // Load existing customization data into the system
        customizationSystem.fromJSON(gameState.customization);
    }
    
    // Set default selected particle effect if not set
    if (!gameState.selectedParticleEffect) {
        gameState.selectedParticleEffect = 'starburst';
    }
    
    // Override createStarParticles with our enhanced version
    if (typeof window.originalCreateStarParticles === 'undefined') {
        window.originalCreateStarParticles = window.createStarParticles;
        window.createStarParticles = createCustomizedStarParticles;
    }
}

// Add profile buttons if they don't exist
function ensureCustomizeButton() {
    // Check if the profile buttons container exists
    let profileBtns = document.querySelector('.profile-buttons');
    
    // If not, create it
    if (!profileBtns) {
        profileBtns = document.createElement('div');
        profileBtns.className = 'profile-buttons';
        
        // Find the player profile to insert after
        const playerProfile = document.querySelector('.player-profile');
        if (playerProfile) {
            playerProfile.appendChild(profileBtns);
        }
    }
    
    // Check if customize button already exists
    if (!document.getElementById('customize-btn')) {
        const customizeBtn = document.createElement('button');
        customizeBtn.id = 'customize-btn';
        customizeBtn.className = 'small-button customize-btn';
        customizeBtn.innerHTML = '<i class="fas fa-paint-brush"></i> Customize';
        
        profileBtns.appendChild(customizeBtn);
        
        // Add click event
        customizeBtn.addEventListener('click', () => {
            const customizeModal = document.getElementById('customize-galaxy-modal');
            if (customizeModal) {
                customizeModal.classList.add('show');
            }
        });
    }
}

// Initialize everything once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceGameState();
    ensureCustomizeButton();
    
    // Apply current customizations
    const selectedCosmetics = customizationSystem.getSelectedCosmetics();
    if (selectedCosmetics) {
        applyStarDesign(selectedCosmetics.starDesign);
        applyBackground(selectedCosmetics.background);
    }
    
    // Save game to ensure customization data is stored
    if (typeof saveGameState === 'function') {
        saveGameState();
    }
});
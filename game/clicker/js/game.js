// Game State
let gameState = {
    resources: 0,
    clickValue: 1,
    autoClickerCount: 0,
    boosterCount: 0,
    factoryCount: 0,
    galaxyCount: 0,
    wormholeCount: 0,
    clickMultiplier: 1,
    resourcesPerSecond: 0,
    cosmicDust: 0,
    totalLifetimeStars: 0,
    ascensionCount: 0,
    // Space Chest properties
    spaceChest: {
        active: false,
        nextAppearance: 0,
        minInterval: 300000, // 5 Minuten in Millisekunden
        maxInterval: 600000, // 10 Minuten in Millisekunden
        chestCollected: 0    // Statistik: Wie viele Truhen gesammelt wurden
    },
    // Tägliche Belohnungen
    dailyReward: {
        lastClaimDate: null,  // Datum der letzten Belohnung
        streak: 0,            // Wie viele Tage in Folge eingeloggt
        maxStreak: 0,         // Längste Streak
        available: false      // Ob heute eine Belohnung verfügbar ist
    },
    // Event - Meteoritenschauer
    meteorShower: {
        active: false,        // Ob Event gerade aktiv ist
        nextEvent: 0,         // Zeitpunkt des nächsten Events
        duration: 3600000,    // Dauer: 1 Stunde in Millisekunden
        clickBonus: 2,        // Multiplikator für Klicks während des Events
        meteorClicks: 0,      // Wie viele Meteore während des Events geklickt wurden
        lastEventDate: null   // Datum des letzten Events für Tracking
    },
    upgradeCosts: {
        clickUpgrade: 10,
        autoClicker: 50,
        booster: 200,
        factory: 1000,
        galaxy: 5000,
        wormhole: 20000,
        clickMultiplier: 100
    },
    cosmicUpgrades: {
        clickPower: 0,        // % bonus to click value
        productionBoost: 0,   // % bonus to production
        startingStars: 0,     // Number of 1000-star boosts
        luckyStarChance: 0    // % chance for lucky stars
    },
    cosmicUpgradeCosts: {
        clickPower: 1,
        productionBoost: 1,
        startingStars: 2,
        luckyStarChance: 3
    },
    achievements: {
        achievement1: false, // 100 stars
        achievement2: false, // 1,000 stars
        achievement3: false, // 10,000 stars
        achievement4: false, // 100,000 stars
        achievement5: false, // 1,000,000 stars
        achievement6: false, // 10 clicks
        achievement7: false, // 100 clicks
        achievement8: false, // 1,000 clicks
        achievement9: false, // First upgrade
        achievement10: false, // 5 upgrades
        achievement11: false, // All upgrades at least level 1
        achievement12: false, // 100 stars per second
        achievement13: false, // First ascension
        achievement14: false, // 10 Cosmic Dust
        achievement15: false, // Ascend 5 times
    },
    stats: {
        totalClicks: 0,
        totalUpgrades: 0,
    },
    // For click animation
    lastClickTime: 0,
    clickAnimationInProgress: false
};

// Cache DOM Elements
const resourceCountEl = document.getElementById('resource-count');
const perSecondEl = document.getElementById('per-second');
const mainClickerBtn = document.getElementById('main-clicker');
const clickValueEl = document.getElementById('click-value');
const clickValueDisplay = document.querySelector('.click-value');
const clickStatsEl = document.getElementById('click-stats');
const cosmicDustEl = document.getElementById('cosmic-dust');

// Ascension elements
const ascendBtn = document.getElementById('ascend-button');
const ascendDustGainEl = document.getElementById('ascend-dust-gain');
const modalDustGainEl = document.getElementById('modal-dust-gain');
const ascensionModal = document.getElementById('ascension-modal');
const cancelAscendBtn = document.getElementById('cancel-ascend');
const confirmAscendBtn = document.getElementById('confirm-ascend');

// Upgrade Elements
const clickUpgradeBtn = document.querySelector('#click-upgrade .buy-btn');
const clickLevelEl = document.getElementById('click-level');
const clickCostEl = document.getElementById('click-cost');

const clickMultiplierBtn = document.querySelector('#click-multiplier .buy-btn');
const multiplierLevelEl = document.getElementById('multiplier-level');
const multiplierCostEl = document.getElementById('multiplier-cost');

const autoClickerBtn = document.querySelector('#auto-clicker .buy-btn');
const autoLevelEl = document.getElementById('auto-level');
const autoCostEl = document.getElementById('auto-cost');

const boosterBtn = document.querySelector('#star-booster .buy-btn');
const boosterLevelEl = document.getElementById('booster-level');
const boosterCostEl = document.getElementById('booster-cost');

const factoryBtn = document.querySelector('#star-factory .buy-btn');
const factoryLevelEl = document.getElementById('factory-level');
const factoryCostEl = document.getElementById('factory-cost');

const galaxyBtn = document.querySelector('#star-galaxy .buy-btn');
const galaxyLevelEl = document.getElementById('galaxy-level');
const galaxyCostEl = document.getElementById('galaxy-cost');

const wormholeBtn = document.querySelector('#star-wormhole .buy-btn');
const wormholeLevelEl = document.getElementById('wormhole-level');
const wormholeCostEl = document.getElementById('wormhole-cost');

// Cosmic upgrade elements
const cosmicClickBtn = document.querySelector('#cosmic-click .cosmic-btn');
const cosmicClickLevelEl = document.getElementById('cosmic-click-level');
const cosmicClickCostEl = document.getElementById('cosmic-click-cost');

const cosmicProductionBtn = document.querySelector('#cosmic-production .cosmic-btn');
const cosmicProductionLevelEl = document.getElementById('cosmic-production-level');
const cosmicProductionCostEl = document.getElementById('cosmic-production-cost');

const cosmicStartBtn = document.querySelector('#cosmic-start .cosmic-btn');
const cosmicStartLevelEl = document.getElementById('cosmic-start-level');
const cosmicStartCostEl = document.getElementById('cosmic-start-cost');

const cosmicLuckBtn = document.querySelector('#cosmic-luck .cosmic-btn');
const cosmicLuckLevelEl = document.getElementById('cosmic-luck-level');
const cosmicLuckCostEl = document.getElementById('cosmic-luck-cost');

// Achievement Elements
const achievementEls = {
    achievement1: document.getElementById('achievement-1'),
    achievement2: document.getElementById('achievement-2'),
    achievement3: document.getElementById('achievement-3'),
    achievement4: document.getElementById('achievement-4'),
    achievement5: document.getElementById('achievement-5'),
    achievement6: document.getElementById('achievement-6'),
    achievement7: document.getElementById('achievement-7'),
    achievement8: document.getElementById('achievement-8'),
    achievement9: document.getElementById('achievement-9'),
    achievement10: document.getElementById('achievement-10'),
    achievement11: document.getElementById('achievement-11'),
    achievement12: document.getElementById('achievement-12'),
    achievement13: document.getElementById('achievement-13'),
    achievement14: document.getElementById('achievement-14'),
    achievement15: document.getElementById('achievement-15')
};

// Achievement Modal elements
const achievementsBtn = document.getElementById('achievements-btn');
const achievementsModal = document.getElementById('achievements-modal');
const closeAchievementsBtn = document.getElementById('close-achievements');

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return Math.floor(num); // Hier wird die Zahl auf eine ganze Zahl abgerundet
    }
}

// Calculate how much Cosmic Dust would be earned on ascension
function calculateAscensionDust() {
    if (gameState.resources < 10000) {
        return 0;
    }
    
    // Formula: log10(stars) - 3, rounded down, with a minimum of 1
    return Math.max(1, Math.floor(Math.log10(gameState.resources) - 3));
}

// Update ascension button status
function updateAscensionStatus() {
    const dustGain = calculateAscensionDust();
    ascendDustGainEl.textContent = dustGain;
    
    if (dustGain > 0) {
        ascendBtn.disabled = false;
    } else {
        ascendBtn.disabled = true;
    }
}

// Open ascension confirmation modal
function openAscensionModal() {
    const dustGain = calculateAscensionDust();
    modalDustGainEl.textContent = dustGain;
    ascensionModal.classList.add('show');
}

// Close ascension confirmation modal
function closeAscensionModal() {
    ascensionModal.classList.remove('show');
}

// Perform ascension
function ascend() {
    const dustGain = calculateAscensionDust();
    
    // Add Cosmic Dust
    gameState.cosmicDust += dustGain;
    
    // Track ascension count
    gameState.ascensionCount++;
    
    // Reset resources but keep total lifetime stats
    gameState.totalLifetimeStars += gameState.resources;
    
    // Apply starting stars boost from cosmic upgrade
    gameState.resources = gameState.cosmicUpgrades.startingStars * 1000;
    
    // Reset upgrades
    gameState.clickValue = 1;
    gameState.autoClickerCount = 0;
    gameState.boosterCount = 0;
    gameState.factoryCount = 0;
    gameState.galaxyCount = 0;
    gameState.wormholeCount = 0;
    gameState.clickMultiplier = 1;
    gameState.resourcesPerSecond = 0;
    
    // Reset upgrade costs
    gameState.upgradeCosts = {
        clickUpgrade: 10,
        autoClicker: 50,
        booster: 200,
        factory: 1000,
        galaxy: 5000,
        wormhole: 20000,
        clickMultiplier: 100
    };
    
    // Check ascension achievements
    if (!gameState.achievements.achievement13) {
        gameState.achievements.achievement13 = true;
        achievementEls.achievement13.classList.replace('locked', 'unlocked');
        showAchievementNotification('First Ascension');
    }
    
    if (gameState.cosmicDust >= 10 && !gameState.achievements.achievement14) {
        gameState.achievements.achievement14 = true;
        achievementEls.achievement14.classList.replace('locked', 'unlocked');
        showAchievementNotification('Cosmic Power');
    }
    
    if (gameState.ascensionCount >= 5 && !gameState.achievements.achievement15) {
        gameState.achievements.achievement15 = true;
        achievementEls.achievement15.classList.replace('locked', 'unlocked');
        showAchievementNotification('Cosmic Master');
    }
    
    // Close modal and update UI
    closeAscensionModal();
    updateUI();
    updateCosmicUI();
    
    // Show ascension message
    showAscensionNotification(dustGain);
}

// Show ascension notification
function showAscensionNotification(dustAmount) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification ascension-notification';
    notification.innerHTML = `
        <i class="fas fa-superpowers"></i>
        <div>
            <h3>Ascension Complete!</h3>
            <p>Gained ${dustAmount} Cosmic Dust</p>
        </div>
    `;
    
    // Append to body with special styling
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--cosmic-primary)';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.borderRadius = '8px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.boxShadow = '0 0 20px rgba(155, 66, 184, 0.7)';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateX(120%)';
    notification.style.transition = 'transform 0.3s ease-in-out';
    
    // Animation to slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Update UI for cosmic upgrades
function updateCosmicUI() {
    // Update cosmic dust display
    cosmicDustEl.textContent = gameState.cosmicDust;
    
    // Update cosmic upgrade levels and costs
    cosmicClickLevelEl.textContent = gameState.cosmicUpgrades.clickPower;
    cosmicClickCostEl.textContent = gameState.cosmicUpgradeCosts.clickPower;
    cosmicClickBtn.disabled = gameState.cosmicDust < gameState.cosmicUpgradeCosts.clickPower;
    
    cosmicProductionLevelEl.textContent = gameState.cosmicUpgrades.productionBoost;
    cosmicProductionCostEl.textContent = gameState.cosmicUpgradeCosts.productionBoost;
    cosmicProductionBtn.disabled = gameState.cosmicDust < gameState.cosmicUpgradeCosts.productionBoost;
    
    cosmicStartLevelEl.textContent = gameState.cosmicUpgrades.startingStars;
    cosmicStartCostEl.textContent = gameState.cosmicUpgradeCosts.startingStars;
    cosmicStartBtn.disabled = gameState.cosmicDust < gameState.cosmicUpgradeCosts.startingStars;
    
    cosmicLuckLevelEl.textContent = gameState.cosmicUpgrades.luckyStarChance;
    cosmicLuckCostEl.textContent = gameState.cosmicUpgradeCosts.luckyStarChance;
    cosmicLuckBtn.disabled = gameState.cosmicDust < gameState.cosmicUpgradeCosts.luckyStarChance;
    
    // Update ascension button
    updateAscensionStatus();
}

// Update UI
function updateUI() {
    resourceCountEl.textContent = formatNumber(Math.floor(gameState.resources));
    perSecondEl.textContent = formatNumber(gameState.resourcesPerSecond);
    clickValueEl.textContent = formatNumber(getEffectiveClickValue());
    clickStatsEl.textContent = formatNumber(gameState.stats.totalClicks);

    // Update upgrade buttons and costs
    clickLevelEl.textContent = gameState.clickValue;
    clickCostEl.textContent = formatNumber(gameState.upgradeCosts.clickUpgrade);
    clickUpgradeBtn.disabled = gameState.resources < gameState.upgradeCosts.clickUpgrade;

    multiplierLevelEl.textContent = gameState.clickMultiplier;
    multiplierCostEl.textContent = formatNumber(gameState.upgradeCosts.clickMultiplier);
    clickMultiplierBtn.disabled = gameState.resources < gameState.upgradeCosts.clickMultiplier;

    autoLevelEl.textContent = gameState.autoClickerCount;
    autoCostEl.textContent = formatNumber(gameState.upgradeCosts.autoClicker);
    autoClickerBtn.disabled = gameState.resources < gameState.upgradeCosts.autoClicker;

    boosterLevelEl.textContent = gameState.boosterCount;
    boosterCostEl.textContent = formatNumber(gameState.upgradeCosts.booster);
    boosterBtn.disabled = gameState.resources < gameState.upgradeCosts.booster;

    factoryLevelEl.textContent = gameState.factoryCount;
    factoryCostEl.textContent = formatNumber(gameState.upgradeCosts.factory);
    factoryBtn.disabled = gameState.resources < gameState.upgradeCosts.factory;
    
    galaxyLevelEl.textContent = gameState.galaxyCount;
    galaxyCostEl.textContent = formatNumber(gameState.upgradeCosts.galaxy);
    galaxyBtn.disabled = gameState.resources < gameState.upgradeCosts.galaxy;
    
    wormholeLevelEl.textContent = gameState.wormholeCount;
    wormholeCostEl.textContent = formatNumber(gameState.upgradeCosts.wormhole);
    wormholeBtn.disabled = gameState.resources < gameState.upgradeCosts.wormhole;

    // Update the date in the footer
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    
    // Update ascension status
    updateAscensionStatus();
}

// Get the effective click value including cosmic upgrades
function getEffectiveClickValue() {
    let baseValue = gameState.clickValue * gameState.clickMultiplier;
    let cosmicBonus = 1 + (gameState.cosmicUpgrades.clickPower / 100);
    return baseValue * cosmicBonus;
}

// Add resources from click
function addResourcesFromClick(e) {
    // Prevent any default behavior
    if (e) e.preventDefault();
    
    // Calculate base click value
    let clickValue = getEffectiveClickValue();
    
    // Check for lucky stars (from cosmic luck upgrade)
    if (gameState.cosmicUpgrades.luckyStarChance > 0) {
        const luckChance = gameState.cosmicUpgrades.luckyStarChance; // percentage
        if (Math.random() * 100 < luckChance) {
            // Lucky star! Multiply click value by 5-10x
            const luckyMultiplier = 5 + Math.floor(Math.random() * 6);
            clickValue *= luckyMultiplier;
            showLuckyStarEffect(luckyMultiplier);
        }
    }
    
    // Add resources based on click value and multiplier
    gameState.resources += clickValue;
    
    // Update statistics
    gameState.stats.totalClicks++;
    
    // Check click-based achievements
    checkClickAchievements();
    
    // Check resource-based achievements
    checkResourceAchievements();
    
    // Create click animation
    showClickAnimation(clickValue);
    
    // Update UI immediately to feel more responsive
    resourceCountEl.textContent = formatNumber(Math.floor(gameState.resources));
}

// Show lucky star animation
function showLuckyStarEffect(multiplier) {
    // Create lucky star element
    const luckyStarEl = document.createElement('div');
    luckyStarEl.className = 'lucky-star';
    luckyStarEl.textContent = `LUCKY! x${multiplier}`;
    
    // Style the lucky star
    luckyStarEl.style.position = 'absolute';
    luckyStarEl.style.top = '50%';
    luckyStarEl.style.left = '50%';
    luckyStarEl.style.transform = 'translate(-50%, -50%)';
    luckyStarEl.style.fontSize = '2rem';
    luckyStarEl.style.fontWeight = 'bold';
    luckyStarEl.style.color = '#ffdf00';
    luckyStarEl.style.textShadow = '0 0 10px #ff9900, 0 0 20px #ff9900';
    luckyStarEl.style.zIndex = '100';
    luckyStarEl.style.pointerEvents = 'none';
    luckyStarEl.style.animation = 'lucky-star 2s forwards';
    
    // Add the animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes lucky-star {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
    }
    `;
    document.head.appendChild(style);
    
    // Add to clicker area
    document.querySelector('.clicker-area').appendChild(luckyStarEl);
    
    // Remove after animation
    setTimeout(() => {
        if (luckyStarEl.parentNode) {
            luckyStarEl.parentNode.removeChild(luckyStarEl);
        }
    }, 2000);
}

// Show click animation
function showClickAnimation(clickValue) {
    // Only show animation if not already in progress or enough time has passed
    const currentTime = Date.now();
    
    if (!gameState.clickAnimationInProgress || currentTime - gameState.lastClickTime > 50) {
        gameState.clickAnimationInProgress = true;
        
        // Show the click value
        clickValueDisplay.textContent = `+${formatNumber(clickValue)}`;
        clickValueDisplay.classList.add('click-anim');
        
        // Clone and add a floating number at a random position near the cursor
        const floatingNumber = document.createElement('div');
        floatingNumber.className = 'floating-number';
        floatingNumber.textContent = `+${formatNumber(clickValue)}`;
        
        // Position it randomly near the cursor
        const randomX = Math.floor(Math.random() * 40) - 20;
        const randomY = Math.floor(Math.random() * 20) - 40;
        
        floatingNumber.style.position = 'absolute';
        floatingNumber.style.left = `calc(50% + ${randomX}px)`;
        floatingNumber.style.top = `calc(50% + ${randomY}px)`;
        floatingNumber.style.color = 'white';
        floatingNumber.style.textShadow = '0 0 3px black';
        floatingNumber.style.fontWeight = 'bold';
        floatingNumber.style.pointerEvents = 'none';
        floatingNumber.style.zIndex = '100';
        floatingNumber.style.animation = 'float-away 1s forwards';
        
        document.querySelector('.clicker-area').appendChild(floatingNumber);
        
        // Remove after animation
        setTimeout(() => {
            if (floatingNumber.parentNode) {
                floatingNumber.parentNode.removeChild(floatingNumber);
            }
        }, 1000);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            clickValueDisplay.classList.remove('click-anim');
            gameState.clickAnimationInProgress = false;
        }, 500);
        
        gameState.lastClickTime = currentTime;
    }
}

// Add resources from auto clickers (per second)
function addResourcesPerSecond() {
    // Auto clicker generates 1 per second
    let autoClickerProduction = gameState.autoClickerCount;
    
    // Boosters multiply auto clicker production by 1.5 per booster
    let boosterMultiplier = 1 + (gameState.boosterCount * 0.5);
    
    // Factory generates 10 per second
    let factoryProduction = gameState.factoryCount * 10;
    
    // Galaxy generates 50 per second
    let galaxyProduction = gameState.galaxyCount * 50;
    
    // Wormhole generates 200 per second
    let wormholeProduction = gameState.wormholeCount * 200;
    
    // Calculate total resources per second before cosmic boost
    let baseResourcesPerSecond = (autoClickerProduction * boosterMultiplier) + 
                                factoryProduction + 
                                galaxyProduction + 
                                wormholeProduction;
    
    // Apply cosmic production boost
    let cosmicProductionMultiplier = 1 + (gameState.cosmicUpgrades.productionBoost / 100);
    gameState.resourcesPerSecond = baseResourcesPerSecond * cosmicProductionMultiplier;
    
    // Add resources based on the time since the last update
    gameState.resources += gameState.resourcesPerSecond / 10;
    
    // Check achievements
    checkResourceAchievements();
}

// Buy click upgrade
function buyClickUpgrade() {
    if (gameState.resources >= gameState.upgradeCosts.clickUpgrade) {
        gameState.resources -= gameState.upgradeCosts.clickUpgrade;
        gameState.clickValue += 1;
        gameState.upgradeCosts.clickUpgrade = Math.floor(gameState.upgradeCosts.clickUpgrade * 1.5);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy auto clicker
function buyAutoClicker() {
    if (gameState.resources >= gameState.upgradeCosts.autoClicker) {
        gameState.resources -= gameState.upgradeCosts.autoClicker;
        gameState.autoClickerCount += 1;
        gameState.upgradeCosts.autoClicker = Math.floor(gameState.upgradeCosts.autoClicker * 1.5);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy booster
function buyBooster() {
    if (gameState.resources >= gameState.upgradeCosts.booster) {
        gameState.resources -= gameState.upgradeCosts.booster;
        gameState.boosterCount += 1;
        gameState.upgradeCosts.booster = Math.floor(gameState.upgradeCosts.booster * 1.8);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy factory
function buyFactory() {
    if (gameState.resources >= gameState.upgradeCosts.factory) {
        gameState.resources -= gameState.upgradeCosts.factory;
        gameState.factoryCount += 1;
        gameState.upgradeCosts.factory = Math.floor(gameState.upgradeCosts.factory * 2);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy click multiplier
function buyClickMultiplier() {
    if (gameState.resources >= gameState.upgradeCosts.clickMultiplier) {
        gameState.resources -= gameState.upgradeCosts.clickMultiplier;
        gameState.clickMultiplier += 1;
        gameState.upgradeCosts.clickMultiplier = Math.floor(gameState.upgradeCosts.clickMultiplier * 2.5);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy galaxy
function buyGalaxy() {
    if (gameState.resources >= gameState.upgradeCosts.galaxy) {
        gameState.resources -= gameState.upgradeCosts.galaxy;
        gameState.galaxyCount += 1;
        gameState.upgradeCosts.galaxy = Math.floor(gameState.upgradeCosts.galaxy * 2.2);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy wormhole
function buyWormhole() {
    if (gameState.resources >= gameState.upgradeCosts.wormhole) {
        gameState.resources -= gameState.upgradeCosts.wormhole;
        gameState.wormholeCount += 1;
        gameState.upgradeCosts.wormhole = Math.floor(gameState.upgradeCosts.wormhole * 2.5);
        gameState.stats.totalUpgrades++;
        checkUpgradeAchievements();
        updateUI();
    }
}

// Buy cosmic click power upgrade
function buyCosmicClickPower() {
    if (gameState.cosmicDust >= gameState.cosmicUpgradeCosts.clickPower) {
        gameState.cosmicDust -= gameState.cosmicUpgradeCosts.clickPower;
        gameState.cosmicUpgrades.clickPower += 5; // Add 5% to click power
        gameState.cosmicUpgradeCosts.clickPower = Math.floor(gameState.cosmicUpgradeCosts.clickPower * 1.5);
        updateCosmicUI();
        updateUI();
    }
}

// Buy cosmic production boost upgrade
function buyCosmicProductionBoost() {
    if (gameState.cosmicDust >= gameState.cosmicUpgradeCosts.productionBoost) {
        gameState.cosmicDust -= gameState.cosmicUpgradeCosts.productionBoost;
        gameState.cosmicUpgrades.productionBoost += 5; // Add 5% to production
        gameState.cosmicUpgradeCosts.productionBoost = Math.floor(gameState.cosmicUpgradeCosts.productionBoost * 1.5);
        updateCosmicUI();
        updateUI();
    }
}

// Buy cosmic starting stars upgrade
function buyCosmicStartingStars() {
    if (gameState.cosmicDust >= gameState.cosmicUpgradeCosts.startingStars) {
        gameState.cosmicDust -= gameState.cosmicUpgradeCosts.startingStars;
        gameState.cosmicUpgrades.startingStars += 1; // Add 1000 to starting stars
        gameState.cosmicUpgradeCosts.startingStars = Math.floor(gameState.cosmicUpgradeCosts.startingStars * 2);
        updateCosmicUI();
        updateUI();
    }
}

// Buy cosmic luck upgrade
function buyCosmicLuck() {
    if (gameState.cosmicDust >= gameState.cosmicUpgradeCosts.luckyStarChance) {
        gameState.cosmicDust -= gameState.cosmicUpgradeCosts.luckyStarChance;
        gameState.cosmicUpgrades.luckyStarChance += 1; // Add 1% lucky star chance
        gameState.cosmicUpgradeCosts.luckyStarChance = Math.floor(gameState.cosmicUpgradeCosts.luckyStarChance * 1.8);
        updateCosmicUI();
        updateUI();
    }
}

// Check resource-based achievements
function checkResourceAchievements() {
    // Achievement 1: 100 stars
    if (!gameState.achievements.achievement1 && gameState.resources >= 100) {
        gameState.achievements.achievement1 = true;
        achievementEls.achievement1.classList.replace('locked', 'unlocked');
        showAchievementNotification('Star Novice');
    }
    
    // Achievement 2: 1,000 stars
    if (!gameState.achievements.achievement2 && gameState.resources >= 1000) {
        gameState.achievements.achievement2 = true;
        achievementEls.achievement2.classList.replace('locked', 'unlocked');
        showAchievementNotification('Star Expert');
    }
    
    // Achievement 3: 10,000 stars
    if (!gameState.achievements.achievement3 && gameState.resources >= 10000) {
        gameState.achievements.achievement3 = true;
        achievementEls.achievement3.classList.replace('locked', 'unlocked');
        showAchievementNotification('Star Master');
    }
    
    // Achievement 4: 100,000 stars
    if (!gameState.achievements.achievement4 && gameState.resources >= 100000) {
        gameState.achievements.achievement4 = true;
        achievementEls.achievement4.classList.replace('locked', 'unlocked');
        showAchievementNotification('Galactic Emperor');
    }
    
    // Achievement 5: 1,000,000 stars
    if (!gameState.achievements.achievement5 && gameState.resources >= 1000000) {
        gameState.achievements.achievement5 = true;
        achievementEls.achievement5.classList.replace('locked', 'unlocked');
        showAchievementNotification('Star God');
    }
    
    // Achievement 12: 100 stars per second
    if (!gameState.achievements.achievement12 && gameState.resourcesPerSecond >= 100) {
        gameState.achievements.achievement12 = true;
        achievementEls.achievement12.classList.replace('locked', 'unlocked');
        showAchievementNotification('Star Factory');
    }
}

// Check click-based achievements
function checkClickAchievements() {
    // Achievement 6: 10 clicks
    if (!gameState.achievements.achievement6 && gameState.stats.totalClicks >= 10) {
        gameState.achievements.achievement6 = true;
        achievementEls.achievement6.classList.replace('locked', 'unlocked');
        showAchievementNotification('Clicking Starter');
    }
    
    // Achievement 7: 100 clicks
    if (!gameState.achievements.achievement7 && gameState.stats.totalClicks >= 100) {
        gameState.achievements.achievement7 = true;
        achievementEls.achievement7.classList.replace('locked', 'unlocked');
        showAchievementNotification('Clicking Pro');
    }
    
    // Achievement 8: 1,000 clicks
    if (!gameState.achievements.achievement8 && gameState.stats.totalClicks >= 1000) {
        gameState.achievements.achievement8 = true;
        achievementEls.achievement8.classList.replace('locked', 'unlocked');
        showAchievementNotification('Clicking Master');
    }
}

// Check upgrade-based achievements
function checkUpgradeAchievements() {
    // Achievement 9: First upgrade
    if (!gameState.achievements.achievement9 && gameState.stats.totalUpgrades >= 1) {
        gameState.achievements.achievement9 = true;
        achievementEls.achievement9.classList.replace('locked', 'unlocked');
        showAchievementNotification('First Upgrade');
    }
    
    // Achievement 10: 5 upgrades
    if (!gameState.achievements.achievement10 && gameState.stats.totalUpgrades >= 5) {
        gameState.achievements.achievement10 = true;
        achievementEls.achievement10.classList.replace('locked', 'unlocked');
        showAchievementNotification('Getting Stronger');
    }
    
    // Achievement 11: All upgrades at least level 1
    if (!gameState.achievements.achievement11 && 
        gameState.clickValue > 1 && 
        gameState.autoClickerCount >= 1 && 
        gameState.boosterCount >= 1 && 
        gameState.factoryCount >= 1 && 
        gameState.galaxyCount >= 1 && 
        gameState.wormholeCount >= 1 && 
        gameState.clickMultiplier > 1) {
        gameState.achievements.achievement11 = true;
        achievementEls.achievement11.classList.replace('locked', 'unlocked');
        showAchievementNotification('Upgrade Collector');
    }
}

// Show achievement notification
function showAchievementNotification(achievementName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <i class="fas fa-trophy"></i>
        <div>
            <h3>Achievement Unlocked!</h3>
            <p>${achievementName}</p>
        </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-primary)';
    notification.style.color = 'white';
    notification.style.padding = '15px';
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

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('cosmicClickerSave', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('cosmicClickerSave');
    
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Handle migration from older versions of the save
        if (!parsedState.stats) {
            parsedState.stats = {
                totalClicks: 0,
                totalUpgrades: 0
            };
        }
        
        if (parsedState.clickMultiplier === undefined) {
            parsedState.clickMultiplier = 1;
        }
        
        if (parsedState.galaxyCount === undefined) {
            parsedState.galaxyCount = 0;
        }
        
        if (parsedState.wormholeCount === undefined) {
            parsedState.wormholeCount = 0;
        }
        
        if (parsedState.cosmicDust === undefined) {
            parsedState.cosmicDust = 0;
        }
        
        if (parsedState.totalLifetimeStars === undefined) {
            parsedState.totalLifetimeStars = parsedState.resources;
        }
        
        if (parsedState.ascensionCount === undefined) {
            parsedState.ascensionCount = 0;
        }
        
        if (parsedState.cosmicUpgrades === undefined) {
            parsedState.cosmicUpgrades = {
                clickPower: 0,
                productionBoost: 0,
                startingStars: 0,
                luckyStarChance: 0
            };
        }
        
        if (parsedState.cosmicUpgradeCosts === undefined) {
            parsedState.cosmicUpgradeCosts = {
                clickPower: 1,
                productionBoost: 1,
                startingStars: 2,
                luckyStarChance: 3
            };
        }
        
        if (!parsedState.upgradeCosts.clickMultiplier) {
            parsedState.upgradeCosts.clickMultiplier = 100;
        }
        
        if (!parsedState.upgradeCosts.galaxy) {
            parsedState.upgradeCosts.galaxy = 5000;
        }
        
        if (!parsedState.upgradeCosts.wormhole) {
            parsedState.upgradeCosts.wormhole = 20000;
        }
        
        // Update achievements
        for (let i = 5; i <= 15; i++) {
            if (parsedState.achievements[`achievement${i}`] === undefined) {
                parsedState.achievements[`achievement${i}`] = false;
            }
        }
        
        gameState = parsedState;
        
        // Update UI after loading
        updateUI();
        updateCosmicUI();
        
        // Check for unlocked achievements
        for (let i = 1; i <= 15; i++) {
            if (gameState.achievements[`achievement${i}`] && achievementEls[`achievement${i}`]) {
                achievementEls[`achievement${i}`].classList.replace('locked', 'unlocked');
            }
        }
    }
}

// Space Chest Functions
// Schedule the next appearance of a space chest
function scheduleNextSpaceChest() {
    // Zufälliges Zeitintervall zwischen min und max Intervall
    const interval = gameState.spaceChest.minInterval + 
        Math.floor(Math.random() * (gameState.spaceChest.maxInterval - gameState.spaceChest.minInterval));
    
    // Setze nächstes Erscheinen
    gameState.spaceChest.nextAppearance = Date.now() + interval;
    gameState.spaceChest.active = false;
}

// Check if it's time to show a space chest
function checkSpaceChest() {
    // Wenn bereits aktiv, nicht prüfen
    if (gameState.spaceChest.active) return;
    
    // Wenn es Zeit ist für die nächste Space Chest
    if (Date.now() >= gameState.spaceChest.nextAppearance) {
        showSpaceChest();
    }
}

// Show the space chest on screen
function showSpaceChest() {
    // Markiere Chest als aktiv
    gameState.spaceChest.active = true;
    
    // Erstelle Space Chest Element
    const chestElement = document.createElement('div');
    chestElement.id = 'space-chest';
    chestElement.className = 'space-chest';
    chestElement.innerHTML = '<i class="fas fa-gift"></i>'; // Font Awesome Gift-Icon
    
    // Stil hinzufügen
    chestElement.style.position = 'absolute';
    chestElement.style.width = '70px';
    chestElement.style.height = '70px';
    chestElement.style.backgroundColor = '#4a2c91';
    chestElement.style.borderRadius = '10px';
    chestElement.style.boxShadow = '0 0 20px #8a4bff';
    chestElement.style.display = 'flex';
    chestElement.style.justifyContent = 'center';
    chestElement.style.alignItems = 'center';
    chestElement.style.cursor = 'pointer';
    chestElement.style.zIndex = '100';
    chestElement.style.animation = 'float 2s infinite alternate';
    chestElement.style.color = 'gold';
    chestElement.style.fontSize = '2rem';
    
    // Zufällige Position auf dem Bildschirm
    const randomX = Math.floor(Math.random() * 70);
    const randomY = Math.floor(Math.random() * 50) + 20;
    chestElement.style.top = `${randomY}%`;
    chestElement.style.right = `${randomX}%`;
    
    // Füge CSS Animation für das Schweben hinzu
    const style = document.createElement('style');
    style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-10px) rotate(2deg);
        }
        100% {
            transform: translateY(0) rotate(-2deg);
        }
    }
    
    @keyframes chest-open {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(0); }
    }
    `;
    document.head.appendChild(style);
    
    // Füge Klick-Event-Listener hinzu
    chestElement.addEventListener('click', () => {
        openSpaceChest(chestElement);
    });
    
    // Füge die Chest dem Dokument hinzu
    document.querySelector('.game-container').appendChild(chestElement);
    
    // Entferne die Chest nach 60 Sekunden, falls nicht geklickt
    setTimeout(() => {
        if (gameState.spaceChest.active) {
            if (chestElement.parentNode) {
                chestElement.parentNode.removeChild(chestElement);
            }
            scheduleNextSpaceChest();
        }
    }, 60000);
}

// Open the chest when clicked
function openSpaceChest(chestElement) {
    // Animation für das Öffnen
    chestElement.style.animation = 'chest-open 0.8s forwards';
    
    // Zufällige Belohnung auswählen
    const rewardType = Math.floor(Math.random() * 100);
    let rewardText = '';
    let rewardIcon = '';
    
    if (rewardType < 50) {
        // 50% Chance: Sterne (100 bis 500 × aktuelle Produktion pro Sekunde)
        const multiplier = 100 + Math.floor(Math.random() * 400);
        const starBonus = Math.max(100, Math.floor(gameState.resourcesPerSecond * multiplier / 100));
        gameState.resources += starBonus;
        rewardText = `+${formatNumber(starBonus)} Stars!`;
        rewardIcon = '<i class="fas fa-star"></i>';
    } else if (rewardType < 80) {
        // 30% Chance: Temporärer Produktionsboost (2-5× für 30 Sekunden)
        const multiplier = 2 + Math.floor(Math.random() * 4);
        applyTemporaryProductionBoost(multiplier, 30);
        rewardText = `${multiplier}× Production for 30s!`;
        rewardIcon = '<i class="fas fa-bolt"></i>';
    } else if (rewardType < 95) {
        // 15% Chance: Temporärer Click-Power-Boost (5-10× für 30 Sekunden)
        const multiplier = 5 + Math.floor(Math.random() * 6);
        applyTemporaryClickBoost(multiplier, 30);
        rewardText = `${multiplier}× Click Power for 30s!`;
        rewardIcon = '<i class="fas fa-hand-pointer"></i>';
    } else {
        // 5% Chance: Cosmic Dust
        const dustAmount = 1 + Math.floor(Math.random() * 2); // 1-2 Cosmic Dust
        gameState.cosmicDust += dustAmount;
        rewardText = `+${dustAmount} Cosmic Dust!`;
        rewardIcon = '<i class="fas fa-superpowers"></i>';
    }
    
    // Statistik aktualisieren
    gameState.spaceChest.chestCollected++;
    
    // Zeige Belohnungstext
    showChestReward(rewardText, rewardIcon);
    
    // Entferne die Chest nach der Animation
    setTimeout(() => {
        if (chestElement.parentNode) {
            chestElement.parentNode.removeChild(chestElement);
        }
        
        // Plane die nächste Chest
        scheduleNextSpaceChest();
        
        // Aktualisiere UI
        updateUI();
        updateCosmicUI();
    }, 800);
}

// Show reward notification
function showChestReward(rewardText, rewardIcon) {
    // Erstelle Belohnungsanzeige
    const rewardElement = document.createElement('div');
    rewardElement.className = 'chest-reward';
    rewardElement.innerHTML = `
        ${rewardIcon}
        <p>${rewardText}</p>
    `;
    
    // Stil hinzufügen
    rewardElement.style.position = 'fixed';
    rewardElement.style.top = '50%';
    rewardElement.style.left = '50%';
    rewardElement.style.transform = 'translate(-50%, -50%)';
    rewardElement.style.backgroundColor = 'rgba(74, 44, 145, 0.9)';
    rewardElement.style.color = 'white';
    rewardElement.style.borderRadius = '10px';
    rewardElement.style.padding = '20px';
    rewardElement.style.textAlign = 'center';
    rewardElement.style.fontSize = '24px';
    rewardElement.style.fontWeight = 'bold';
    rewardElement.style.boxShadow = '0 0 30px #8a4bff';
    rewardElement.style.zIndex = '200';
    rewardElement.style.animation = 'reward-show 2.5s forwards';
    
    // Animation hinzufügen
    const style = document.createElement('style');
    style.textContent = `
    @keyframes reward-show {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
    }`;
    document.head.appendChild(style);
    
    // Dem Dokument hinzufügen
    document.body.appendChild(rewardElement);
    
    // Nach Animation entfernen
    setTimeout(() => {
        if (rewardElement.parentNode) {
            rewardElement.parentNode.removeChild(rewardElement);
        }
    }, 2500);
}

// Temporärer Produktionsboost
let productionBoostTimer = null;
let originalResourcesPerSecond = 0;

function applyTemporaryProductionBoost(multiplier, durationInSeconds) {
    // Wenn bereits ein Boost aktiv ist, entferne ihn
    if (productionBoostTimer) {
        clearTimeout(productionBoostTimer);
        gameState.resourcesPerSecond = originalResourcesPerSecond;
    }
    
    // Speichere originale Produktionsrate
    originalResourcesPerSecond = gameState.resourcesPerSecond;
    
    // Wende Boost an
    gameState.resourcesPerSecond *= multiplier;
    
    // Erstelle visuelles Feedback
    showActiveBoost('production', multiplier, durationInSeconds);
    
    // Setze Timer zum Zurücksetzen
    productionBoostTimer = setTimeout(() => {
        gameState.resourcesPerSecond = originalResourcesPerSecond;
        productionBoostTimer = null;
        
        // Entferne visuelle Anzeige
        const boostIndicator = document.getElementById('production-boost-indicator');
        if (boostIndicator && boostIndicator.parentNode) {
            boostIndicator.parentNode.removeChild(boostIndicator);
        }
        
        updateUI();
    }, durationInSeconds * 1000);
}

// Temporärer Klick-Boost
let clickBoostTimer = null;
let originalClickValue = 0;

function applyTemporaryClickBoost(multiplier, durationInSeconds) {
    // Wenn bereits ein Boost aktiv ist, entferne ihn
    if (clickBoostTimer) {
        clearTimeout(clickBoostTimer);
        gameState.clickValue = originalClickValue;
    }
    
    // Speichere originalen Klickwert
    originalClickValue = gameState.clickValue;
    
    // Wende Boost an (auf den Basiswert, nicht den effektiven Wert)
    gameState.clickValue *= multiplier;
    
    // Erstelle visuelles Feedback
    showActiveBoost('click', multiplier, durationInSeconds);
    
    // Setze Timer zum Zurücksetzen
    clickBoostTimer = setTimeout(() => {
        gameState.clickValue = originalClickValue;
        clickBoostTimer = null;
        
        // Entferne visuelle Anzeige
        const boostIndicator = document.getElementById('click-boost-indicator');
        if (boostIndicator && boostIndicator.parentNode) {
            boostIndicator.parentNode.removeChild(boostIndicator);
        }
        
        updateUI();
    }, durationInSeconds * 1000);
}

// Show active boost indicator
function showActiveBoost(type, multiplier, duration) {
    // Lösche vorhandenen Indikator falls vorhanden
    const existingIndicator = document.getElementById(`${type}-boost-indicator`);
    if (existingIndicator && existingIndicator.parentNode) {
        existingIndicator.parentNode.removeChild(existingIndicator);
    }
    
    // Erstelle Boost-Indikator
    const boostIndicator = document.createElement('div');
    boostIndicator.id = `${type}-boost-indicator`;
    boostIndicator.className = 'boost-indicator';
    
    // Icon basierend auf Boost-Typ
    let icon = type === 'production' ? '<i class="fas fa-bolt"></i>' : '<i class="fas fa-hand-pointer"></i>';
    
    boostIndicator.innerHTML = `
        ${icon} ${multiplier}× Boost
        <div class="boost-timer" id="${type}-boost-timer">
            <div class="timer-fill"></div>
        </div>
    `;
    
    // Stil hinzufügen
    boostIndicator.style.position = 'fixed';
    boostIndicator.style.bottom = type === 'production' ? '80px' : '20px';
    boostIndicator.style.left = '20px';
    boostIndicator.style.backgroundColor = type === 'production' ? '#4a2c91' : '#9c432e';
    boostIndicator.style.color = 'white';
    boostIndicator.style.padding = '10px';
    boostIndicator.style.borderRadius = '5px';
    boostIndicator.style.fontWeight = 'bold';
    boostIndicator.style.boxShadow = `0 0 10px ${type === 'production' ? '#8a4bff' : '#ff8c4b'}`;
    boostIndicator.style.zIndex = '100';
    
    // Timer-Stil
    const style = document.createElement('style');
    style.textContent = `
    .boost-timer {
        width: 100%;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.3);
        margin-top: 5px;
        border-radius: 2px;
        overflow: hidden;
    }
    .timer-fill {
        height: 100%;
        width: 100%;
        background-color: white;
        border-radius: 2px;
        animation: timer-countdown ${duration}s linear forwards;
    }
    @keyframes timer-countdown {
        0% { width: 100%; }
        100% { width: 0%; }
    }`;
    document.head.appendChild(style);
    
    // Füge zum Dokument hinzu
    document.body.appendChild(boostIndicator);
}

// Meteor Shower Event Functions
function checkMeteorShowerEvent() {
    // Wenn das Event bereits aktiv ist, nichts tun
    if (gameState.meteorShower.active) return;
    
    // Wenn es Zeit für das nächste Event ist oder kein nächstes Event geplant ist
    if (!gameState.meteorShower.nextEvent || Date.now() >= gameState.meteorShower.nextEvent) {
        startMeteorShowerEvent();
    }
}

function startMeteorShowerEvent() {
    // Setze Event als aktiv
    gameState.meteorShower.active = true;
    gameState.meteorShower.meteorClicks = 0;
    gameState.meteorShower.lastEventDate = new Date().toString();
    
    // Zeige das Event Banner
    showMeteorShowerBanner();
    
    // Aktiviere visuelle Effekte und Gameplay-Boni
    activateMeteorShowerEffects();
    
    // Setze Timer für das Ende des Events
    setTimeout(() => {
        endMeteorShowerEvent();
    }, gameState.meteorShower.duration);
    
    // Plane das nächste Event (zwischen 12 und 24 Stunden)
    const nextEventDelay = 43200000 + Math.floor(Math.random() * 43200000); // 12-24 Stunden
    gameState.meteorShower.nextEvent = Date.now() + nextEventDelay + gameState.meteorShower.duration;
}

function showMeteorShowerBanner() {
    // Erstelle Banner-Element
    const banner = document.createElement('div');
    banner.id = 'meteor-shower-banner';
    banner.className = 'event-banner';
    
    // Erstelle relative timestamp für Countdown
    const endTime = Date.now() + gameState.meteorShower.duration;
    
    // Banner-Inhalt
    banner.innerHTML = `
        <div class="banner-header">
            <i class="fas fa-meteor"></i>
            <h3>Meteoritenschauer!</h3>
        </div>
        <div class="banner-content">
            <p>Doppelte Klick-Belohnung für ${Math.floor(gameState.meteorShower.duration / 1000 / 60)} Minuten!</p>
            <div class="event-timer" id="meteor-timer">
                <div class="timer-fill"></div>
            </div>
            <span id="meteor-countdown"></span>
        </div>
    `;
    
    // Stil hinzufügen
    banner.style.position = 'fixed';
    banner.style.top = '80px';
    banner.style.right = '20px';
    banner.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
    banner.style.borderRadius = '8px';
    banner.style.padding = '15px';
    banner.style.color = 'white';
    banner.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.5)';
    banner.style.zIndex = '1000';
    banner.style.maxWidth = '300px';
    banner.style.transition = 'transform 0.3s ease-in-out';
    banner.style.transform = 'translateX(120%)';
    
    // Header-Stil
    const header = banner.querySelector('.banner-header');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '10px';
    header.style.marginBottom = '10px';
    header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
    header.style.paddingBottom = '5px';
    
    // Icon-Stil
    const icon = banner.querySelector('i');
    icon.style.fontSize = '1.5rem';
    icon.style.color = '#f1c40f';
    
    // Timer-Stil
    const timer = banner.querySelector('.event-timer');
    timer.style.width = '100%';
    timer.style.height = '4px';
    timer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    timer.style.borderRadius = '2px';
    timer.style.marginTop = '10px';
    timer.style.marginBottom = '5px';
    timer.style.overflow = 'hidden';
    
    const timerFill = banner.querySelector('.timer-fill');
    timerFill.style.width = '100%';
    timerFill.style.height = '100%';
    timerFill.style.backgroundColor = 'white';
    timerFill.style.borderRadius = '2px';
    timerFill.style.animation = `countdown-timer ${gameState.meteorShower.duration / 1000}s linear forwards`;
    
    // Animation hinzufügen
    const style = document.createElement('style');
    style.textContent = `
    @keyframes countdown-timer {
        0% { width: 100%; }
        100% { width: 0; }
    }
    `;
    document.head.appendChild(style);
    
    // Zum Dokument hinzufügen
    document.body.appendChild(banner);
    
    // Animation starten
    setTimeout(() => {
        banner.style.transform = 'translateX(0)';
    }, 100);
    
    // Countdown aktualisieren
    const countdownEl = document.getElementById('meteor-countdown');
    
    function updateCountdown() {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        
        if (timeLeft <= 0) {
            countdownEl.textContent = 'Endet gleich...';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Initialen Countdown anzeigen
    updateCountdown();
    
    // Countdown-Interval erstellen
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Interval stoppen, wenn das Event endet
    setTimeout(() => {
        clearInterval(countdownInterval);
    }, gameState.meteorShower.duration);
}

function activateMeteorShowerEffects() {
    // Füge Meteoriten-Animation zum Spielfeld hinzu
    createMeteorAnimation();
    
    // Original-Click-Handler temporär speichern, falls noch nicht geschehen
    if (!window.originalClickHandler) {
        window.originalClickHandler = mainClickerBtn.onclick;
    }
    
    // Event Handler ersetzen für erhöhten Klick-Wert
    mainClickerBtn.onclick = function(e) {
        // Normalen Klick ausführen
        addResourcesFromClick(e);
        
        // Zusätzlichen Bonus für das Event hinzufügen (doppelter Klickwert)
        gameState.resources += getEffectiveClickValue() * (gameState.meteorShower.clickBonus - 1);
        
        // Increment meteor clicks for stats
        gameState.meteorShower.meteorClicks++;
        
        // Show sparkle animation
        if (e && e.clientX && e.clientY) {
            showMeteorSparkle(e.clientX, e.clientY);
        }
        
        // Update UI
        resourceCountEl.textContent = formatNumber(Math.floor(gameState.resources));
    };
}

function createMeteorAnimation() {
    // Container für Meteore erstellen
    const meteorContainer = document.createElement('div');
    meteorContainer.id = 'meteor-container';
    meteorContainer.style.position = 'fixed';
    meteorContainer.style.top = '0';
    meteorContainer.style.left = '0';
    meteorContainer.style.width = '100%';
    meteorContainer.style.height = '100%';
    meteorContainer.style.pointerEvents = 'none';
    meteorContainer.style.zIndex = '50';
    meteorContainer.style.overflow = 'hidden';
    
    document.body.appendChild(meteorContainer);
    
    // Meteor-Animation CSS
    const meteorStyle = document.createElement('style');
    meteorStyle.textContent = `
    @keyframes meteor-fall {
        0% {
            transform: translate(0, -50px) rotate(45deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(250px, 120vh) rotate(45deg);
            opacity: 0;
        }
    }
    
    .meteor {
        position: absolute;
        width: 4px;
        height: 30px;
        background: linear-gradient(to top, rgba(255,255,255,0), #f1c40f 30%, #e74c3c);
        border-radius: 2px;
        box-shadow: 0 0 10px #f1c40f;
        transform-origin: center center;
        z-index: 60;
    }
    `;
    document.head.appendChild(meteorStyle);
    
    // Funktion um Meteore zu erzeugen
    function createMeteor() {
        if (!document.getElementById('meteor-container')) return;
        
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Zufällige Position
        const startX = Math.random() * window.innerWidth;
        
        // Zufällige Geschwindigkeit
        const duration = 2 + Math.random() * 3;
        
        // Stil und Animation
        meteor.style.left = `${startX}px`;
        meteor.style.top = '-30px';
        meteor.style.animation = `meteor-fall ${duration}s linear`;
        
        // Zum Container hinzufügen
        document.getElementById('meteor-container').appendChild(meteor);
        
        // Nach Animation entfernen
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.parentNode.removeChild(meteor);
            }
        }, duration * 1000);
    }
    
    // Starte Meteor-Erzeugung
    const meteorInterval = setInterval(createMeteor, 800);
    
    // Speichere Interval-ID, um es später zu beenden
    window.meteorIntervalId = meteorInterval;
}

function showMeteorSparkle(x, y) {
    // Erstelle Funkeln-Element
    const sparkle = document.createElement('div');
    sparkle.className = 'meteor-sparkle';
    
    // Position
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.transform = 'translate(-50%, -50%)';
    sparkle.style.pointerEvents = 'none';
    
    // Aussehen
    sparkle.style.width = '30px';
    sparkle.style.height = '30px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = 'radial-gradient(circle, rgba(241,196,15,0.8) 0%, rgba(241,196,15,0) 70%)';
    sparkle.style.boxShadow = '0 0 20px rgba(241,196,15,0.8)';
    sparkle.style.zIndex = '70';
    
    // Animation
    sparkle.style.animation = 'meteor-sparkle 0.6s forwards';
    
    // Animation CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
    @keyframes meteor-sparkle {
        0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
        }
    }`;
    document.head.appendChild(sparkleStyle);
    
    // Zum Dokument hinzufügen
    document.body.appendChild(sparkle);
    
    // Nach Animation entfernen
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 600);
}

function endMeteorShowerEvent() {
    // Event als inaktiv markieren
    gameState.meteorShower.active = false;
    
    // Originalen Click-Handler wiederherstellen
    if (window.originalClickHandler) {
        mainClickerBtn.onclick = window.originalClickHandler;
        window.originalClickHandler = null;
    }
    
    // Meteor-Animationen beenden
    clearInterval(window.meteorIntervalId);
    window.meteorIntervalId = null;
    
    // Meteor-Container entfernen
    const meteorContainer = document.getElementById('meteor-container');
    if (meteorContainer) {
        meteorContainer.remove();
    }
    
    // Event-Banner entfernen
    const banner = document.getElementById('meteor-shower-banner');
    if (banner) {
        banner.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 300);
    }
    
    // Zeige Zusammenfassung des Events
    showMeteorSummary();
}

function showMeteorSummary() {
    // Berechne Statistiken
    const meteorClicks = gameState.meteorShower.meteorClicks;
    const clickBonus = Math.floor(getEffectiveClickValue() * (gameState.meteorShower.clickBonus - 1) * meteorClicks);
    
    // Erstelle Zusammenfassungs-Modal
    const summaryModal = document.createElement('div');
    summaryModal.id = 'meteor-summary-modal';
    summaryModal.className = 'modal';
    summaryModal.style.display = 'flex';
    summaryModal.style.position = 'fixed';
    summaryModal.style.zIndex = '1001';
    summaryModal.style.left = '0';
    summaryModal.style.top = '0';
    summaryModal.style.width = '100%';
    summaryModal.style.height = '100%';
    summaryModal.style.overflow = 'auto';
    summaryModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    summaryModal.style.justifyContent = 'center';
    summaryModal.style.alignItems = 'center';
    
    // Modal-Inhalt
    summaryModal.innerHTML = `
        <div class="modal-content" style="background-color: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: center; max-width: 500px; width: 90%;">
            <h2><i class="fas fa-meteor"></i> Meteoritenschauer beendet!</h2>
            <div class="summary-content" style="margin: 20px 0;">
                <p><i class="fas fa-hand-pointer"></i> Meteoritenklicks: ${meteorClicks}</p>
                <p><i class="fas fa-star"></i> Extra Sterne erhalten: ${formatNumber(clickBonus)}</p>
            </div>
            <button id="close-meteor-summary" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Schließen
            </button>
        </div>
    `;
    
    // Zum Dokument hinzufügen
    document.body.appendChild(summaryModal);
    
    // Close-Button Event
    document.getElementById('close-meteor-summary').addEventListener('click', () => {
        document.getElementById('meteor-summary-modal').remove();
    });
}

// Event Listeners
mainClickerBtn.removeEventListener('click', addResourcesFromClick);
mainClickerBtn.addEventListener('click', addResourcesFromClick);

clickUpgradeBtn.addEventListener('click', buyClickUpgrade);
clickMultiplierBtn.addEventListener('click', buyClickMultiplier);
autoClickerBtn.addEventListener('click', buyAutoClicker);
boosterBtn.addEventListener('click', buyBooster);
factoryBtn.addEventListener('click', buyFactory);
galaxyBtn.addEventListener('click', buyGalaxy);
wormholeBtn.addEventListener('click', buyWormhole);

// Cosmic upgrade buttons
cosmicClickBtn.addEventListener('click', buyCosmicClickPower);
cosmicProductionBtn.addEventListener('click', buyCosmicProductionBoost);
cosmicStartBtn.addEventListener('click', buyCosmicStartingStars);
cosmicLuckBtn.addEventListener('click', buyCosmicLuck);

// Ascension buttons
ascendBtn.addEventListener('click', openAscensionModal);
cancelAscendBtn.addEventListener('click', closeAscensionModal);
confirmAscendBtn.addEventListener('click', ascend);

// Add special effects to the clicker button
document.addEventListener('DOMContentLoaded', function() {
    // Make sure the sun icon pulses
    const sunIcon = mainClickerBtn.querySelector('.fa-sun');
    if (sunIcon) {
        // Apply additional animation effects if needed
        sunIcon.style.animation = 'pulse 2s infinite alternate';
    }
});

// Achievement Modal functions
function openAchievementsModal() {
    achievementsModal.classList.add('show');
}

function closeAchievementsModal() {
    achievementsModal.classList.remove('show');
}

// Add event listeners for achievement modal
achievementsBtn.addEventListener('click', openAchievementsModal);
closeAchievementsBtn.addEventListener('click', closeAchievementsModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === achievementsModal) {
        closeAchievementsModal();
    }
});

// Initialize game
window.onload = function() {
    loadGameState();
    
    // Initialisiere Space Chest, falls noch keine geplant ist
    if (!gameState.spaceChest.nextAppearance || gameState.spaceChest.nextAppearance < Date.now()) {
        scheduleNextSpaceChest();
    }
    
    // Game loop - update resources and UI every 100ms
    setInterval(() => {
        addResourcesPerSecond();
        updateUI();
        checkSpaceChest(); // Prüfe, ob eine Space Chest erscheinen soll
        checkDailyReward(); // Prüfe, ob eine tägliche Belohnung verfügbar ist
        checkMeteorShowerEvent(); // Prüfe, ob ein Meteoritenschauer gestartet werden soll
    }, 100);
    
    // Save game every 30 seconds
    setInterval(saveGameState, 30000);
};

// Event listener for saving game when tab/window is closed
window.addEventListener('beforeunload', saveGameState);

// Daily Reward Functions
// Prüft, ob eine tägliche Belohnung verfügbar ist
function checkDailyReward() {
    const today = new Date().toDateString();
    const lastClaim = gameState.dailyReward.lastClaimDate;
    
    // Wenn noch nie eine Belohnung abgeholt wurde oder es ein neuer Tag ist
    if (!lastClaim || today !== new Date(lastClaim).toDateString()) {
        gameState.dailyReward.available = true;
        showDailyRewardButton();
    } else {
        gameState.dailyReward.available = false;
        hideDailyRewardButton();
    }
}

// Belohnungsbutton anzeigen
function showDailyRewardButton() {
    // Entferne alten Button falls vorhanden
    const existingButton = document.getElementById('daily-reward-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Erstelle neuen Button
    const rewardButton = document.createElement('button');
    rewardButton.id = 'daily-reward-btn';
    rewardButton.innerHTML = '<i class="fas fa-calendar-day"></i> Tägliche Belohnung!';
    
    // Styling
    rewardButton.style.position = 'fixed';
    rewardButton.style.top = '20px';
    rewardButton.style.right = '20px';
    rewardButton.style.backgroundColor = '#e74c3c';
    rewardButton.style.color = 'white';
    rewardButton.style.border = 'none';
    rewardButton.style.borderRadius = '8px';
    rewardButton.style.padding = '10px 15px';
    rewardButton.style.fontWeight = 'bold';
    rewardButton.style.cursor = 'pointer';
    rewardButton.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.7)';
    rewardButton.style.animation = 'pulse-daily 2s infinite';
    rewardButton.style.zIndex = '1000';
    
    // Animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes pulse-daily {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }`;
    document.head.appendChild(style);
    
    // Event listener
    rewardButton.addEventListener('click', claimDailyReward);
    
    // Zum Dokument hinzufügen
    document.body.appendChild(rewardButton);
}

// Belohnungsbutton verstecken
function hideDailyRewardButton() {
    const button = document.getElementById('daily-reward-btn');
    if (button) {
        button.remove();
    }
}

// Belohnung abholen
function claimDailyReward() {
    if (!gameState.dailyReward.available) return;
    
    // Streak aktualisieren
    const today = new Date().toDateString();
    const lastClaim = gameState.dailyReward.lastClaimDate;
    
    // Wenn gestrige Belohnung nicht abgeholt wurde, Streak zurücksetzen
    if (lastClaim) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (new Date(lastClaim).toDateString() !== yesterdayString && 
            new Date(lastClaim).toDateString() !== today) {
            gameState.dailyReward.streak = 0;
        }
    }
    
    // Streak erhöhen
    gameState.dailyReward.streak += 1;
    
    // Max Streak aktualisieren
    if (gameState.dailyReward.streak > gameState.dailyReward.maxStreak) {
        gameState.dailyReward.maxStreak = gameState.dailyReward.streak;
    }
    
    // Datum der letzten Belohnung speichern
    gameState.dailyReward.lastClaimDate = new Date().toString();
    gameState.dailyReward.available = false;
    
    // Belohnung basierend auf Streak bestimmen
    let reward;
    
    // Je länger die Streak, desto besser die Belohnung
    switch(true) {
        case gameState.dailyReward.streak >= 30:
            // 30+ Tage: Sterne entsprechend 1 Stunde Produktion + 3-5 Cosmic Dust
            reward = {
                stars: Math.max(1000, Math.floor(gameState.resourcesPerSecond * 3600)),
                cosmicDust: 3 + Math.floor(Math.random() * 3)
            };
            break;
        case gameState.dailyReward.streak >= 14:
            // 14-29 Tage: Sterne entsprechend 30 Minuten Produktion + 1-2 Cosmic Dust
            reward = {
                stars: Math.max(500, Math.floor(gameState.resourcesPerSecond * 1800)),
                cosmicDust: 1 + Math.floor(Math.random() * 2)
            };
            break;
        case gameState.dailyReward.streak >= 7:
            // 7-13 Tage: Sterne entsprechend 15 Minuten Produktion + evtl. Cosmic Dust
            reward = {
                stars: Math.max(250, Math.floor(gameState.resourcesPerSecond * 900)),
                cosmicDust: Math.random() < 0.5 ? 1 : 0
            };
            break;
        case gameState.dailyReward.streak >= 3:
            // 3-6 Tage: Sterne entsprechend 5 Minuten Produktion
            reward = {
                stars: Math.max(100, Math.floor(gameState.resourcesPerSecond * 300)),
                cosmicDust: 0
            };
            break;
        default:
            // 1-2 Tage: Sterne entsprechend 2 Minuten Produktion
            reward = {
                stars: Math.max(50, Math.floor(gameState.resourcesPerSecond * 120)),
                cosmicDust: 0
            };
    }
    
    // Belohnungen anwenden
    gameState.resources += reward.stars;
    gameState.cosmicDust += reward.cosmicDust;
    
    // Belohnung anzeigen
    showDailyRewardModal(reward, gameState.dailyReward.streak);
    
    // UI aktualisieren und Button verstecken
    updateUI();
    updateCosmicUI();
    hideDailyRewardButton();
    
    // Spielstand speichern
    saveGameState();
}

// Belohnungsmodal anzeigen
function showDailyRewardModal(reward, streak) {
    // Modal erstellen
    const modalContainer = document.createElement('div');
    modalContainer.id = 'daily-reward-modal';
    modalContainer.className = 'modal';
    modalContainer.style.display = 'flex';
    modalContainer.style.position = 'fixed';
    modalContainer.style.zIndex = '1001';
    modalContainer.style.left = '0';
    modalContainer.style.top = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.overflow = 'auto';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    
    // Modal Content
    let rewardText = `<i class="fas fa-star"></i> ${formatNumber(reward.stars)} Sterne`;
    if (reward.cosmicDust > 0) {
        rewardText += `<br><i class="fas fa-superpowers"></i> ${reward.cosmicDust} Cosmic Dust`;
    }
    
    let streakClass = 'normal-streak';
    if (streak >= 30) streakClass = 'epic-streak';
    else if (streak >= 14) streakClass = 'great-streak';
    else if (streak >= 7) streakClass = 'good-streak';
    
    modalContainer.innerHTML = `
        <div class="modal-content" style="background-color: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: center; max-width: 500px; width: 90%;">
            <h2><i class="fas fa-calendar-check"></i> Tägliche Belohnung</h2>
            <div class="${streakClass}" style="margin: 20px 0; font-size: 18px;">
                <i class="fas fa-fire"></i> Streak: ${streak} ${streak > 1 ? 'Tage' : 'Tag'}
            </div>
            <div class="reward-display" style="font-size: 24px; margin: 20px 0;">
                ${rewardText}
            </div>
            <div class="streak-info" style="margin: 15px 0; font-size: 14px; opacity: 0.8;">
                Komm morgen wieder, um deine Streak fortzusetzen!
            </div>
            <button id="close-daily-reward" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Annehmen
            </button>
        </div>
    `;
    
    // CSS für Streaks
    const style = document.createElement('style');
    style.textContent = `
        .normal-streak { color: #3498db; }
        .good-streak { color: #2ecc71; }
        .great-streak { color: #f39c12; }
        .epic-streak { color: #e74c3c; text-shadow: 0 0 10px rgba(231, 76, 60, 0.7); }
    `;
    document.head.appendChild(style);
    
    // Zum Dokument hinzufügen
    document.body.appendChild(modalContainer);
    
    // Close-Button Event
    document.getElementById('close-daily-reward').addEventListener('click', () => {
        document.getElementById('daily-reward-modal').remove();
    });
}
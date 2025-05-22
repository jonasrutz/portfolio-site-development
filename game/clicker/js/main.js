/**
 * Cosmic Clicker - Main Game Module
 * Initializes and connects all game components
 */

import GameState from './models/gameState.js';
import UI from './utils/ui.js';
import SoundManager from './utils/sound.js';
import StorageUtils from './utils/storage.js';

// Main game class
const Game = {
  // Auto-save interval ID
  autoSaveInterval: null,
  isInitialized: false,
  
  // Initialize the game
  init() {
    try {
      console.log('Initializing Cosmic Clicker...');
      
      // If game already initialized, abort
      if (this.isInitialized) {
        console.warn('Game already initialized.');
        return;
      }
      
      // Check storage availability
      if (!StorageUtils.isStorageAvailable('localStorage')) {
        console.warn('Storage could not be initialized. Some features may be limited.');
      }
      
      // Load existing game state
      this.loadGameState();
      
      // Initialize all subsystems 
      this.initSubsystems();
      
      // Set up click handlers and event listeners
      this.setupEventListeners();
      
      // Start auto-save functionality
      this.startAutoSave();
      
      // Update UI with initial values
      this.updateUI();
      
      this.isInitialized = true;
      console.log('Cosmic Clicker successfully initialized!');
    } catch (error) {
      console.error('Fatal error during game initialization:', error);
      alert('An error occurred during game initialization. Please refresh the page.');
    }
  },
  
  loadGameState() {
    // Load game from localStorage
    const savedGame = localStorage.getItem('cosmicClickerSave');
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        
        // Set initial game state from saved data
        this.gameState = {
          stars: gameData.stars || 0,
          totalStars: gameData.totalStars || 0,
          clicks: gameData.clicks || 0,
          starsPerClick: gameData.starsPerClick || 1,
          starsPerSecond: gameData.starsPerSecond || 0,
          clickMultiplier: gameData.clickMultiplier || 1,
          cosmicDust: gameData.cosmicDust || 0,
          ascensionCount: gameData.ascensionCount || 0,
          upgrades: gameData.upgrades || {
            clickUpgrade: 1,
            clickMultiplier: 1,
            autoClicker: 0,
            starBooster: 0,
            starFactory: 0,
            starGalaxy: 0,
            starWormhole: 0
          },
          cosmicUpgrades: gameData.cosmicUpgrades || {
            cosmicClick: 0,
            cosmicProduction: 0,
            cosmicStart: 0,
            cosmicLuck: 0
          },
          achievements: gameData.achievements || [],
          unlockedSkins: gameData.unlockedSkins || ["default"],
          activeSkin: gameData.activeSkin || "default",
          playerTitle: gameData.playerTitle || "Star Collector"
        };
        
        console.log('Game state loaded successfully');
      } catch (error) {
        console.error('Error loading saved game:', error);
        this.initializeNewGame();
      }
    } else {
      this.initializeNewGame();
    }
  },
  
  initializeNewGame() {
    // Set default values for a new game
    this.gameState = {
      stars: 0,
      totalStars: 0,
      clicks: 0,
      starsPerClick: 1,
      starsPerSecond: 0,
      clickMultiplier: 1,
      cosmicDust: 0,
      ascensionCount: 0,
      upgrades: {
        clickUpgrade: 1,
        clickMultiplier: 1,
        autoClicker: 0,
        starBooster: 0,
        starFactory: 0,
        starGalaxy: 0,
        starWormhole: 0
      },
      cosmicUpgrades: {
        cosmicClick: 0,
        cosmicProduction: 0,
        cosmicStart: 0,
        cosmicLuck: 0
      },
      achievements: [],
      unlockedSkins: ["default"],
      activeSkin: "default",
      playerTitle: "Star Collector"
    };
    
    console.log('New game initialized');
  },
  
  initSubsystems() {
    try { 
      // Initialize sound system if available
      if (SoundManager && typeof SoundManager.init === 'function') {
        SoundManager.init();
      }
    } catch (e) { 
      console.error('Error initializing Sound Manager:', e); 
    }
  },
  
  setupEventListeners() {
    // Main clicker button
    const mainClicker = document.getElementById('main-clicker');
    if (mainClicker) {
      mainClicker.addEventListener('click', () => {
        this.processClick();
      });
    }
    
    // Upgrade buttons
    const upgradeBtns = document.querySelectorAll('.buy-btn');
    upgradeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const upgradeId = e.target.closest('.upgrade').id;
        this.buyUpgrade(upgradeId);
      });
    });
    
    // Ascension button
    const ascendButton = document.getElementById('ascend-button');
    if (ascendButton) {
      ascendButton.addEventListener('click', () => {
        this.showAscensionModal();
      });
    }
    
    // Ascension modal buttons
    const confirmAscend = document.getElementById('confirm-ascend');
    const cancelAscend = document.getElementById('cancel-ascend');
    
    if (confirmAscend) {
      confirmAscend.addEventListener('click', () => {
        this.processAscension();
        this.hideModal('ascension-modal');
      });
    }
    
    if (cancelAscend) {
      cancelAscend.addEventListener('click', () => {
        this.hideModal('ascension-modal');
      });
    }
    
    // Achievements button
    const achievementsBtn = document.getElementById('achievements-btn');
    const closeAchievements = document.getElementById('close-achievements');
    
    if (achievementsBtn) {
      achievementsBtn.addEventListener('click', () => {
        this.showModal('achievements-modal');
      });
    }
    
    if (closeAchievements) {
      closeAchievements.addEventListener('click', () => {
        this.hideModal('achievements-modal');
      });
    }
    
    // Theme selection
    const changeSkinBtn = document.getElementById('change-skin-btn');
    const closeSkins = document.getElementById('close-skins');
    
    if (changeSkinBtn) {
      changeSkinBtn.addEventListener('click', () => {
        this.showModal('skin-selection-modal');
      });
    }
    
    if (closeSkins) {
      closeSkins.addEventListener('click', () => {
        this.hideModal('skin-selection-modal');
      });
    }
    
    // Skin selection event delegation
    const skinsContainer = document.querySelector('.skins-container');
    if (skinsContainer) {
      skinsContainer.addEventListener('click', (e) => {
        const skinOption = e.target.closest('.skin-option');
        if (skinOption && !skinOption.classList.contains('locked')) {
          const skinName = skinOption.dataset.skin;
          this.changeSkin(skinName);
        }
      });
    }
    
    // Title selection event delegation
    const titlesContainer = document.querySelector('.titles-container');
    if (titlesContainer) {
      titlesContainer.addEventListener('click', (e) => {
        const titleOption = e.target.closest('.title-option');
        if (titleOption && !titleOption.classList.contains('locked')) {
          const titleName = titleOption.dataset.title;
          this.changeTitle(titleName);
        }
      });
    }
    
    // Customize galaxy button
    const customizeGalaxyBtn = document.getElementById('customize-galaxy-btn');
    const closeCustomizeBtn = document.getElementById('close-customize-btn');
    
    if (customizeGalaxyBtn) {
      customizeGalaxyBtn.addEventListener('click', () => {
        this.showModal('customize-galaxy-modal');
      });
    }
    
    if (closeCustomizeBtn) {
      closeCustomizeBtn.addEventListener('click', () => {
        this.hideModal('customize-galaxy-modal');
      });
    }
    
    // Customize tabs
    const customizeTabs = document.querySelectorAll('.customize-tab-btn');
    customizeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchCustomizeTab(tabName);
      });
    });
    
    // Save game state before user leaves page
    window.addEventListener('beforeunload', () => {
      this.saveGame();
    });
  },
  
  processClick() {
    // Calculate stars earned from this click
    let starsEarned = this.gameState.starsPerClick * this.gameState.clickMultiplier;
    
    // Apply cosmic click bonus if any
    if (this.gameState.cosmicUpgrades.cosmicClick > 0) {
      starsEarned *= (1 + this.gameState.cosmicUpgrades.cosmicClick * 0.05);
    }
    
    // Check for lucky stars if cosmic luck upgrade is active
    if (this.gameState.cosmicUpgrades.cosmicLuck > 0) {
      const luckChance = this.gameState.cosmicUpgrades.cosmicLuck * 0.01;
      if (Math.random() < luckChance) {
        starsEarned *= 2;
        // Show lucky star visual feedback
        this.showLuckyStarEffect();
      }
    }
    
    // Update game state
    this.gameState.stars += starsEarned;
    this.gameState.totalStars += starsEarned;
    this.gameState.clicks += 1;
    
    // Update UI
    this.updateResourceDisplays();
    this.showClickValue(starsEarned);
    
    // Check for click-based achievements
    this.checkClickAchievements();
    
    // Check if ascension is available
    this.checkAscensionAvailability();
  },
  
  showClickValue(value) {
    // Display the value added from click
    const clickValue = document.getElementById('click-value');
    if (clickValue) {
      clickValue.textContent = Math.floor(value);
    }
  },
  
  showLuckyStarEffect() {
    // Visual effect for lucky stars (could be animated in CSS)
    const clickArea = document.querySelector('.clicker-area');
    const luckyStarEffect = document.createElement('div');
    luckyStarEffect.className = 'lucky-star-effect';
    luckyStarEffect.textContent = 'Lucky Star! x2';
    
    clickArea.appendChild(luckyStarEffect);
    
    // Remove effect after animation
    setTimeout(() => {
      luckyStarEffect.remove();
    }, 2000);
  },
  
  buyUpgrade(upgradeId) {
    // Handle regular upgrades
    switch(upgradeId) {
      case 'click-upgrade':
        this.purchaseUpgrade('clickUpgrade', 'click-level', 'click-cost', 10 * Math.pow(1.1, this.gameState.upgrades.clickUpgrade - 1), 1);
        break;
      case 'click-multiplier':
        this.purchaseUpgrade('clickMultiplier', 'multiplier-level', 'multiplier-cost', 100 * Math.pow(1.15, this.gameState.upgrades.clickMultiplier - 1), 1);
        break;
      case 'auto-clicker':
        this.purchaseUpgrade('autoClicker', 'auto-level', 'auto-cost', 50 * Math.pow(1.1, this.gameState.upgrades.autoClicker), 0);
        break;
      case 'star-booster':
        this.purchaseUpgrade('starBooster', 'booster-level', 'booster-cost', 200 * Math.pow(1.1, this.gameState.upgrades.starBooster), 0);
        break;
      case 'star-factory':
        this.purchaseUpgrade('starFactory', 'factory-level', 'factory-cost', 1000 * Math.pow(1.1, this.gameState.upgrades.starFactory), 0);
        break;
      case 'star-galaxy':
        this.purchaseUpgrade('starGalaxy', 'galaxy-level', 'galaxy-cost', 5000 * Math.pow(1.1, this.gameState.upgrades.starGalaxy), 0);
        break;
      case 'star-wormhole':
        this.purchaseUpgrade('starWormhole', 'wormhole-level', 'wormhole-cost', 20000 * Math.pow(1.1, this.gameState.upgrades.starWormhole), 0);
        break;
      
      // Handle cosmic upgrades
      case 'cosmic-click':
        this.purchaseCosmicUpgrade('cosmicClick', 'cosmic-click-level', 'cosmic-click-cost', 1 + this.gameState.cosmicUpgrades.cosmicClick);
        break;
      case 'cosmic-production':
        this.purchaseCosmicUpgrade('cosmicProduction', 'cosmic-production-level', 'cosmic-production-cost', 1 + this.gameState.cosmicUpgrades.cosmicProduction);
        break;
      case 'cosmic-start':
        this.purchaseCosmicUpgrade('cosmicStart', 'cosmic-start-level', 'cosmic-start-cost', 2 + this.gameState.cosmicUpgrades.cosmicStart);
        break;
      case 'cosmic-luck':
        this.purchaseCosmicUpgrade('cosmicLuck', 'cosmic-luck-level', 'cosmic-luck-cost', 3 + this.gameState.cosmicUpgrades.cosmicLuck);
        break;
    }
    
    // Check for upgrade-related achievements
    this.checkUpgradeAchievements();
    
    // Save game after purchase
    this.saveGame();
  },
  
  purchaseUpgrade(upgradeKey, levelElementId, costElementId, baseCost, startingLevel = 0) {
    const cost = Math.floor(baseCost);
    
    if (this.gameState.stars >= cost) {
      this.gameState.stars -= cost;
      this.gameState.upgrades[upgradeKey] += 1;
      
      // Update the UI
      document.getElementById(levelElementId).textContent = this.gameState.upgrades[upgradeKey];
      
      // Calculate new cost
      const newCost = this.calculateUpgradeCost(upgradeKey, baseCost);
      document.getElementById(costElementId).textContent = Math.floor(newCost);
      
      // Update game effects
      this.updateGameEffects();
    }
  },
  
  purchaseCosmicUpgrade(upgradeKey, levelElementId, costElementId, cost) {
    if (this.gameState.cosmicDust >= cost) {
      this.gameState.cosmicDust -= cost;
      this.gameState.cosmicUpgrades[upgradeKey] += 1;
      
      // Update the UI
      document.getElementById(levelElementId).textContent = 
        upgradeKey === 'cosmicStart' 
          ? this.gameState.cosmicUpgrades[upgradeKey] * 1000 
          : this.gameState.cosmicUpgrades[upgradeKey] * 5;
      
      // Update cost
      document.getElementById(costElementId).textContent = cost + 1;
      
      // Update cosmic dust display
      document.getElementById('cosmic-dust').textContent = this.gameState.cosmicDust;
      
      // Update game effects
      this.updateGameEffects();
    }
  },
  
  calculateUpgradeCost(upgradeKey, baseCost) {
    const level = this.gameState.upgrades[upgradeKey];
    switch(upgradeKey) {
      case 'clickUpgrade':
        return 10 * Math.pow(1.1, level);
      case 'clickMultiplier':
        return 100 * Math.pow(1.15, level);
      case 'autoClicker':
        return 50 * Math.pow(1.1, level);
      case 'starBooster':
        return 200 * Math.pow(1.1, level);
      case 'starFactory':
        return 1000 * Math.pow(1.1, level);
      case 'starGalaxy':
        return 5000 * Math.pow(1.1, level);
      case 'starWormhole':
        return 20000 * Math.pow(1.1, level);
      default:
        return baseCost;
    }
  },
  
  updateGameEffects() {
    // Update stars per click
    this.gameState.starsPerClick = this.gameState.upgrades.clickUpgrade;
    
    // Update click multiplier
    this.gameState.clickMultiplier = this.gameState.upgrades.clickMultiplier;
    
    // Calculate stars per second from auto producers
    this.gameState.starsPerSecond = 
      this.gameState.upgrades.autoClicker * 0.1 +
      this.gameState.upgrades.starBooster * 1 +
      this.gameState.upgrades.starFactory * 5 +
      this.gameState.upgrades.starGalaxy * 50 +
      this.gameState.upgrades.starWormhole * 200;
    
    // Apply cosmic production bonus if any
    if (this.gameState.cosmicUpgrades.cosmicProduction > 0) {
      this.gameState.starsPerSecond *= (1 + this.gameState.cosmicUpgrades.cosmicProduction * 0.05);
    }
    
    // Update UI displays
    this.updateResourceDisplays();
  },
  
  updateResourceDisplays() {
    // Update star count
    const resourceCount = document.getElementById('resource-count');
    if (resourceCount) {
      resourceCount.textContent = Math.floor(this.gameState.stars);
    }
    
    // Update stars per second
    const perSecond = document.getElementById('per-second');
    if (perSecond) {
      perSecond.textContent = this.gameState.starsPerSecond.toFixed(1);
    }
    
    // Update click stats
    const clickStats = document.getElementById('click-stats');
    if (clickStats) {
      clickStats.textContent = this.gameState.clicks;
    }
    
    // Update cosmic dust
    const cosmicDust = document.getElementById('cosmic-dust');
    if (cosmicDust) {
      cosmicDust.textContent = this.gameState.cosmicDust;
    }
    
    // Update click value display
    const clickValue = document.getElementById('click-value');
    if (clickValue) {
      const effectiveClickValue = this.gameState.starsPerClick * this.gameState.clickMultiplier;
      clickValue.textContent = Math.floor(effectiveClickValue);
    }
  },
  
  checkAscensionAvailability() {
    const ascendButton = document.getElementById('ascend-button');
    const ascendDustGain = document.getElementById('ascend-dust-gain');
    
    if (ascendButton && ascendDustGain) {
      // Calculate dust gain (1 dust per 10,000 stars)
      const potentialDust = Math.floor(this.gameState.stars / 10000);
      
      if (potentialDust > 0) {
        ascendButton.disabled = false;
        ascendDustGain.textContent = potentialDust;
      } else {
        ascendButton.disabled = true;
        ascendDustGain.textContent = 0;
      }
    }
  },
  
  showAscensionModal() {
    const modalDustGain = document.getElementById('modal-dust-gain');
    const potentialDust = Math.floor(this.gameState.stars / 10000);
    
    if (modalDustGain) {
      modalDustGain.textContent = potentialDust;
    }
    
    this.showModal('ascension-modal');
  },
  
  processAscension() {
    // Calculate dust to gain
    const dustToGain = Math.floor(this.gameState.stars / 10000);
    
    if (dustToGain > 0) {
      // Add dust to total
      this.gameState.cosmicDust += dustToGain;
      
      // Increment ascension count
      this.gameState.ascensionCount += 1;
      
      // Check if this is the first ascension to unlock cosmic theme
      if (this.gameState.ascensionCount === 1) {
        this.unlockSkin('cosmic');
      }
      
      // Check for additional theme unlocks
      if (this.gameState.ascensionCount === 3) {
        this.unlockSkin('galaxy');
      }
      
      if (this.gameState.ascensionCount === 5) {
        this.unlockSkin('nebula');
        this.unlockTitle('Cosmic Explorer');
      }
      
      if (this.gameState.ascensionCount === 10) {
        this.unlockSkin('blackhole');
        this.unlockTitle('Galaxy Master');
      }
      
      // Reset game state but keep cosmic upgrades and dust
      this.resetForAscension();
      
      // Check for ascension achievements
      this.checkAscensionAchievements();
      
      // Save game after ascension
      this.saveGame();
    }
  },
  
  resetForAscension() {
    // Keep cosmic upgrades and dust, reset everything else
    const cosmicDust = this.gameState.cosmicDust;
    const cosmicUpgrades = this.gameState.cosmicUpgrades;
    const ascensionCount = this.gameState.ascensionCount;
    const achievements = this.gameState.achievements;
    const unlockedSkins = this.gameState.unlockedSkins;
    const activeSkin = this.gameState.activeSkin;
    const playerTitle = this.gameState.playerTitle;
    
    // Reset game state
    this.initializeNewGame();
    
    // Restore cosmic values
    this.gameState.cosmicDust = cosmicDust;
    this.gameState.cosmicUpgrades = cosmicUpgrades;
    this.gameState.ascensionCount = ascensionCount;
    this.gameState.achievements = achievements;
    this.gameState.unlockedSkins = unlockedSkins;
    this.gameState.activeSkin = activeSkin;
    this.gameState.playerTitle = playerTitle;
    
    // Add starting stars if cosmic start upgrade is purchased
    if (this.gameState.cosmicUpgrades.cosmicStart > 0) {
      this.gameState.stars = this.gameState.cosmicUpgrades.cosmicStart * 1000;
    }
    
    // Update UI
    this.updateUI();
  },
  
  unlockSkin(skinName) {
    if (!this.gameState.unlockedSkins.includes(skinName)) {
      this.gameState.unlockedSkins.push(skinName);
      
      // Update skin UI
      const skinOption = document.querySelector(`.skin-option[data-skin="${skinName}"]`);
      if (skinOption) {
        skinOption.classList.remove('locked');
        skinOption.querySelector('.skin-status').textContent = 'Unlocked';
      }
    }
  },
  
  unlockTitle(titleName) {
    // Find title element and unlock it
    const titleOption = document.querySelector(`.title-option[data-title="${titleName}"]`);
    if (titleOption) {
      titleOption.classList.remove('locked');
    }
  },
  
  changeSkin(skinName) {
    if (this.gameState.unlockedSkins.includes(skinName)) {
      this.gameState.activeSkin = skinName;
      
      // Update active skin in UI
      document.querySelectorAll('.skin-option').forEach(skin => {
        const status = skin.querySelector('.skin-status');
        if (status) {
          status.textContent = skin.dataset.skin === skinName ? 'Active' : 'Unlocked';
        }
      });
      
      // Apply skin class to game container
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer) {
        // Remove all skin classes
        gameContainer.classList.remove('default-theme', 'cosmic-theme', 'galaxy-theme', 'nebula-theme', 'blackhole-theme');
        
        // Add active skin class
        gameContainer.classList.add(`${skinName}-theme`);
      }
      
      // Save game after skin change
      this.saveGame();
    }
  },
  
  changeTitle(titleName) {
    // Update player title
    this.gameState.playerTitle = titleName;
    
    // Update title in UI
    const playerTitleElement = document.getElementById('player-title');
    if (playerTitleElement) {
      playerTitleElement.textContent = titleName;
    }
    
    // Save game after title change
    this.saveGame();
  },
  
  switchCustomizeTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.customize-tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.customize-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Highlight selected tab button
    document.querySelector(`.customize-tab-btn[data-tab="${tabName}"]`).classList.add('active');
  },
  
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
    }
  },
  
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  },
  
  checkClickAchievements() {
    // Check for click-based achievements
    const clicks = this.gameState.clicks;
    
    if (clicks >= 10 && !this.hasAchievement('achievement-6')) {
      this.unlockAchievement('achievement-6');
    }
    
    if (clicks >= 100 && !this.hasAchievement('achievement-7')) {
      this.unlockAchievement('achievement-7');
    }
    
    if (clicks >= 1000 && !this.hasAchievement('achievement-8')) {
      this.unlockAchievement('achievement-8');
    }
    
    // Check star-based achievements
    const stars = this.gameState.stars;
    
    if (stars >= 100 && !this.hasAchievement('achievement-1')) {
      this.unlockAchievement('achievement-1');
    }
    
    if (stars >= 1000 && !this.hasAchievement('achievement-2')) {
      this.unlockAchievement('achievement-2');
    }
    
    if (stars >= 10000 && !this.hasAchievement('achievement-3')) {
      this.unlockAchievement('achievement-3');
    }
    
    if (stars >= 100000 && !this.hasAchievement('achievement-4')) {
      this.unlockAchievement('achievement-4');
    }
    
    if (stars >= 1000000 && !this.hasAchievement('achievement-5')) {
      this.unlockAchievement('achievement-5');
    }
    
    // Check stars per second achievement
    if (this.gameState.starsPerSecond >= 100 && !this.hasAchievement('achievement-12')) {
      this.unlockAchievement('achievement-12');
    }
  },
  
  checkUpgradeAchievements() {
    // Check for first upgrade achievement
    const totalUpgrades = Object.values(this.gameState.upgrades).reduce((sum, val) => sum + val, 0) - 2; // Subtract 2 because clickUpgrade and clickMultiplier start at 1
    
    if (totalUpgrades >= 1 && !this.hasAchievement('achievement-9')) {
      this.unlockAchievement('achievement-9');
    }
    
    if (totalUpgrades >= 5 && !this.hasAchievement('achievement-10')) {
      this.unlockAchievement('achievement-10');
    }
    
    // Check if player has at least one of each upgrade type
    if (
      this.gameState.upgrades.autoClicker > 0 &&
      this.gameState.upgrades.starBooster > 0 &&
      this.gameState.upgrades.starFactory > 0 &&
      this.gameState.upgrades.starGalaxy > 0 &&
      this.gameState.upgrades.starWormhole > 0 &&
      !this.hasAchievement('achievement-11')
    ) {
      this.unlockAchievement('achievement-11');
    }
  },
  
  checkAscensionAchievements() {
    // First ascension achievement
    if (this.gameState.ascensionCount >= 1 && !this.hasAchievement('achievement-13')) {
      this.unlockAchievement('achievement-13');
    }
    
    // Cosmic dust achievements
    if (this.gameState.cosmicDust >= 10 && !this.hasAchievement('achievement-14')) {
      this.unlockAchievement('achievement-14');
    }
    
    // Multiple ascensions achievement
    if (this.gameState.ascensionCount >= 5 && !this.hasAchievement('achievement-15')) {
      this.unlockAchievement('achievement-15');
    }
  },
  
  hasAchievement(achievementId) {
    return this.gameState.achievements.includes(achievementId);
  },
  
  unlockAchievement(achievementId) {
    if (!this.hasAchievement(achievementId)) {
      // Add to achieved list
      this.gameState.achievements.push(achievementId);
      
      // Update UI
      const achievement = document.getElementById(achievementId);
      if (achievement) {
        achievement.classList.remove('locked');
      }
      
      // Show notification
      this.showAchievementNotification(achievementId);
      
      // Save game
      this.saveGame();
    }
  },
  
  showAchievementNotification(achievementId) {
    // Get achievement data
    const achievement = document.getElementById(achievementId);
    if (!achievement) return;
    
    const title = achievement.querySelector('p').textContent;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <i class="fas fa-trophy"></i>
      <div>
        <h3>Achievement Unlocked!</h3>
        <p>${title}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show and then hide notification
    setTimeout(() => {
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }, 100);
  },
  
  startIdleProduction() {
    // Clear any existing interval
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
    }
    
    // Start new production interval - updating every 100ms for smooth progression
    this.idleInterval = setInterval(() => {
      const starsToAdd = this.gameState.starsPerSecond / 10; // Divide by 10 because we update 10 times per second
      
      if (starsToAdd > 0) {
        this.gameState.stars += starsToAdd;
        this.gameState.totalStars += starsToAdd;
        
        // Update UI every few ticks for performance
        if (Math.random() < 0.2) { // Update roughly every 0.5 seconds
          this.updateResourceDisplays();
          this.checkClickAchievements(); // Also check star-based achievements
          this.checkAscensionAvailability();
        }
      }
    }, 100);
  },
  
  startAutoSave() {
    // Auto-save every minute
    this.autoSaveInterval = setInterval(() => {
      this.saveGame();
    }, 60000);
    
    // Also save when tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveGame();
      }
    });
  },
  
  saveGame() {
    try {
      const gameData = JSON.stringify(this.gameState);
      localStorage.setItem('cosmicClickerSave', gameData);
      console.log('Game saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    }
  },
  
  updateUI() {
    // Update all resource displays
    this.updateResourceDisplays();
    
    // Update upgrade levels and costs
    Object.keys(this.gameState.upgrades).forEach(key => {
      let elementId, costId;
      switch(key) {
        case 'clickUpgrade':
          elementId = 'click-level';
          costId = 'click-cost';
          break;
        case 'clickMultiplier':
          elementId = 'multiplier-level';
          costId = 'multiplier-cost';
          break;
        case 'autoClicker':
          elementId = 'auto-level';
          costId = 'auto-cost';
          break;
        case 'starBooster':
          elementId = 'booster-level';
          costId = 'booster-cost';
          break;
        case 'starFactory':
          elementId = 'factory-level';
          costId = 'factory-cost';
          break;
        case 'starGalaxy':
          elementId = 'galaxy-level';
          costId = 'galaxy-cost';
          break;
        case 'starWormhole':
          elementId = 'wormhole-level';
          costId = 'wormhole-cost';
          break;
      }
      
      if (elementId && costId) {
        const element = document.getElementById(elementId);
        const costElement = document.getElementById(costId);
        
        if (element) {
          element.textContent = this.gameState.upgrades[key];
        }
        
        if (costElement) {
          const baseCost = this.calculateUpgradeCost(key, 0);
          costElement.textContent = Math.floor(baseCost);
        }
      }
    });
    
    // Update cosmic upgrade levels and costs
    Object.keys(this.gameState.cosmicUpgrades).forEach(key => {
      let elementId, costId;
      switch(key) {
        case 'cosmicClick':
          elementId = 'cosmic-click-level';
          costId = 'cosmic-click-cost';
          break;
        case 'cosmicProduction':
          elementId = 'cosmic-production-level';
          costId = 'cosmic-production-cost';
          break;
        case 'cosmicStart':
          elementId = 'cosmic-start-level';
          costId = 'cosmic-start-cost';
          break;
        case 'cosmicLuck':
          elementId = 'cosmic-luck-level';
          costId = 'cosmic-luck-cost';
          break;
      }
      
      if (elementId && costId) {
        const element = document.getElementById(elementId);
        const costElement = document.getElementById(costId);
        
        if (element) {
          // Format display based on upgrade type
          if (key === 'cosmicStart') {
            element.textContent = this.gameState.cosmicUpgrades[key] * 1000;
          } else {
            element.textContent = this.gameState.cosmicUpgrades[key] * 5;
          }
        }
        
        if (costElement) {
          costElement.textContent = 1 + this.gameState.cosmicUpgrades[key];
        }
      }
    });
    
    // Update active skin
    this.changeSkin(this.gameState.activeSkin);
    
    // Update player title
    const playerTitle = document.getElementById('player-title');
    if (playerTitle) {
      playerTitle.textContent = this.gameState.playerTitle;
    }
    
    // Update unlocked skins
    this.gameState.unlockedSkins.forEach(skin => {
      const skinOption = document.querySelector(`.skin-option[data-skin="${skin}"]`);
      if (skinOption) {
        skinOption.classList.remove('locked');
        skinOption.querySelector('.skin-status').textContent = 
          skin === this.gameState.activeSkin ? 'Active' : 'Unlocked';
      }
    });
    
    // Update achievements
    this.gameState.achievements.forEach(achievementId => {
      const achievement = document.getElementById(achievementId);
      if (achievement) {
        achievement.classList.remove('locked');
      }
    });
    
    // Check if ascension is available
    this.checkAscensionAvailability();
    
    // Set current date in footer
    const currentDate = document.getElementById('current-date');
    if (currentDate) {
      const date = new Date();
      currentDate.textContent = date.toLocaleDateString();
    }
  }
};

// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
  Game.startIdleProduction();
});

export default Game;

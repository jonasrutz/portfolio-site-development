/**
 * Statistik-System
 * Verwaltet die Anzeige von Spielerstatistiken
 */

import GameState from './models/gameState.js';

const StatsSystem = {
  statsTab: null,
  
  init() {
    this.statsTab = document.getElementById('stats-tab');
    
    // Event-Listener für Tab-Änderungen
    GameState.events.subscribe('tabChanged', ({ detail }) => {
      if (detail.tabId === 'stats-tab') {
        this.updateStats();
      }
    });
    
    // Aktualisieren bei Ressourcenänderungen
    GameState.events.subscribe(GameState.EVENT_TYPES.RESOURCES_UPDATED, () => {
      this.updateXPProgress();
    });
    
    // Aktualisieren bei Level-Ups
    GameState.events.subscribe(GameState.EVENT_TYPES.LEVEL_UP, () => {
      this.updateLevelDisplay();
      this.updateXPProgress();
    });
  },
  
  updateStats() {
    // Level-Anzeige aktualisieren
    this.updateLevelDisplay();
    
    // XP-Fortschrittsbalken aktualisieren
    this.updateXPProgress();
    
    // Statistikwerte aktualisieren
    document.getElementById('stat-clicks').textContent = this.formatNumber(GameState.stats.totalClicks);
    document.getElementById('stat-crafted').textContent = this.formatNumber(GameState.stats.itemsCrafted);
    document.getElementById('stat-upgrades').textContent = this.formatNumber(GameState.stats.upgradesPurchased);
    document.getElementById('stat-gold').textContent = this.formatNumber(GameState.stats.goldEarned);
    document.getElementById('stat-materials').textContent = this.formatNumber(GameState.stats.materialsGathered);
    document.getElementById('stat-xp').textContent = this.formatNumber(GameState.stats.experienceGained);
    
    // Idle-Produktion aktualisieren
    this.updateIdleProduction();
  },
  
  updateLevelDisplay() {
    const levelDisplay = document.getElementById('level-display-big');
    if (levelDisplay) {
      levelDisplay.textContent = GameState.level;
    }
  },
  
  updateXPProgress() {
    // XP für nächstes Level berechnen
    const xpRequired = GameState.level * 10;
    const currentXP = GameState.resources.experience;
    const progressPercent = Math.min(100, (currentXP / xpRequired) * 100);
    
    // Fortschrittsbalken aktualisieren
    const progressFill = document.getElementById('xp-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    
    // Text aktualisieren
    const progressText = document.getElementById('xp-progress-text');
    if (progressText) {
      progressText.textContent = `${currentXP} / ${xpRequired} XP`;
    }
  },
  
  updateIdleProduction() {
    const idleSection = document.getElementById('idle-production-section');
    if (!idleSection) {
      // Erstelle Abschnitt, falls er noch nicht existiert
      this.createIdleProductionSection();
      return;
    }
    
    // Berechne Idle-Raten
    const baseIdleRate = GameState.level * 0.1; 
    const idleMultiplier = GameState.upgrades.resourceGain.effect;
    const idleEfficiency = GameState.upgrades.idleEfficiency.effect;
    
    const goldPerMinute = Math.floor(baseIdleRate * idleMultiplier * idleEfficiency * 6);
    const materialsPerMinute = Math.floor(baseIdleRate * idleMultiplier * 0.5 * idleEfficiency * 6);
    
    // Aktualisiere Anzeige
    document.getElementById('idle-gold-rate').textContent = this.formatNumber(goldPerMinute);
    document.getElementById('idle-materials-rate').textContent = this.formatNumber(materialsPerMinute);
  },
  
  createIdleProductionSection() {
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) return;
    
    // Berechne Idle-Raten
    const baseIdleRate = GameState.level * 0.1; 
    const idleMultiplier = GameState.upgrades.resourceGain.effect;
    const idleEfficiency = GameState.upgrades.idleEfficiency.effect;
    
    const goldPerMinute = Math.floor(baseIdleRate * idleMultiplier * idleEfficiency * 6);
    const materialsPerMinute = Math.floor(baseIdleRate * idleMultiplier * 0.5 * idleEfficiency * 6);
    
    // Erstelle neuen Statistik-Abschnitt
    const idleSection = document.createElement('div');
    idleSection.className = 'stats-section';
    idleSection.id = 'idle-production-section';
    idleSection.innerHTML = `
      <h3>Automatische Produktion</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <i class="fas fa-coins"></i>
          <span class="stat-value" id="idle-gold-rate">${this.formatNumber(goldPerMinute)}</span>
          <span class="stat-label">Gold pro Minute</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-cubes"></i>
          <span class="stat-value" id="idle-materials-rate">${this.formatNumber(materialsPerMinute)}</span>
          <span class="stat-label">Materialien pro Minute</span>
        </div>
      </div>
    `;
    
    statsContainer.appendChild(idleSection);
  },
  
  formatNumber(num) {
    // Formatiert Zahlen für bessere Lesbarkeit (1000 → 1,000)
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export default StatsSystem;

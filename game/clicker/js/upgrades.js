/**
 * Upgrade-System
 * Verwaltet alle Verbesserungen im Spiel
 */

import GameState from './models/gameState.js';

const UpgradeSystem = {
  // Zentrales Element für Upgrades
  upgradesTab: null,
  
  // Initialisierung des Upgrade-Systems
  init() {
    this.upgradesTab = document.getElementById('upgrades-tab');
    
    // UI-Updates bei Ressourcenänderungen
    GameState.events.subscribe(GameState.EVENT_TYPES.RESOURCES_UPDATED, () => {
      this.updateUpgradeAvailability();
    });
    
    // UI-Updates nach Upgrade-Kauf
    GameState.events.subscribe(GameState.EVENT_TYPES.UPGRADE_COMPLETED, () => {
      this.renderUpgrades();
    });
    
    // Event-Listener für den Tab hinzufügen
    document.querySelector('[data-tab="upgrades-tab"]').addEventListener('click', () => {
      this.renderUpgrades();
    });
    
    // Initiale Darstellung
    this.renderUpgrades();
  },
  
  renderUpgrades() {
    if (!this.upgradesTab) return;
    
    // Tab leeren
    this.upgradesTab.innerHTML = '';
    
    // Einführungstext hinzufügen
    const upgradesIntro = document.createElement('div');
    upgradesIntro.className = 'tab-intro';
    upgradesIntro.innerHTML = `
      <h3>Upgrades</h3>
      <p>Investiere Gold, um deine Schmiedekunst zu verbessern und deine Produktion zu steigern.</p>
    `;
    this.upgradesTab.appendChild(upgradesIntro);
    
    // Container für die Upgrades erstellen
    const upgradesContainer = document.createElement('div');
    upgradesContainer.className = 'upgrades-container';
    
    // Prüfen, ob der Spieler sich die Upgrades leisten kann
    const canAffordHammer = GameState.resources.gold >= GameState.upgrades.hammerStrength.cost;
    const canAffordResource = GameState.resources.gold >= GameState.upgrades.resourceGain.cost;
    const canAffordCrafting = GameState.resources.gold >= GameState.upgrades.craftingSpeed.cost;
    const canAffordQuality = GameState.resources.gold >= GameState.upgrades.materialQuality.cost;
    const canAffordIdle = GameState.resources.gold >= GameState.upgrades.idleEfficiency.cost;
    
    // Upgrade-Karten erstellen
    upgradesContainer.innerHTML = `
      <div class="upgrade ${canAffordHammer ? 'can-afford' : ''}" id="hammerStrength-upgrade">
        <div class="level-badge">${GameState.upgrades.hammerStrength.level}</div>
        <h3>Hammer-Stärke</h3>
        <p>Erhöht den Fortschritt pro Klick</p>
        <p>Aktueller Effekt: <span class="effect">+${GameState.upgrades.hammerStrength.effect.toFixed(1)} Fortschritt pro Klick</span></p>
        <p>Nächste Stufe: <span class="effect">+${(1 + (GameState.upgrades.hammerStrength.level) * 0.5).toFixed(1)} Fortschritt pro Klick</span></p>
        <div class="cost">
          <i class="fas fa-coins"></i> <span id="hammer-cost">${GameState.upgrades.hammerStrength.cost}</span> Gold
        </div>
        <button class="upgrade-btn" data-upgrade="hammerStrength" ${canAffordHammer ? '' : 'disabled'}>
          ${canAffordHammer ? 'Verbessern' : 'Nicht genug Gold'}
        </button>
      </div>
      
      <div class="upgrade ${canAffordResource ? 'can-afford' : ''}" id="resourceGain-upgrade">
        <div class="level-badge">${GameState.upgrades.resourceGain.level}</div>
        <h3>Ressourcengewinn</h3>
        <p>Erhöht alle gewonnenen Ressourcen</p>
        <p>Aktueller Effekt: <span class="effect">${GameState.upgrades.resourceGain.effect.toFixed(1)}x Ressourcen-Multiplikator</span></p>
        <p>Nächste Stufe: <span class="effect">${(1 + (GameState.upgrades.resourceGain.level) * 0.2).toFixed(1)}x Ressourcen-Multiplikator</span></p>
        <div class="cost">
          <i class="fas fa-coins"></i> <span id="resource-cost">${GameState.upgrades.resourceGain.cost}</span> Gold
        </div>
        <button class="upgrade-btn" data-upgrade="resourceGain" ${canAffordResource ? '' : 'disabled'}>
          ${canAffordResource ? 'Verbessern' : 'Nicht genug Gold'}
        </button>
      </div>
      
      <div class="upgrade ${canAffordCrafting ? 'can-afford' : ''}" id="craftingSpeed-upgrade">
        <div class="level-badge">${GameState.upgrades.craftingSpeed.level}</div>
        <h3>Handwerksgeschwindigkeit</h3>
        <p>Beschleunigt die Herstellung von Gegenständen</p>
        <p>Aktueller Effekt: <span class="effect">${GameState.upgrades.craftingSpeed.effect.toFixed(1)}x Crafting-Geschwindigkeit</span></p>
        <p>Nächste Stufe: <span class="effect">${(1 + (GameState.upgrades.craftingSpeed.level) * 0.15).toFixed(1)}x Crafting-Geschwindigkeit</span></p>
        <div class="cost">
          <i class="fas fa-coins"></i> <span id="crafting-cost">${GameState.upgrades.craftingSpeed.cost}</span> Gold
        </div>
        <button class="upgrade-btn" data-upgrade="craftingSpeed" ${canAffordCrafting ? '' : 'disabled'}>
          ${canAffordCrafting ? 'Verbessern' : 'Nicht genug Gold'}
        </button>
      </div>
      
      <div class="upgrade ${canAffordQuality ? 'can-afford' : ''}" id="materialQuality-upgrade">
        <div class="level-badge">${GameState.upgrades.materialQuality.level}</div>
        <h3>Materialqualität</h3>
        <p>Erhöht die Chance auf hochwertigere Gegenstände</p>
        <p>Aktueller Effekt: <span class="effect">+${(GameState.upgrades.materialQuality.effect * 5).toFixed(0)}% Qualitätschance</span></p>
        <p>Nächste Stufe: <span class="effect">+${((1 + (GameState.upgrades.materialQuality.level) * 0.1) * 5).toFixed(0)}% Qualitätschance</span></p>
        <div class="cost">
          <i class="fas fa-coins"></i> <span id="quality-cost">${GameState.upgrades.materialQuality.cost}</span> Gold
        </div>
        <button class="upgrade-btn" data-upgrade="materialQuality" ${canAffordQuality ? '' : 'disabled'}>
          ${canAffordQuality ? 'Verbessern' : 'Nicht genug Gold'}
        </button>
      </div>
      
      <div class="upgrade ${canAffordIdle ? 'can-afford' : ''}" id="idleEfficiency-upgrade">
        <div class="level-badge">${GameState.upgrades.idleEfficiency.level}</div>
        <h3>Automatisierung</h3>
        <p>Erhöht die automatische Ressourcengewinnung</p>
        <p>Aktueller Effekt: <span class="effect">${GameState.upgrades.idleEfficiency.effect.toFixed(1)}x Idle-Effizienz</span></p>
        <p>Nächste Stufe: <span class="effect">${(1 + (GameState.upgrades.idleEfficiency.level) * 0.25).toFixed(1)}x Idle-Effizienz</span></p>
        <div class="cost">
          <i class="fas fa-coins"></i> <span id="idle-cost">${GameState.upgrades.idleEfficiency.cost}</span> Gold
        </div>
        <button class="upgrade-btn" data-upgrade="idleEfficiency" ${canAffordIdle ? '' : 'disabled'}>
          ${canAffordIdle ? 'Verbessern' : 'Nicht genug Gold'}
        </button>
      </div>
    `;
    
    this.upgradesTab.appendChild(upgradesContainer);
    
    // Event-Listener für Upgrade-Buttons hinzufügen
    const upgradeButtons = this.upgradesTab.querySelectorAll('.upgrade-btn');
    upgradeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const upgradeType = e.target.getAttribute('data-upgrade');
        this.purchaseUpgrade(upgradeType);
      });
    });
  },
  
  purchaseUpgrade(upgradeType) {
    const upgrade = GameState.upgrades[upgradeType];
    
    // Prüfen, ob das Upgrade verfügbar ist
    if (!upgrade) {
      this.showNotification("Ungültiges Upgrade", "error");
      return;
    }
    
    // Prüfen, ob genug Gold vorhanden ist
    if (GameState.resources.gold < upgrade.cost) {
      this.showNotification("Nicht genug Gold", "error");
      return;
    }
    
    // Gold abziehen
    GameState.updateResources('gold', -upgrade.cost);
    
    // Upgrade durchführen
    GameState.upgradeItem(upgradeType);
    
    // Visuellen Effekt hinzufügen
    const upgradeElement = document.getElementById(`${upgradeType}-upgrade`);
    if (upgradeElement) {
      upgradeElement.classList.add("pulse");
      setTimeout(() => {
        upgradeElement.classList.remove("pulse");
      }, 500);
    }
    
    // Benachrichtigung anzeigen
    this.showNotification(`${this.formatUpgradeName(upgradeType)} auf Stufe ${upgrade.level} verbessert!`, "success");
    
    // Erfolgs-Sound abspielen
    this.playSound("success");
    
    // Achievements prüfen
    this.checkAchievements();
    
    // Spielstand speichern
    GameState.saveGame();
    
    // Upgrade-Verfügbarkeit aktualisieren
    this.updateUpgradeAvailability();
  },
  
  updateUpgradeAvailability() {
    if (!this.upgradesTab) return;
    
    // Upgrade-Buttons entsprechend der verfügbaren Ressourcen aktivieren/deaktivieren
    Object.keys(GameState.upgrades).forEach(upgradeType => {
      const upgrade = GameState.upgrades[upgradeType];
      const button = this.upgradesTab.querySelector(`[data-upgrade="${upgradeType}"]`);
      
      if (button) {
        const canAfford = GameState.resources.gold >= upgrade.cost;
        
        button.disabled = !canAfford;
        button.textContent = canAfford ? 'Verbessern' : 'Nicht genug Gold';
        
        // Auch die Container-Klasse aktualisieren
        const container = button.closest('.upgrade');
        if (container) {
          if (canAfford) {
            container.classList.add('can-afford');
          } else {
            container.classList.remove('can-afford');
          }
        }
      }
    });
  },
  
  checkAchievements() {
    // Prüfen, ob das Upgrade-Achievement freigeschaltet werden kann
    if (!GameState.achievements.upgradeEnthusiast.earned && 
        GameState.stats.upgradesPurchased >= GameState.achievements.upgradeEnthusiast.requirement) {
      GameState.completeAchievement('upgradeEnthusiast');
      
      // Belohnung geben
      GameState.updateResources('gold', 50);
      GameState.updateResources('experience', 10);
      
      this.showNotification("Achievement freigeschaltet: Upgrade-Enthusiast!", "success");
    }
  },
  
  showNotification(message, type = "info") {
    // Event zur Benachrichtigungsanzeige auslösen
    GameState.events.dispatch('showNotification', { message, type });
  },
  
  playSound(type) {
    // Event zum Abspielen von Sounds auslösen
    GameState.events.dispatch('playSound', { type });
  },
  
  formatUpgradeName(upgradeType) {
    // Formatiert den Upgrade-Namen für die Anzeige
    const names = {
      hammerStrength: 'Hammer-Stärke',
      resourceGain: 'Ressourcengewinn',
      craftingSpeed: 'Handwerksgeschwindigkeit',
      materialQuality: 'Materialqualität',
      idleEfficiency: 'Automatisierung'
    };
    
    return names[upgradeType] || upgradeType;
  }
};

// Export des Moduls
export default UpgradeSystem;

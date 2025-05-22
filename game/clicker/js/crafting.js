/**
 * Crafting-System
 * Verwaltet die Herstellung von Gegenständen
 */

import GameState from './models/gameState.js';
import UI from './utils/ui.js';

const CraftingSystem = {
  workshopTab: null,
  queueContainer: null,
  craftingInterval: null,
  
  init() {
    // DOM-Elemente finden
    this.workshopTab = document.getElementById('workshop-tab');
    this.queueContainer = document.getElementById('crafting-queue-items');
    
    // Event-Listener für Tab-Änderungen
    GameState.events.subscribe('tabChanged', ({ detail }) => {
      if (detail.tabId === 'workshop-tab') {
        this.renderWorkshop();
      }
    });
    
    // Eventlistener für Änderungen an der Warteschlange
    GameState.events.subscribe(GameState.EVENT_TYPES.QUEUE_UPDATED, () => {
      this.renderCraftingQueue();
    });
    
    // Initiale Darstellung der Warteschlange
    this.renderCraftingQueue();
    
    // Crafting-Prozess initialisieren
    this.startCraftingProcess();
  },
  
  renderWorkshop() {
    if (!this.workshopTab) return;
    
    // Tab leeren
    this.workshopTab.innerHTML = '';
    
    // Einführungstext hinzufügen
    const workshopIntro = document.createElement('div');
    workshopIntro.className = 'tab-intro';
    workshopIntro.innerHTML = `
      <h3>Werkstatt</h3>
      <p>Stelle Gegenstände mit deinen Materialien her, um Gold und Erfahrung zu verdienen.</p>
    `;
    this.workshopTab.appendChild(workshopIntro);
    
    // Container für Rezepte erstellen
    const recipesContainer = document.createElement('div');
    recipesContainer.className = 'recipes-container';
    
    // Alle Rezepte durchgehen und Karten erstellen
    GameState.workshopRecipes.forEach(recipe => {
      // Prüfen, ob das Rezept freigeschaltet ist
      if (!recipe.unlocked) return;
      
      // Prüfen, ob genug Gold und Materialien vorhanden sind
      const canAffordGold = GameState.resources.gold >= recipe.cost;
      
      // Alle benötigten Materialien prüfen
      let materialsHTML = '';
      let canAffordMaterials = true;
      
      Object.entries(recipe.materials).forEach(([material, amount]) => {
        const available = GameState.materials[material] >= amount;
        if (!available) canAffordMaterials = false;
        
        materialsHTML += `
          <div class="material-req ${available ? 'available' : 'unavailable'}">
            ${this.formatMaterialName(material)}: ${amount}
          </div>
        `;
      });
      
      // Crafting-Karte erstellen
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe';
      recipeCard.innerHTML = `
        <h3>${recipe.name}</h3>
        <div class="recipe-details">
          <p>Benötigte Materialien:</p>
          <div class="materials-required">
            ${materialsHTML}
          </div>
          <p>Gold: <i class="fas fa-coins"></i> ${recipe.cost}</p>
          <p>Zeit: <i class="fas fa-clock"></i> ${recipe.timeNeeded}s</p>
        </div>
        <button class="craft-btn" data-recipe="${recipe.id}" ${(!canAffordGold || !canAffordMaterials) ? 'disabled' : ''}>
          ${(canAffordGold && canAffordMaterials) ? 'Herstellen' : 'Nicht genug Ressourcen'}
        </button>
      `;
      
      recipesContainer.appendChild(recipeCard);
    });
    
    this.workshopTab.appendChild(recipesContainer);
    
    // Event-Listener für Crafting-Buttons hinzufügen
    const craftButtons = this.workshopTab.querySelectorAll('.craft-btn');
    craftButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const recipeId = e.target.getAttribute('data-recipe');
        this.craftItem(recipeId);
      });
    });
  },
  
  craftItem(recipeId) {
    // Rezept finden
    const recipe = GameState.workshopRecipes.find(r => r.id === recipeId);
    if (!recipe) {
      UI.showNotification("Rezept nicht gefunden", "error");
      return;
    }
    
    // Prüfen, ob genug Gold vorhanden
    if (GameState.resources.gold < recipe.cost) {
      UI.showNotification("Nicht genug Gold", "error");
      return;
    }
    
    // Prüfen, ob genug Materialien vorhanden
    let hasMaterials = true;
    Object.entries(recipe.materials).forEach(([material, amount]) => {
      if (GameState.materials[material] < amount) {
        hasMaterials = false;
      }
    });
    
    if (!hasMaterials) {
      UI.showNotification("Nicht genug Materialien", "error");
      return;
    }
    
    // Gold abziehen
    GameState.updateResources('gold', -recipe.cost);
    
    // Materialien abziehen
    Object.entries(recipe.materials).forEach(([material, amount]) => {
      GameState.updateMaterials(material, -amount);
    });
    
    // Zur Warteschlange hinzufügen
    const craftingItem = {
      name: recipe.name,
      type: recipe.id,
      timeNeeded: recipe.timeNeeded,
      progress: 0,
      cost: recipe.cost
    };
    
    GameState.addToCraftingQueue(craftingItem);
    
    // UI aktualisieren
    UI.updateResourceDisplays();
    this.renderWorkshop();
    this.renderCraftingQueue();
    
    UI.showNotification(`${recipe.name} zur Warteschlange hinzugefügt`, "success");
  },
  
  renderCraftingQueue() {
    if (!this.queueContainer) return;
    
    // Warteschlange leeren
    this.queueContainer.innerHTML = '';
    
    // Wenn die Warteschlange leer ist
    if (GameState.craftingQueue.length === 0) {
      this.queueContainer.innerHTML = '<p class="empty-queue">Keine Gegenstände in der Herstellung</p>';
      return;
    }
    
    // Alle Items in der Warteschlange anzeigen
    GameState.craftingQueue.forEach((item, index) => {
      const isActive = index === 0;
      const progress = Math.min(100, (item.progress / item.timeNeeded) * 100);
      
      const queueItem = document.createElement('div');
      queueItem.className = `queue-item ${isActive ? 'active' : ''}`;
      queueItem.innerHTML = `
        <h4>${item.name}</h4>
        <p>${isActive ? 'In Bearbeitung' : 'In Warteschlange'}</p>
        <div class="item-progress">
          <div class="item-progress-fill" style="width: ${progress}%"></div>
        </div>
        <p>${Math.floor(item.progress)}s / ${item.timeNeeded}s</p>
        <button class="cancel-craft" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      this.queueContainer.appendChild(queueItem);
    });
    
    // Event-Listener für Abbrech-Buttons
    const cancelButtons = this.queueContainer.querySelectorAll('.cancel-craft');
    cancelButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.cancel-craft').getAttribute('data-index'));
        this.cancelCrafting(index);
      });
    });
  },
  
  startCraftingProcess() {
    // Bestehenden Intervall bereinigen
    if (this.craftingInterval) {
      clearInterval(this.craftingInterval);
    }
    
    // Alle 1 Sekunde aktualisieren
    this.craftingInterval = setInterval(() => {
      this.updateCraftingProgress();
    }, 1000);
  },
  
  updateCraftingProgress() {
    // Wenn keine Items in der Warteschlange sind, nichts tun
    if (GameState.craftingQueue.length === 0) return;
    
    // Das erste Item ist das aktive Item
    const activeItem = GameState.craftingQueue[0];
    
    // Fortschritt erhöhen basierend auf Crafting-Geschwindigkeit
    const progressIncrease = GameState.upgrades.craftingSpeed.effect;
    activeItem.progress += progressIncrease;
    
    // Prüfen, ob ein Item fertiggestellt wurde
    if (activeItem.progress >= activeItem.timeNeeded) {
      this.completeItem(activeItem);
      
      // Entferne das fertiggestellte Item aus der Warteschlange
      GameState.removeFromCraftingQueue(0);
    }
    
    // Warteschlange neu rendern
    this.renderCraftingQueue();
  },
  
  completeItem(item) {
    // Qualität berechnen
    const quality = this.calculateQuality();
    
    // Belohnungen basierend auf Qualität
    let goldReward = Math.floor(item.cost * 1.5); // Basis-Gewinn: 150% der Kosten
    let xpReward = 5; // Basis-XP
    
    // Belohnungs-Multiplikatoren basierend auf Qualität
    if (quality === "Gut") {
      goldReward = Math.floor(goldReward * 1.25);
      xpReward = 8;
    } else if (quality === "Exzellent") {
      goldReward = Math.floor(goldReward * 1.5);
      xpReward = 12;
    } else if (quality === "Legendär") {
      goldReward = Math.floor(goldReward * 2);
      xpReward = 20;
    }
    
    // Belohnungen vergeben
    GameState.updateResources('gold', goldReward);
    GameState.updateResources('experience', xpReward);
    
    // Statistiken aktualisieren
    GameState.stats.itemsCrafted++;
    
    // UI aktualisieren
    UI.updateResourceDisplays();
    
    // Sound abspielen
    GameState.events.dispatch('playSound', { type: 'success' });
    
    // Benachrichtigung anzeigen
    UI.showNotification(`${item.name} (${quality}) fertiggestellt: +${goldReward} Gold, +${xpReward} XP`, "success");
    
    // Prüfen, ob Achievements erreicht wurden
    this.checkAchievements();
    
    // Prüfen, ob Level aufsteigt
    this.checkLevelUp();
  },
  
  calculateQuality() {
    // Anwendung des Qualitäts-Upgrade-Effekts
    const qualityBonus = GameState.upgrades.materialQuality.effect * 5;
    
    // Zufälliger Wert zwischen 0 und 100
    const qualityChance = Math.random() * 100;
    
    // Qualitätsbestimmung mit Berücksichtigung von Level und Upgrade-Bonus
    if (qualityChance < (10 + GameState.level + qualityBonus)) {
      return "Legendär";
    } else if (qualityChance < (25 + GameState.level + qualityBonus)) {
      return "Exzellent";
    } else if (qualityChance < (50 + GameState.level + qualityBonus)) {
      return "Gut";
    } else {
      return "Normal";
    }
  },
  
  cancelCrafting(index) {
    // Wenn ungültiger Index, abbrechen
    if (index < 0 || index >= GameState.craftingQueue.length) return;
    
    // Item aus der Warteschlange abrufen
    const item = GameState.craftingQueue[index];
    
    // 50% der Materialkosten zurückerstatten
    const recipe = GameState.workshopRecipes.find(r => r.id === item.type);
    if (recipe) {
      // 50% des Goldes zurückerstatten
      const goldRefund = Math.floor(item.cost * 0.5);
      GameState.updateResources('gold', goldRefund);
      
      // 50% der Materialien zurückerstatten
      Object.entries(recipe.materials).forEach(([material, amount]) => {
        const refundAmount = Math.floor(amount * 0.5);
        if (refundAmount > 0) {
          GameState.updateMaterials(material, refundAmount);
        }
      });
    }
    
    // Item aus der Warteschlange entfernen
    GameState.removeFromCraftingQueue(index);
    
    // UI aktualisieren
    UI.updateResourceDisplays();
    this.renderCraftingQueue();
    
    // Benachrichtigung anzeigen
    UI.showNotification(`Herstellung abgebrochen, 50% der Ressourcen zurückerstattet`, "info");
  },
  
  checkLevelUp() {
    // XP für nächstes Level: Level * 10
    const xpRequired = GameState.level * 10;
    
    if (GameState.resources.experience >= xpRequired) {
      // XP verbrauchen
      GameState.resources.experience -= xpRequired;
      
      // Level erhöhen
      GameState.increaseLevel();
      
      // Level-Up-Benachrichtigung und Sound
      UI.showNotification(`Level Up! Du bist jetzt Level ${GameState.level}!`, "success");
      GameState.events.dispatch('playSound', { type: 'levelUp' });
      
      // Prüfen, ob neue Rezepte freigeschalten werden
      this.checkRecipeUnlocks();
      
      // UI aktualisieren
      UI.updateResourceDisplays();
    }
  },
  
  checkRecipeUnlocks() {
    // Basierend auf Level neue Rezepte freischalten
    if (GameState.level >= 3) {
      GameState.unlockRecipe('helmet');
    }
    if (GameState.level >= 5) {
      GameState.unlockRecipe('armor');
      GameState.unlockRecipe('mythrilBlade');
    }
    if (GameState.level >= 10) {
      GameState.unlockRecipe('dragonShield');
    }
  },
  
  checkAchievements() {
    // Crafting-Achievement prüfen
    if (!GameState.achievements.craftingNovice.earned && 
        GameState.stats.itemsCrafted >= GameState.achievements.craftingNovice.requirement) {
      GameState.completeAchievement('craftingNovice');
      
      // Belohnung
      GameState.updateResources('gold', 30);
      GameState.updateResources('experience', 8);
      
      // Benachrichtigung anzeigen
      UI.showNotification("Achievement freigeschaltet: Crafting-Novize!", "success");
      
      // Achievement-Sound
      GameState.events.dispatch('playSound', { type: 'achievement' });
    }
  },
  
  formatMaterialName(material) {
    const names = {
      iron: 'Eisen',
      copper: 'Kupfer',
      silver: 'Silber',
      mythril: 'Mithril',
      dragonscale: 'Drachenschuppen'
    };
    
    return names[material] || material;
  }
};

export default CraftingSystem;

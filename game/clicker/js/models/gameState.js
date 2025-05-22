/**
 * Zentrales GameState-Objekt
 * Enthält alle Spielinformationen und Spielstand-Daten
 */

const GameState = {
  // Spielressourcen
  resources: {
    gold: 0,
    materials: 0,
    experience: 0
  },
  
  // Spezifische Materialien
  materials: {
    iron: 0,
    copper: 0,
    silver: 0,
    mythril: 0,
    dragonscale: 0
  },
  
  // Spieler-Level und Fortschritt
  level: 1,
  
  // Warteschlange für Herstellung 
  craftingQueue: [],
  
  // Spieleinstellungen
  isSoundOn: true,
  
  // Schmiedefortschritt
  forgeProgress: 0,
  forgeGoal: 10,
  
  // Spielstatistiken
  stats: {
    totalClicks: 0,
    itemsCrafted: 0,
    upgradesPurchased: 0,
    goldEarned: 0,
    materialsGathered: 0,
    experienceGained: 0
  },
  
  // Upgrade-Status und -Effekte
  upgrades: {
    hammerStrength: { level: 1, cost: 50, effect: 1 },
    resourceGain: { level: 1, cost: 75, effect: 1 },
    craftingSpeed: { level: 1, cost: 100, effect: 1 },
    materialQuality: { level: 1, cost: 150, effect: 1 },
    idleEfficiency: { level: 1, cost: 200, effect: 1 }
  },
  
  // Achievement-Daten
  achievements: {
    clickMaster: { earned: false, requirement: 100, description: "Click the forge 100 times" },
    craftingNovice: { earned: false, requirement: 10, description: "Craft 10 items" },
    materialCollector: { earned: false, requirement: 500, description: "Collect 500 materials" },
    upgradeEnthusiast: { earned: false, requirement: 5, description: "Purchase 5 upgrades" },
    goldHoarder: { earned: false, requirement: 1000, description: "Collect 1000 gold" }
  },
  
  // Rezepte für Gegenstände
  workshopRecipes: [
    { id: 'sword', name: 'Iron Sword', cost: 30, materials: { iron: 5 }, timeNeeded: 10, unlocked: true },
    { id: 'shield', name: 'Steel Shield', cost: 50, materials: { iron: 8, copper: 3 }, timeNeeded: 15, unlocked: true },
    { id: 'helmet', name: 'Knight Helmet', cost: 40, materials: { iron: 6, silver: 2 }, timeNeeded: 12, unlocked: false },
    { id: 'armor', name: 'Plate Armor', cost: 100, materials: { iron: 15, silver: 5 }, timeNeeded: 25, unlocked: false },
    { id: 'mythrilBlade', name: 'Mythril Blade', cost: 200, materials: { mythril: 8, silver: 4 }, timeNeeded: 30, unlocked: false },
    { id: 'dragonShield', name: 'Dragon Shield', cost: 350, materials: { dragonscale: 3, mythril: 5 }, timeNeeded: 40, unlocked: false }
  ],
  
  // Event-System für modulare Kommunikation
  events: {
    dispatch(eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.dispatchEvent(event);
    },
    
    subscribe(eventName, callback) {
      document.addEventListener(eventName, callback);
    },
    
    unsubscribe(eventName, callback) {
      document.removeEventListener(eventName, callback);
    }
  },
  
  // Methoden zum Aktualisieren des Spielstatus
  updateResources(type, amount) {
    this.resources[type] += amount;
    
    // Statistiken aktualisieren
    if (type === 'gold' && amount > 0) {
      this.stats.goldEarned += amount;
    } else if (type === 'experience' && amount > 0) {
      this.stats.experienceGained += amount;
    }
    
    // Event auslösen
    this.events.dispatch('resourcesUpdated', { type, amount, new: this.resources[type] });
  },
  
  updateMaterials(type, amount) {
    if (!this.materials.hasOwnProperty(type)) return false;
    
    this.materials[type] += amount;
    
    // Statistik aktualisieren bei Materialgewinn
    if (amount > 0) {
      this.stats.materialsGathered += amount;
    }
    
    // Event auslösen
    this.events.dispatch('materialsUpdated', { type, amount, new: this.materials[type] });
    return true;
  },
  
  increaseLevel() {
    this.level += 1;
    
    // Aktualisierung der Schmiede-Effizienz
    this.forgeGoal = Math.max(5, 10 - this.level / 2);
    
    // Event auslösen
    this.events.dispatch('levelUp', { level: this.level });
  },
  
  addToCraftingQueue(item) {
    this.craftingQueue.push(item);
    this.events.dispatch('queueUpdated', { queue: this.craftingQueue });
  },
  
  removeFromCraftingQueue(index) {
    if (index >= 0 && index < this.craftingQueue.length) {
      const item = this.craftingQueue.splice(index, 1)[0];
      this.events.dispatch('queueUpdated', { queue: this.craftingQueue });
      return item;
    }
    return null;
  },
  
  upgradeItem(type) {
    if (!this.upgrades.hasOwnProperty(type)) return false;
    
    const upgrade = this.upgrades[type];
    
    // Level erhöhen
    upgrade.level += 1;
    
    // Effekt neu berechnen
    switch(type) {
      case 'hammerStrength':
        upgrade.effect = 1 + (upgrade.level - 1) * 0.5;
        break;
      case 'resourceGain':
        upgrade.effect = 1 + (upgrade.level - 1) * 0.2;
        break;
      case 'craftingSpeed':
        upgrade.effect = 1 + (upgrade.level - 1) * 0.15;
        break;
      case 'materialQuality':
        upgrade.effect = 1 + (upgrade.level - 1) * 0.1;
        break;
      case 'idleEfficiency':
        upgrade.effect = 1 + (upgrade.level - 1) * 0.25;
        break;
    }
    
    // Kosten für nächstes Upgrade berechnen
    upgrade.cost = Math.floor(upgrade.cost * 1.5);
    
    // Statistik aktualisieren
    this.stats.upgradesPurchased += 1;
    
    // Event auslösen
    this.events.dispatch('upgradeCompleted', { type, level: upgrade.level, effect: upgrade.effect });
    
    return true;
  },
  
  unlockRecipe(id) {
    const recipe = this.workshopRecipes.find(r => r.id === id);
    if (recipe && !recipe.unlocked) {
      recipe.unlocked = true;
      this.events.dispatch('recipeUnlocked', { id, recipe });
      return true;
    }
    return false;
  },
  
  completeAchievement(id) {
    if (this.achievements[id] && !this.achievements[id].earned) {
      this.achievements[id].earned = true;
      
      // Get the achievement object
      const achievement = this.achievements[id];
      
      // Handle hidden achievement reveal - update name and description if it was secret
      if (achievement.secret) {
        achievement.name = achievement.realName || achievement.name;
        achievement.description = achievement.realDescription || achievement.description;
        achievement.icon = achievement.realIcon || achievement.icon;
      }
      
      // Apply rewards if they exist
      if (achievement.reward) {
        if (achievement.reward.gold) {
          this.updateResources('gold', achievement.reward.gold);
        }
        if (achievement.reward.experience) {
          this.updateResources('experience', achievement.reward.experience);
        }
      }
      
      // Dispatch achievement earned event
      this.events.dispatch(this.EVENT_TYPES.ACHIEVEMENT_EARNED, { 
        id, 
        achievement: this.achievements[id],
        wasSecret: achievement.secret 
      });
      
      return true;
    }
    return false;
  },
  
  // Spielstand speichern
  saveGame() {
    const gameData = {
      resources: this.resources,
      materials: this.materials,
      level: this.level,
      craftingQueue: this.craftingQueue,
      isSoundOn: this.isSoundOn,
      stats: this.stats,
      upgrades: this.upgrades,
      achievements: this.achievements,
      workshopRecipes: this.workshopRecipes.map(r => ({
        id: r.id,
        unlocked: r.unlocked
      })),
      timestamp: Date.now()
    };
    
    // Erstelle ein einfaches Prüfsumme für Datenvalidierung
    const checksum = this.generateChecksum(gameData);
    
    // Speichere Daten mit Prüfsumme
    const saveData = {
      gameData: gameData,
      checksum: checksum,
      version: '1.0'
    };
    
    try {
      localStorage.setItem('blacksmithGame', JSON.stringify(saveData));
      localStorage.setItem('blacksmithLastTimestamp', Date.now().toString());
      this.events.dispatch('gameSaved', { success: true });
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern des Spielstands:', error);
      this.events.dispatch('gameSaved', { success: false, error: error.message });
      return false;
    }
  },
  
  // Spielstand laden
  loadGame() {
    const savedGame = localStorage.getItem('blacksmithGame');
    if (!savedGame) return false;
    
    try {
      const saveData = JSON.parse(savedGame);
      
      // Prüfe ob das Speicherformat gültig ist
      if (!saveData.gameData || !saveData.checksum) {
        console.warn('Ungültiges Speicherformat, starte mit neuem Spiel');
        return false;
      }
      
      // Validiere die Prüfsumme, um Manipulationen zu erkennen
      const calculatedChecksum = this.generateChecksum(saveData.gameData);
      if (calculatedChecksum !== saveData.checksum) {
        console.warn('Spielstand-Validierung fehlgeschlagen, mögliche Manipulation erkannt');
        return false;
      }
      
      const gameData = saveData.gameData;
      
      // Ressourcen aktualisieren
      Object.assign(this.resources, gameData.resources);
      
      // Materialien aktualisieren
      Object.assign(this.materials, gameData.materials);
      
      // Level und Fortschritt aktualisieren
      this.level = gameData.level;
      this.forgeGoal = Math.max(5, 10 - this.level / 2);
      
      // Crafting-Warteschlange aktualisieren
      this.craftingQueue = gameData.craftingQueue || [];
      
      // Einstellungen
      this.isSoundOn = gameData.isSoundOn !== undefined ? gameData.isSoundOn : true;
      
      // Statistiken
      Object.assign(this.stats, gameData.stats);
      
      // Upgrades
      Object.assign(this.upgrades, gameData.upgrades);
      
      // Achievements
      Object.assign(this.achievements, gameData.achievements);
      
      // Freischaltungsstatus der Rezepte aktualisieren
      if (gameData.workshopRecipes) {
        gameData.workshopRecipes.forEach(savedRecipe => {
          const recipe = this.workshopRecipes.find(r => r.id === savedRecipe.id);
          if (recipe) {
            recipe.unlocked = savedRecipe.unlocked;
          }
        });
      }
      
      this.events.dispatch('gameLoaded', { success: true });
      return true;
    } catch (error) {
      console.error('Fehler beim Laden des Spielstands:', error);
      this.events.dispatch('gameLoaded', { success: false, error: error.message });
      return false;
    }
  },
  
  // Einfacher Checksum-Generator für Spielstandvalidierung
  generateChecksum(data) {
    const versionSalt = "blacksmith_v1";
    const baseString = versionSalt + 
      this.level + 
      this.resources.gold + 
      this.resources.materials + 
      this.resources.experience + 
      this.stats.totalClicks + 
      this.stats.itemsCrafted + 
      Object.keys(this.upgrades).map(u => this.upgrades[u].level).join('');
    
    let hash = 0;
    for (let i = 0; i < baseString.length; i++) {
      const char = baseString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return hash.toString(16);
  },
  
  // Spielstand zurücksetzen
  resetGame() {
    try {
      localStorage.removeItem('blacksmithGame');
      localStorage.removeItem('blacksmithLastTimestamp');
      return true;
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Spielstands:', error);
      return false;
    }
  },
  
  // Spielstand validieren
  validateGameState() {
    try {
      // Check if required properties exist
      if (!this.resources || !this.materials || !this.upgrades) {
        console.error('Spielstandvalidierung fehlgeschlagen: Fehlende Eigenschaften');
        return false;
      }
    } catch (error) {
      console.error('Fehler bei der Spielstandvalidierung:', error);
      return false;
    }
    
    return true;
  }
};

// Definition der Event-Typen für bessere Konsistenz
GameState.EVENT_TYPES = {
  RESOURCES_UPDATED: 'resourcesUpdated',
  MATERIALS_UPDATED: 'materialsUpdated',
  LEVEL_UP: 'levelUp',
  QUEUE_UPDATED: 'queueUpdated',
  UPGRADE_COMPLETED: 'upgradeCompleted',
  RECIPE_UNLOCKED: 'recipeUnlocked',
  ACHIEVEMENT_EARNED: 'achievementEarned',
  GAME_SAVED: 'gameSaved',
  GAME_LOADED: 'gameLoaded'
};

// Export des Moduls
export default GameState;

/**
 * Forge-System
 * Implementiert die Hauptmechanik des Hammers und der Schmiede
 */

import GameState from './models/gameState.js';
import UI from './utils/ui.js';

const ForgeSystem = {
  forgeHammer: null,
  forgeProgressBar: null,
  forgeProgressText: null,
  
  init() {
    // Elemente abrufen
    this.forgeHammer = document.getElementById('forge-hammer');
    this.forgeProgressBar = document.getElementById('forge-progress-fill');
    this.forgeProgressText = document.getElementById('forge-progress-text');
    
    // Event-Listener für Hammer-Klicks
    if (this.forgeHammer) {
      this.forgeHammer.addEventListener('click', (e) => this.handleHammerClick(e));
    }
    
    // Initialisiere die Fortschrittsanzeige
    this.updateForgeProgressDisplay();
  },
  
  handleHammerClick(e) {
    // Statistik aktualisieren
    GameState.stats.totalClicks++;
    
    // Hammer-Animation abspielen
    this.animateHammer();
    
    // Audio-Feedback
    GameState.events.dispatch('playSound', { type: 'forge' });
    
    // Fortschritt basierend auf Hammer-Stärke erhöhen
    const progressIncrease = GameState.upgrades.hammerStrength.effect;
    GameState.forgeProgress += progressIncrease;
    
    // Visuelles Feedback durch Pop-Up
    this.createProgressPopup(e, progressIncrease);
    
    // Prüfen, ob ein Schmiedezyklus abgeschlossen wurde
    if (GameState.forgeProgress >= GameState.forgeGoal) {
      this.completeForgeAction();
    }
    
    // UI aktualisieren
    this.updateForgeProgressDisplay();
    
    // Prüfen, ob Achievements erreicht wurden
    this.checkAchievements();
  },
  
  completeForgeAction() {
    // Ressourcengenerierung
    const resourceMultiplier = GameState.upgrades.resourceGain.effect;
    
    // Zufällige Goldmenge (1-5) * Multiplikator
    const goldGained = Math.floor((1 + Math.random() * 4) * resourceMultiplier);
    GameState.updateResources('gold', goldGained);
    
    // Zufällige Materialmenge (1-3) * Multiplikator
    const materialsGained = Math.floor((1 + Math.random() * 2) * resourceMultiplier);
    GameState.updateResources('materials', materialsGained);
    
    // Zufällige Erfahrungspunkte (1-2) * Multiplikator
    const xpGained = Math.floor((1 + Math.random()) * resourceMultiplier);
    GameState.updateResources('experience', xpGained);
    
    // Fortschritt zurücksetzen (Überschuss mitnehmen)
    GameState.forgeProgress = GameState.forgeProgress - GameState.forgeGoal;
    
    // Erfolgs-Sound abspielen
    GameState.events.dispatch('playSound', { type: 'success' });
    
    // Ressourcen-Popup anzeigen
    this.showResourcesGainedMessage(goldGained, materialsGained, xpGained);
    
    // UI aktualisieren
    UI.updateResourceDisplays();
    
    // Prüfen, ob Level aufsteigt
    this.checkLevelUp();
  },
  
  checkLevelUp() {
    // XP für nächstes Level: Level * 10
    const xpRequired = GameState.level * 10;
    
    if (GameState.resources.experience >= xpRequired) {
      // XP verbrauchen
      GameState.resources.experience -= xpRequired;
      
      // Level erhöhen
      GameState.increaseLevel();
      
      // Level-Up-Animation und Sound
      this.showLevelUpMessage();
      GameState.events.dispatch('playSound', { type: 'levelUp' });
      
      // UI aktualisieren
      UI.updateResourceDisplays();
    }
  },
  
  animateHammer() {
    if (!this.forgeHammer) return;
    
    // Hammer-Animation-Klasse hinzufügen
    this.forgeHammer.classList.add('hammer-animation');
    
    // Klasse nach Animation entfernen
    setTimeout(() => {
      this.forgeHammer.classList.remove('hammer-animation');
    }, 300);
  },
  
  createProgressPopup(e, amount) {
    if (!this.forgeHammer) return;
    
    // Popup-Element für Fortschritt erstellen
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${amount.toFixed(1)}`;
    
    // Position basierend auf Klick
    const rect = this.forgeHammer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    // Zum Hammer-Container hinzufügen
    this.forgeHammer.appendChild(popup);
    
    // Nach Animation entfernen
    setTimeout(() => {
      popup.remove();
    }, 1000);
  },
  
  showResourcesGainedMessage(gold, materials, xp) {
    let message = 'Geschmiedet!';
    if (gold > 0) message += ` +${gold} Gold`;
    if (materials > 0) message += ` +${materials} Materialien`;
    if (xp > 0) message += ` +${xp} XP`;
    
    UI.showNotification(message, 'success');
  },
  
  showLevelUpMessage() {
    UI.showNotification(`Level Up! Du bist jetzt Level ${GameState.level}!`, 'success');
  },
  
  updateForgeProgressDisplay() {
    if (this.forgeProgressBar) {
      // Prozentsatz des Fortschritts berechnen
      const progressPercent = (GameState.forgeProgress / GameState.forgeGoal) * 100;
      this.forgeProgressBar.style.width = `${Math.min(100, progressPercent)}%`;
    }
    
    if (this.forgeProgressText) {
      this.forgeProgressText.textContent = `${GameState.forgeProgress.toFixed(1)} / ${GameState.forgeGoal.toFixed(1)}`;
    }
  },
  
  checkAchievements() {
    // Click Master Achievement prüfen
    if (!GameState.achievements.clickMaster.earned && 
        GameState.stats.totalClicks >= GameState.achievements.clickMaster.requirement) {
      GameState.completeAchievement('clickMaster');
      
      // Belohnung
      GameState.updateResources('gold', 25);
      GameState.updateResources('experience', 5);
      
      // Benachrichtigung anzeigen
      UI.showNotification("Achievement freigeschaltet: Click Master!", "success");
      
      // Achievement-Sound
      GameState.events.dispatch('playSound', { type: 'achievement' });
    }
  }
};

export default ForgeSystem;
